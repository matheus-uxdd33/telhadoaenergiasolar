import { Router, Response } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { getLiveAlertsForUser } from "../system/system.service";

const router = Router();

// GET /api/alerts
router.get("/", async (req: AuthRequest, res: Response) => {
  const emergencyOnly = !req.user?.features?.includes("history");
  const liveAlerts = await getLiveAlertsForUser(req.user);

  const alerts = emergencyOnly
    ? liveAlerts.filter((alert) => ["high", "critical", "medium"].includes(alert.severity))
    : liveAlerts;

  res.json({ alerts, emergencyOnly, planCode: req.user?.planCode });
});
// GET /api/alerts/:id
router.get("/:id", (req: AuthRequest, res: Response) => {
  res.json({
    id: req.params.id,
    title: "Alerta detalhado",
    description: "Descrição completa do alerta",
    recommendation: "Nenhuma ação necessária",
  });
});

export default router;
