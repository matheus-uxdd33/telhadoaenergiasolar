import { Router, Response } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";

const router = Router();

// GET /api/alerts
router.get("/", (req: AuthRequest, res: Response) => {
  const { type = "all", status = "all" } = req.query;

  const alerts = [
    {
      id: "1",
      title: "Sistema operacional",
      description: "Sistema funcionando dentro dos parâmetros",
      type: "info",
      severity: "low",
      detectedAt: new Date().toISOString(),
      status: "open",
    },
    {
      id: "2",
      title: "Produção acima do esperado",
      description: "Inversor gerando 110% da previsão",
      type: "success",
      severity: "low",
      detectedAt: new Date().toISOString(),
      status: "open",
    },
  ];

  res.json({ alerts });
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
