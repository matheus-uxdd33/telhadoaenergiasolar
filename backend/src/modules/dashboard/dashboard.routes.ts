import { Router, Response } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

const router = Router();

// GET /api/dashboard/summary
router.get("/summary", (req: AuthRequest, res: Response) => {
  res.json({
    systemStatus: "online",
    currentGeneration: 4.2,
    todayGeneration: 18.5,
    monthGeneration: 582.3,
    estimatedSavings: 289.15,
    systemAvailability: 99.8,
    lastSync: new Date().toISOString(),
  });
});

// GET /api/dashboard/charts
router.get("/charts", (req: AuthRequest, res: Response) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split("T")[0],
      generation: Math.random() * 20 + 10,
      expected: 15,
    });
  }

  res.json({
    dailyChart: days,
    monthChart: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      generation: Math.random() * 500 + 400,
      expected: 450,
    })),
  });
});

// GET /api/dashboard/alerts
router.get("/alerts", (req: AuthRequest, res: Response) => {
  res.json({
    alerts: [
      {
        id: "alert-1",
        title: "Sistemas dentro dos padrões",
        description: "Sistema rodando normalmente",
        type: "info",
        severity: "low",
        detectedAt: new Date().toISOString(),
        status: "open",
      },
    ],
  });
});

export default router;
