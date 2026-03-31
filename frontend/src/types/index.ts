export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  planCode?: string;
  planStatus?: string;
  features?: string[];
}

export interface DashboardSummary {
  systemStatus: "online" | "offline" | "warning" | "critical";
  currentGeneration: number;
  todayGeneration: number;
  monthGeneration: number;
  estimatedSavings: number;
  systemAvailability: number;
  lastSync: string;
  plan?: {
    code?: string;
    status?: string;
    features?: string[];
  };
}

export interface SystemInfo {
  brandCode?: string;
  inverterBrand: string;
  inverterModel: string;
  installedPower: number;
  location: string;
  distributor: string;
  connectionMethod: string;
  lastSync: string;
  connectionStatus: "connected" | "pending" | "disconnected" | string;
  setupRequired?: boolean;
  deviceId?: string;
  apiBaseUrl?: string;
  note?: string;
  supportedAuthModes?: Array<"credentials" | "token" | "serial" | "manual_assisted">;
}

export interface InverterBrandOption {
  code: string;
  name: string;
  apiBaseUrl?: string;
  authModes: Array<"credentials" | "token" | "serial" | "manual_assisted">;
  models: string[];
  note?: string;
}

export interface SystemConnectionForm {
  brandCode: string;
  model: string;
  installedPower: number;
  location: string;
  distributor: string;
  authMethod: "credentials" | "token" | "serial" | "manual_assisted";
  username?: string;
  password?: string;
  apiToken?: string;
  apiBaseUrl?: string;
  deviceId?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "error" | "success";
  severity: "low" | "medium" | "high" | "critical";
  detectedAt: string;
  status: "open" | "resolved";
}

export interface ChartData {
  dailyChart: Array<{ date: string; generation: number; expected: number }>;
  monthChart: Array<{ day: number; generation: number; expected: number }>;
}

export interface SubscriptionPlan {
  code: string;
  name: string;
  price: number;
  cycleLabel: string;
  audience: string;
  description: string;
  highlight?: string;
  features: string[];
  paymentMethods: Array<"pix" | "card">;
  limits: {
    maxSites: number;
    maxUsers: number;
  };
}

export interface SubscriptionState {
  tenantId: string;
  planCode: string;
  planName: string;
  status: string;
  amount: number;
  cycleLabel: string;
  features: string[];
  maxSites: number;
  maxUsers: number;
  paymentMethod?: "pix" | "card";
  expiresAt: string;
  updatedAt: string;
}

export interface CheckoutResponse {
  mode: "live" | "mock";
  paymentId: string;
  status: string;
  message: string;
  checkoutUrl?: string;
  pixCode?: string;
  qrCodeBase64?: string;
  expiresAt?: string;
  subscription?: SubscriptionState;
}
