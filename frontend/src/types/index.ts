export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
}

export interface DashboardSummary {
  systemStatus: "online" | "offline" | "warning" | "critical";
  currentGeneration: number;
  todayGeneration: number;
  monthGeneration: number;
  estimatedSavings: number;
  systemAvailability: number;
  lastSync: string;
}

export interface SystemInfo {
  inverterBrand: string;
  inverterModel: string;
  installedPower: number;
  location: string;
  distributor: string;
  connectionMethod: string;
  lastSync: string;
  connectionStatus: string;
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
