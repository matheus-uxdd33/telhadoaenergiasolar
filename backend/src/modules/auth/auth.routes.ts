import { Router, Request, Response } from "express";
import { z } from "zod";
import { supabase, supabaseAdmin, hasSupabaseEnv } from "../../database/supabase";
import { authenticate, AuthRequest } from "../../common/middlewares/auth.middleware";
import { generateToken } from "../../common/utils/jwt";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  name: z.string().min(2).optional(),
  tenantId: z.string().optional(),
});

router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password, name, tenantId } = parsed.data;

  if (!hasSupabaseEnv || !supabaseAdmin) {
    return res.status(400).json({
      error: "Supabase não configurado. Preencha SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY no .env.",
    });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: name || email.split("@")[0],
      tenant_id: tenantId || "tenant-demo",
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({
    message: "Usuário criado com sucesso no Supabase Auth",
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || name || email.split("@")[0],
      tenantId: data.user.user_metadata?.tenant_id || tenantId || "tenant-demo",
    },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  if (!hasSupabaseEnv || !supabase) {
    const token = generateToken({
      userId: "user-123",
      tenantId: "tenant-demo",
      email,
    });

    return res.json({
      token,
      refreshToken: null,
      user: {
        id: "user-123",
        email,
        name: email.split("@")[0] || "Cliente",
        tenantId: "tenant-demo",
      },
      mode: "demo",
      message: "Supabase não configurado; login demo liberado para desenvolvimento local.",
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: error?.message || "Falha ao autenticar no Supabase" });
  }

  return res.json({
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || email.split("@")[0] || "Cliente",
      tenantId: data.user.user_metadata?.tenant_id || "tenant-demo",
    },
    mode: "supabase",
  });
});

router.get("/me", authenticate, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

router.post("/logout", (_req: Request, res: Response) => {
  return res.json({ message: "Desconectado com sucesso" });
});

export default router;
