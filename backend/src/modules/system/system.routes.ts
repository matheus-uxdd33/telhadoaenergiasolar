import { Router, Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import {
  getSystemInfo,
  listSupportedProviders,
  saveSystemConfiguration,
  testInverterConnection,
} from "./system.service";

const router = Router();

const connectionSchema = z.object({
  brandCode: z.string().min(1, "Marca obrigatória"),
  model: z.string().min(1, "Modelo obrigatório"),
  installedPower: z.coerce.number().min(0, "Potência inválida"),
  location: z.string().min(2, "Localização obrigatória"),
  distributor: z.string().min(2, "Distribuidora obrigatória"),
  authMethod: z.enum(["credentials", "token", "serial", "manual_assisted"]),
  username: z.string().optional(),
  password: z.string().optional(),
  apiToken: z.string().optional(),
  apiBaseUrl: z.string().optional(),
  deviceId: z.string().optional(),
});

router.get("/", async (req: AuthRequest, res: Response) => {
  const system = await getSystemInfo(req.user);
  res.json(system);
});

router.get("/brands", (_req: AuthRequest, res: Response) => {
  res.json({ brands: listSupportedProviders() });
});

router.post("/test-connection", async (req: AuthRequest, res: Response) => {
  const parsed = connectionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await testInverterConnection(parsed.data);
  return res.json(result);
});

router.put("/credentials", async (req: AuthRequest, res: Response) => {
  const parsed = connectionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  const result = await saveSystemConfiguration(req.user, parsed.data);

  return res.json({
    success: true,
    message: result.testResult.message || "Integração do inversor atualizada.",
    test: result.testResult,
    system: result.system,
  });
});

export default router;
