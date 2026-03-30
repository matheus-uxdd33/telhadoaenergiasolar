import { Router, Response } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

const router = Router();

// GET /api/profile
router.get("/", (req: AuthRequest, res: Response) => {
  res.json({
    id: req.user?.userId,
    email: req.user?.email,
    name: "João Solar",
    phone: "(11) 99999-9999",
    country: "Brasil",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
  });
});

// PUT /api/profile
router.put("/", (req: AuthRequest, res: Response) => {
  const { name, phone, language, timezone } = req.body;
  res.json({ success: true, message: "Perfil atualizado" });
});

export default router;
