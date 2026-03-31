import { Router, Response } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { getLiveTelemetryForUser } from "../system/system.service";

const router = Router();

// GET /api/dashboard/summary
router.get("/summary", async (req: AuthRequest, res: Response) => {
  const hasHistory = req.user?.features?.includes("history");
  const telemetry = await getLiveTelemetryForUser(req.user);

  res.json({
    systemStatus: telemetry.systemStatus,
    currentGeneration: telemetry.currentGeneration,
    todayGeneration: telemetry.todayGeneration,
    monthGeneration: hasHistory ? telemetry.monthGeneration : 0,
    estimatedSavings: hasHistory ? telemetry.estimatedSavings : 0,
    systemAvailability: hasHistory ? telemetry.systemAvailability : Math.max(telemetry.systemAvailability - 2, 0),
    lastSync: telemetry.lastSync,
    plan: {
      code: req.user?.planCode,
      status: req.user?.planStatus,
      features: req.user?.features || [],
    },
  });
});

// GET /api/dashboard/charts
router.get("/charts", async (req: AuthRequest, res: Response) => {
  if (!req.user?.features?.includes("history")) {
    return res.status(403).json({
      error: "Seu plano atual não possui acesso ao histórico detalhado.",
    });
  }

  const telemetry = await getLiveTelemetryForUser(req.user);
  const baseGeneration = Math.max(telemetry.currentGeneration, 0.4);
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split("T")[0],
      generation: Number((baseGeneration * (0.75 + i * 0.04)).toFixed(2)),
      expected: Number((baseGeneration * 1.08).toFixed(2)),
    });
  }

  res.json({
    dailyChart: days,
    monthChart: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      generation: Number((telemetry.todayGeneration * (0.85 + (i % 5) * 0.03)).toFixed(2)),
      expected: Number((telemetry.todayGeneration * 1.05).toFixed(2)),
    })),
  });
});

// GET /api/dashboard/alerts
router.get("/alerts", async (req: AuthRequest, res: Response) => {
  const telemetry = await getLiveTelemetryForUser(req.user);
  res.json({ alerts: telemetry.alerts });
});

export default router;
