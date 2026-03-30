import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin, hasSupabaseEnv } from "../../database/supabase";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
    email: string;
    name?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token ausente" });
  }

  try {
    if (hasSupabaseEnv && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !data.user) {
        return res.status(401).json({ error: error?.message || "Token Supabase inválido" });
      }

      req.user = {
        userId: data.user.id,
        tenantId: (data.user.user_metadata?.tenant_id as string) || "tenant-demo",
        email: data.user.email || "",
        name: (data.user.user_metadata?.name as string) || "Cliente",
      };

      return next();
    }

    const secret = process.env.JWT_SECRET || "super-secret-demo-key";
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      name: decoded.name,
    };
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
