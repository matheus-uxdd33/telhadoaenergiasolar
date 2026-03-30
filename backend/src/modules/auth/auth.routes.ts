import { Router, Request, Response } from "express";
import { generateToken } from "../../common/utils/jwt";

const router = Router();

// Login demo
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Demo: aceita qualquer email/password
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const token = generateToken({
    userId: "user-123",
    tenantId: "tenant-123",
    email,
  });

  res.json({
    token,
    user: {
      id: "user-123",
      email,
      name: email.split("@")[0] || "Cliente",
      tenantId: "tenant-123",
    },
  });
});

// Logout
router.post("/logout", (req: Request, res: Response) => {
  res.json({ message: "Desconectado com sucesso" });
});

export default router;
