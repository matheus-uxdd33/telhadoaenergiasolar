import { Router, Response } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

const router = Router();

// GET /api/system
router.get("/", (req: AuthRequest, res: Response) => {
  res.json({
    inverterBrand: "Growatt",
    inverterModel: "SPF 5000-3",
    installedPower: 5000,
    location: "São Paulo, SP",
    distributor: "ENEL",
    connectionMethod: "WiFi",
    lastSync: new Date().toISOString(),
    connectionStatus: "connected",
  });
});

// POST /api/system/test-connection
router.post("/test-connection", (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: "Conexão testada com sucesso" });
});

// PUT /api/system/credentials
router.put("/credentials", (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;
  res.json({ success: true, message: "Credenciais atualizadas" });
});

export default router;
