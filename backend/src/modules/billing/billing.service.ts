import { randomUUID } from "crypto";
import { supabaseAdmin } from "../../database/supabase";
import { getPlanByCode, PaymentMethod, PlanCode } from "./plans";

export type SubscriptionStatus = "trial" | "pending" | "active" | "expired";

export interface SubscriptionState {
  tenantId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  planCode: PlanCode;
  planName: string;
  status: SubscriptionStatus;
  amount: number;
  cycleLabel: string;
  features: string[];
  maxSites: number;
  maxUsers: number;
  paymentMethod?: PaymentMethod;
  lastPaymentId?: string;
  checkoutUrl?: string;
  pixCode?: string;
  qrCodeBase64?: string;
  expiresAt: string;
  updatedAt: string;
}

interface SubscriptionSeed {
  tenantId: string;
  userId?: string;
  email?: string;
  name?: string;
  planCode?: string;
  planStatus?: string;
}

interface CheckoutInput {
  tenantId: string;
  userId?: string;
  userEmail: string;
  userName?: string;
  planCode: PlanCode;
  paymentMethod: PaymentMethod;
}

interface LiveCheckoutResponse {
  paymentId: string;
  status: "pending";
  message: string;
  checkoutUrl?: string;
  pixCode?: string;
  qrCodeBase64?: string;
  expiresAt?: string;
}

const subscriptionStore = new Map<string, SubscriptionState>();

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const mapPlanToSubscription = (
  seed: SubscriptionSeed,
  override?: Partial<SubscriptionState>
): SubscriptionState => {
  const plan = getPlanByCode(seed.planCode);
  const status = (seed.planStatus as SubscriptionStatus) || "trial";

  return {
    tenantId: seed.tenantId,
    userId: seed.userId,
    userEmail: seed.email,
    userName: seed.name,
    planCode: plan.code,
    planName: plan.name,
    status,
    amount: plan.price,
    cycleLabel: plan.cycleLabel,
    features: plan.features,
    maxSites: plan.limits.maxSites,
    maxUsers: plan.limits.maxUsers,
    expiresAt: plan.code === "emergency_7d" ? addDays(7) : addDays(30),
    updatedAt: new Date().toISOString(),
    ...override,
  };
};

const syncSubscriptionToSupabaseUser = async (subscription: SubscriptionState) => {
  if (!supabaseAdmin || !subscription.userId) return;

  try {
    await supabaseAdmin.auth.admin.updateUserById(subscription.userId, {
      user_metadata: {
        name: subscription.userName,
        tenant_id: subscription.tenantId,
        plan_code: subscription.planCode,
        plan_status: subscription.status,
        plan_name: subscription.planName,
      },
    });
  } catch (error) {
    console.warn("PagBank/Supabase sync warning:", error);
  }
};

export const getCurrentSubscription = async (seed: SubscriptionSeed) => {
  const existing = subscriptionStore.get(seed.tenantId);

  if (existing) {
    const merged = {
      ...existing,
      userId: existing.userId || seed.userId,
      userEmail: existing.userEmail || seed.email,
      userName: existing.userName || seed.name,
    };
    subscriptionStore.set(seed.tenantId, merged);
    return merged;
  }

  const subscription = mapPlanToSubscription(seed);
  subscriptionStore.set(seed.tenantId, subscription);
  await syncSubscriptionToSupabaseUser(subscription);
  return subscription;
};

const createPixSvg = (paymentId: string) => {
  const safeCode = paymentId.slice(0, 12);
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
      <rect width="220" height="220" fill="#ffffff"/>
      <rect x="10" y="10" width="200" height="200" fill="#0f172a" rx="18"/>
      <text x="110" y="102" text-anchor="middle" fill="#22c55e" font-size="16" font-family="Arial">PIX</text>
      <text x="110" y="128" text-anchor="middle" fill="#ffffff" font-size="12" font-family="Arial">${safeCode}</text>
    </svg>
  `)}`;
};

const createMockCheckout = async (input: CheckoutInput) => {
  const paymentId = `mock_${randomUUID()}`;
  const base = mapPlanToSubscription(
    {
      tenantId: input.tenantId,
      userId: input.userId,
      email: input.userEmail,
      name: input.userName,
      planCode: input.planCode,
      planStatus: input.paymentMethod === "card" ? "active" : "pending",
    },
    {
      paymentMethod: input.paymentMethod,
      lastPaymentId: paymentId,
      checkoutUrl:
        input.paymentMethod === "card"
          ? `https://pagbank.com.br/checkout/${paymentId}`
          : undefined,
      pixCode:
        input.paymentMethod === "pix"
          ? `00020126580014BR.GOV.BCB.PIX0136solar-${paymentId}5204000053039865405${getPlanByCode(input.planCode).price.toFixed(2)}5802BR5924TELHADO ENERGIA SOLAR6009SAO PAULO62120508PAGBANK6304ABCD`
          : undefined,
      qrCodeBase64: input.paymentMethod === "pix" ? createPixSvg(paymentId) : undefined,
    }
  );

  subscriptionStore.set(input.tenantId, base);
  await syncSubscriptionToSupabaseUser(base);

  return {
    mode: "mock" as const,
    paymentId,
    status: input.paymentMethod === "card" ? ("paid" as const) : ("pending" as const),
    message:
      input.paymentMethod === "pix"
        ? "Cobrança PIX gerada. Após a confirmação, o plano será liberado automaticamente."
        : "Checkout de cartão gerado. No modo local, o plano foi liberado para demonstração.",
    checkoutUrl: base.checkoutUrl,
    pixCode: base.pixCode,
    qrCodeBase64: base.qrCodeBase64,
    expiresAt: base.expiresAt,
    subscription: base,
  };
};

const createLivePagBankCheckout = async (input: CheckoutInput): Promise<LiveCheckoutResponse> => {
  const pagBankToken = process.env.PAGBANK_TOKEN;
  const pagBankApiUrl = process.env.PAGBANK_API_URL || "https://api.pagseguro.com";

  if (!pagBankToken) {
    throw new Error("PAGBANK_TOKEN não configurado no backend.");
  }

  const plan = getPlanByCode(input.planCode);
  const referenceId = `${input.tenantId}|${plan.code}|${Date.now()}`;
  const amountValue = Math.round(plan.price * 100);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const payload = {
    reference_id: referenceId,
    customer: {
      name: input.userName || input.userEmail.split("@")[0],
      email: input.userEmail,
    },
    items: [
      {
        reference_id: plan.code,
        name: plan.name,
        quantity: 1,
        unit_amount: amountValue,
      },
    ],
    charges: [
      {
        reference_id: referenceId,
        description: `${plan.name} - Monitoramento Solar SaaS`,
        amount: {
          value: amountValue,
          currency: "BRL",
        },
        payment_method:
          input.paymentMethod === "pix"
            ? {
                type: "PIX",
                pix: {
                  expiration_date: expiresAt,
                },
              }
            : {
                type: "CHECKOUT",
              },
      },
    ],
  };

  const response = await fetch(`${pagBankApiUrl}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pagBankToken}`,
      "Content-Type": "application/json",
      "x-idempotency-key": randomUUID(),
    },
    body: JSON.stringify(payload),
  });

  const data: any = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      data?.error_messages?.map((item: { description: string }) => item.description).join(" | ") ||
      data?.message ||
      "Falha ao criar cobrança no PagBank.";
    throw new Error(errorMessage);
  }

  const links = Array.isArray(data?.links) ? data.links : [];
  const paymentLink = links.find((link: any) => String(link?.rel).toLowerCase().includes("pay"))?.href
    || links.find((link: any) => String(link?.media).toLowerCase().includes("html"))?.href;

  const pixInfo = Array.isArray(data?.qr_codes) ? data.qr_codes[0] : undefined;

  return {
    paymentId: data?.id || referenceId,
    status: "pending",
    message:
      input.paymentMethod === "pix"
        ? "PIX criado no PagBank. Aguarde a confirmação automática do webhook."
        : "Checkout de cartão criado no PagBank.",
    checkoutUrl: paymentLink,
    pixCode: pixInfo?.text,
    qrCodeBase64: pixInfo?.links?.[0]?.href,
    expiresAt: pixInfo?.expiration_date || expiresAt,
  };
};

export const createCheckout = async (input: CheckoutInput) => {
  try {
    const live = await createLivePagBankCheckout(input);
    const pendingSubscription = mapPlanToSubscription(
      {
        tenantId: input.tenantId,
        userId: input.userId,
        email: input.userEmail,
        name: input.userName,
        planCode: input.planCode,
        planStatus: "pending",
      },
      {
        paymentMethod: input.paymentMethod,
        lastPaymentId: live.paymentId,
        checkoutUrl: live.checkoutUrl,
        pixCode: live.pixCode,
        qrCodeBase64: live.qrCodeBase64,
        expiresAt: live.expiresAt || addDays(30),
      }
    );

    subscriptionStore.set(input.tenantId, pendingSubscription);
    await syncSubscriptionToSupabaseUser(pendingSubscription);

    return {
      mode: "live" as const,
      ...live,
      subscription: pendingSubscription,
    };
  } catch (error) {
    console.warn("PagBank live fallback:", error);
    return createMockCheckout(input);
  }
};

export const confirmDevelopmentPayment = async (tenantId: string, paymentId: string) => {
  const current = subscriptionStore.get(tenantId);

  if (!current || current.lastPaymentId !== paymentId) {
    throw new Error("Pagamento não encontrado para este tenant.");
  }

  const active = mapPlanToSubscription(
    {
      tenantId: current.tenantId,
      userId: current.userId,
      email: current.userEmail,
      name: current.userName,
      planCode: current.planCode,
      planStatus: "active",
    },
    {
      paymentMethod: current.paymentMethod,
      lastPaymentId: paymentId,
      checkoutUrl: current.checkoutUrl,
      pixCode: current.pixCode,
      qrCodeBase64: current.qrCodeBase64,
    }
  );

  subscriptionStore.set(tenantId, active);
  await syncSubscriptionToSupabaseUser(active);
  return active;
};

export const handlePagBankWebhook = async (payload: any) => {
  const status = String(
    payload?.charges?.[0]?.status || payload?.status || payload?.data?.status || ""
  ).toUpperCase();
  const referenceId = String(
    payload?.reference_id ||
      payload?.referenceId ||
      payload?.charges?.[0]?.reference_id ||
      payload?.data?.reference_id ||
      ""
  );

  if (!referenceId) {
    return { received: true, activated: false, reason: "reference_id ausente" };
  }

  const [tenantId, planCodeRaw] = referenceId.split("|");
  const planCode = (planCodeRaw || "emergency_7d") as PlanCode;

  if (!["PAID", "AUTHORIZED", "COMPLETED", "ACTIVE"].includes(status)) {
    return { received: true, activated: false, status };
  }

  const current = subscriptionStore.get(tenantId);
  const paymentId = String(payload?.id || payload?.charges?.[0]?.id || randomUUID());
  const activeSubscription = mapPlanToSubscription(
    {
      tenantId,
      userId: current?.userId,
      email: current?.userEmail,
      name: current?.userName,
      planCode,
      planStatus: "active",
    },
    {
      paymentMethod: current?.paymentMethod || "pix",
      lastPaymentId: paymentId,
    }
  );

  subscriptionStore.set(tenantId, activeSubscription);
  await syncSubscriptionToSupabaseUser(activeSubscription);

  return { received: true, activated: true, subscription: activeSubscription };
};
