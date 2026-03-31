import { Request, Response, Router } from "express";
import { z } from "zod";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import {
  confirmDevelopmentPayment,
  createCheckout,
  getCurrentSubscription,
  handlePagBankWebhook,
} from "./billing.service";
import { PLAN_CATALOG } from "./plans";

const router = Router();

const checkoutSchema = z.object({
  planCode: z.enum([
    "emergency_7d",
    "residencial_full",
    "combo_residencial",
    "empresa_premium",
  ]),
  paymentMethod: z.enum(["pix", "card"]),
});

export const billingWebhookHandler = async (req: Request, res: Response) => {
  const result = await handlePagBankWebhook(req.body);
  return res.json(result);
};

router.get("/plans", (_req: AuthRequest, res: Response) => {
  return res.json({ plans: PLAN_CATALOG });
});

router.get("/current", async (req: AuthRequest, res: Response) => {
  const subscription = await getCurrentSubscription({
    tenantId: req.user?.tenantId || "tenant-demo",
    userId: req.user?.userId,
    email: req.user?.email,
    name: req.user?.name,
    planCode: req.user?.planCode,
    planStatus: req.user?.planStatus,
  });

  return res.json({ subscription });
});

router.post("/checkout", async (req: AuthRequest, res: Response) => {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await createCheckout({
      tenantId: req.user?.tenantId || "tenant-demo",
      userId: req.user?.userId,
      userEmail: req.user?.email || "cliente@solar.com",
      userName: req.user?.name,
      planCode: parsed.data.planCode,
      paymentMethod: parsed.data.paymentMethod,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      error: error?.message || "Falha ao gerar cobrança no PagBank.",
    });
  }
});

router.post("/payments/:paymentId/confirm-dev", async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await confirmDevelopmentPayment(
      req.user?.tenantId || "tenant-demo",
      req.params.paymentId
    );

    return res.json({
      message: "Pagamento confirmado com sucesso no modo de desenvolvimento.",
      subscription,
    });
  } catch (error: any) {
    return res.status(404).json({
      error: error?.message || "Pagamento não encontrado.",
    });
  }
});

export default router;
