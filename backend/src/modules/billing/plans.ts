export type PlanCode =
  | "emergency_7d"
  | "residencial_full"
  | "combo_residencial"
  | "empresa_premium";

export type PaymentMethod = "pix" | "card";

export type FeatureKey =
  | "current_generation"
  | "emergency_alerts"
  | "history"
  | "reports"
  | "support"
  | "multi_sites"
  | "comparison"
  | "priority_support"
  | "advanced_dashboard"
  | "team_access";

export interface PlanDefinition {
  code: PlanCode;
  name: string;
  price: number;
  cycleLabel: string;
  audience: string;
  description: string;
  highlight?: string;
  features: FeatureKey[];
  paymentMethods: PaymentMethod[];
  limits: {
    maxSites: number;
    maxUsers: number;
  };
}

export const PLAN_CATALOG: PlanDefinition[] = [
  {
    code: "emergency_7d",
    name: "Emergencial 7 Dias",
    price: 15,
    cycleLabel: "7 dias",
    audience: "Entrada rápida",
    description: "Sinais de emergência e geração atual para começar imediatamente.",
    highlight: "Ideal para teste e ativação rápida",
    features: ["current_generation", "emergency_alerts"],
    paymentMethods: ["pix", "card"],
    limits: { maxSites: 1, maxUsers: 1 },
  },
  {
    code: "residencial_full",
    name: "Residencial Completo",
    price: 59.9,
    cycleLabel: "mensal",
    audience: "1 residência",
    description: "Monitoramento completo com histórico, relatórios e suporte básico.",
    highlight: "Plano mais vendido",
    features: ["current_generation", "emergency_alerts", "history", "reports", "support"],
    paymentMethods: ["pix", "card"],
    limits: { maxSites: 1, maxUsers: 2 },
  },
  {
    code: "combo_residencial",
    name: "Combo Residencial Multi-casas",
    price: 99.9,
    cycleLabel: "mensal",
    audience: "Famílias com vários imóveis",
    description: "Tudo do plano completo com múltiplas casas e visão comparativa.",
    highlight: "Diferencial multi-casas",
    features: [
      "current_generation",
      "emergency_alerts",
      "history",
      "reports",
      "support",
      "multi_sites",
      "comparison",
    ],
    paymentMethods: ["pix", "card"],
    limits: { maxSites: 3, maxUsers: 4 },
  },
  {
    code: "empresa_premium",
    name: "Empresa Premium",
    price: 189,
    cycleLabel: "mensal",
    audience: "Empresas e operações maiores",
    description: "Plano mais completo com multiunidades, prioridade e visão gerencial.",
    highlight: "Mais completo",
    features: [
      "current_generation",
      "emergency_alerts",
      "history",
      "reports",
      "support",
      "multi_sites",
      "comparison",
      "priority_support",
      "advanced_dashboard",
      "team_access",
    ],
    paymentMethods: ["pix", "card"],
    limits: { maxSites: 20, maxUsers: 15 },
  },
];

export const getPlanByCode = (planCode: string | undefined) => {
  return PLAN_CATALOG.find((plan) => plan.code === planCode) ?? PLAN_CATALOG[0];
};

export const hasFeature = (planCode: string | undefined, feature: FeatureKey) => {
  const plan = getPlanByCode(planCode);
  return plan.features.includes(feature);
};
