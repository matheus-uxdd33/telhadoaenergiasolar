export interface GrowattLoginResult {
  success: boolean;
  status: "connected" | "pending" | "disconnected";
  message: string;
  targetUrl: string;
  cookieHeader?: string;
  responseData?: any;
}

export interface TelemetrySnapshot {
  currentGeneration: number;
  todayGeneration: number;
  monthGeneration: number;
  estimatedSavings: number;
  systemAvailability: number;
  lastSync: string;
  systemStatus: "online" | "offline" | "warning" | "critical";
  alerts: Array<{
    id: string;
    title: string;
    description: string;
    type: "info" | "warning" | "error" | "success";
    severity: "low" | "medium" | "high" | "critical";
    detectedAt: string;
    status: "open" | "resolved";
  }>;
  source: "growatt-live" | "growatt-fallback";
  rawData?: any;
}

interface GrowattConnectionInput {
  baseUrl: string;
  username?: string;
  password?: string;
  apiToken?: string;
  deviceId?: string;
}

const normalizeBaseUrl = (value?: string) => (value || "").trim().replace(/\/$/, "");

const mapErrorCode = (errCode?: string) => {
  switch (String(errCode || "")) {
    case "102":
      return "Usuário ou senha Growatt inválidos.";
    case "103":
      return "Conta Growatt bloqueada temporariamente.";
    default:
      return errCode ? `Growatt retornou o código ${errCode}.` : "Falha ao autenticar na Growatt.";
  }
};

const collectCookieHeader = (response: Response) => {
  const setCookie = (response.headers as any).getSetCookie?.() as string[] | undefined;
  if (setCookie?.length) {
    return setCookie.map((entry) => entry.split(";")[0]).join("; ");
  }

  const singleCookie = response.headers.get("set-cookie");
  if (singleCookie) {
    return singleCookie
      .split(",")
      .map((entry) => entry.split(";")[0].trim())
      .join("; ");
  }

  return undefined;
};

const asNumber = (...values: any[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const normalized = Number(value.replace(/,/g, "."));
      if (!Number.isNaN(normalized)) return normalized;
    }
  }
  return undefined;
};

const findFirstByKeys = (data: any, keys: string[]): any => {
  if (!data || typeof data !== "object") return undefined;

  const lowerKeys = keys.map((key) => key.toLowerCase());
  const queue = [data];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object") continue;

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (lowerKeys.includes(key.toLowerCase())) {
        return value;
      }

      if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }

  return undefined;
};

const extractTelemetry = (data: any): TelemetrySnapshot | null => {
  const currentGeneration = asNumber(
    findFirstByKeys(data, ["pac", "ppv", "currentGeneration", "currentPower", "power", "outputPower"]),
    0
  ) || 0;
  const todayGeneration = asNumber(
    findFirstByKeys(data, ["eToday", "etoday", "todayGeneration", "todayEnergy", "todayPower"]),
    0
  ) || 0;
  const monthGeneration = asNumber(
    findFirstByKeys(data, ["eMonth", "emonth", "monthGeneration", "monthEnergy"]),
    todayGeneration * 30
  ) || todayGeneration * 30;
  const availability = asNumber(
    findFirstByKeys(data, ["availability", "onlineRatio", "systemAvailability"]),
    currentGeneration > 0 ? 99.2 : 96.4
  ) || 96.4;

  const statusText = String(
    findFirstByKeys(data, ["statusText", "deviceStatusText", "status", "deviceStatus", "invStatus"]) ||
      (currentGeneration > 0 ? "online" : "warning")
  ).toLowerCase();

  const systemStatus = statusText.includes("fault") || statusText.includes("alarm")
    ? "critical"
    : statusText.includes("warn") || statusText.includes("offline")
      ? "warning"
      : currentGeneration > 0
        ? "online"
        : "warning";

  const alerts = systemStatus === "online"
    ? [
        {
          id: "growatt-ok",
          title: "Growatt sincronizado",
          description: "A API Growatt respondeu e a telemetria começou a ser lida.",
          type: "success" as const,
          severity: "low" as const,
          detectedAt: new Date().toISOString(),
          status: "open" as const,
        },
      ]
    : [
        {
          id: "growatt-warning",
          title: "Growatt em validação",
          description: "Conexão iniciada, mas ainda sem telemetria completa do inversor.",
          type: "warning" as const,
          severity: "medium" as const,
          detectedAt: new Date().toISOString(),
          status: "open" as const,
        },
      ];

  return {
    currentGeneration,
    todayGeneration,
    monthGeneration,
    estimatedSavings: Number((monthGeneration * 0.62).toFixed(2)),
    systemAvailability: Number(availability.toFixed(1)),
    lastSync: new Date().toISOString(),
    systemStatus,
    alerts,
    source: "growatt-live",
    rawData: data,
  };
};

export const loginGrowatt = async (input: GrowattConnectionInput): Promise<GrowattLoginResult> => {
  const baseUrl = normalizeBaseUrl(input.baseUrl || "https://server.growatt.com");
  const targetUrl = `${baseUrl}/LoginAPI.do`;

  if (!input.username || !input.password) {
    return {
      success: false,
      status: "pending",
      message: "Informe o usuário e a senha do portal Growatt.",
      targetUrl,
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "application/json, text/plain, */*",
      },
      body: new URLSearchParams({
        userName: input.username,
        password: input.password,
      }).toString(),
    });

    const data: any = await response.json().catch(() => ({}));
    const success = Boolean(data?.back?.success || data?.success || data?.result === 1);

    if (success) {
      return {
        success: true,
        status: "connected",
        message: "Login Growatt validado com sucesso.",
        targetUrl,
        cookieHeader: collectCookieHeader(response),
        responseData: data,
      };
    }

    return {
      success: false,
      status: "pending",
      message: mapErrorCode(data?.back?.errCode || data?.errCode),
      targetUrl,
      cookieHeader: collectCookieHeader(response),
      responseData: data,
    };
  } catch (_error) {
    return {
      success: false,
      status: "disconnected",
      message: "Não foi possível alcançar o portal Growatt para autenticação.",
      targetUrl,
    };
  }
};

export const fetchGrowattTelemetry = async (
  input: GrowattConnectionInput,
  cookieHeader?: string
): Promise<TelemetrySnapshot | null> => {
  const baseUrl = normalizeBaseUrl(input.baseUrl || "https://server.growatt.com");
  const candidateUrls = [
    `${baseUrl}/panel/getDevicesByPlantList?currPage=1`,
    `${baseUrl}/newTwoInvAPI.do?op=getAllDeviceList`,
    `${baseUrl}/PlantListAPI.do`,
  ];

  for (const targetUrl of candidateUrls) {
    try {
      const headers: Record<string, string> = {
        Accept: "application/json, text/plain, */*",
      };

      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }

      if (input.apiToken) {
        headers.Authorization = `Bearer ${input.apiToken}`;
        headers.token = input.apiToken;
      }

      const response = await fetch(targetUrl, { headers });
      if (!response.ok) continue;

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) continue;

      const data: any = await response.json().catch(() => null);
      const telemetry = extractTelemetry(data);
      if (telemetry) {
        return telemetry;
      }
    } catch (_error) {
      // tenta próximo endpoint
    }
  }

  return null;
};

export const buildGrowattFallbackTelemetry = (message: string): TelemetrySnapshot => ({
  currentGeneration: 0,
  todayGeneration: 0,
  monthGeneration: 0,
  estimatedSavings: 0,
  systemAvailability: 95,
  lastSync: new Date().toISOString(),
  systemStatus: "warning",
  alerts: [
    {
      id: "growatt-pending",
      title: "Growatt aguardando telemetria",
      description: message,
      type: "warning",
      severity: "medium",
      detectedAt: new Date().toISOString(),
      status: "open",
    },
  ],
  source: "growatt-fallback",
});
