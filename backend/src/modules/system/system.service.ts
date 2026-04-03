import { supabaseAdmin } from "../../database/supabase";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import {
  buildGrowattFallbackTelemetry,
  fetchGrowattTelemetry,
  loginGrowatt,
  TelemetrySnapshot,
} from "./growatt.service";
import { GrowattAdapter } from "./adapters/GrowattAdapter";
import { DeyeAdapter } from "./adapters/DeyeAdapter";

const ADAPTERS: Record<string, any> = {
  growatt: new GrowattAdapter(),
  solarman: new DeyeAdapter(),
};

export type AuthMode = "credentials" | "token" | "serial" | "manual_assisted";
export type ConnectionStatus = "connected" | "pending" | "disconnected";

export interface ProviderCatalogEntry {
  code: string;
  name: string;
  apiBaseUrl?: string;
  portalUrl?: string;
  testPath?: string;
  authModes: AuthMode[];
  models: string[];
  note?: string;
}

export interface SystemConnectionInput {
  brandCode: string;
  model: string;
  installedPower: number;
  location: string;
  distributor: string;
  authMethod: AuthMode;
  username?: string;
  password?: string;
  apiToken?: string;
  apiBaseUrl?: string;
  deviceId?: string;
}

export interface SystemInfoResponse {
  brandCode: string;
  inverterBrand: string;
  inverterModel: string;
  installedPower: number;
  location: string;
  distributor: string;
  connectionMethod: string;
  lastSync: string;
  connectionStatus: ConnectionStatus;
  setupRequired: boolean;
  deviceId?: string;
  apiBaseUrl?: string;
  note?: string;
  supportedAuthModes?: AuthMode[];
}

export interface ConnectionTestResult {
  success: boolean;
  status: ConnectionStatus;
  message: string;
  targetUrl?: string;
}

const providerCatalog: ProviderCatalogEntry[] = [
  {
    code: "growatt",
    name: "Growatt",
    apiBaseUrl: "https://server.growatt.com",
    portalUrl: "https://server.growatt.com",
    testPath: "/LoginAPI.do",
    authModes: ["credentials", "token", "serial"],
    models: ["SPF 5000", "MIN 5000TL", "MOD 10KTL3-X", "MAC 30KTL3-X", "MAX 80KTL3-X"],
    note: "Líder em residências. Use o login do portal ou token oficial.",
  },
  {
    code: "solarman",
    name: "Solarman / Deye / Epever",
    apiBaseUrl: "https://globalapi.solarmanpv.com",
    portalUrl: "https://globalapi.solarmanpv.com",
    testPath: "/",
    authModes: ["token", "credentials", "serial"],
    models: ["Deye Hybrid 5K/8K", "Deye 12K-SG04", "Epever Tracer", "Logger LS-W3"],
    note: "Suporte para a maioria dos inversores híbridos e clones Solarman.",
  },
  {
    code: "sungrow",
    name: "Sungrow iSolarCloud",
    apiBaseUrl: "https://api.isolarcloud.com",
    authModes: ["credentials", "token"],
    models: ["SG5.0RS", "SG10RT", "SH5.0RT (Híbrido)", "SG110CX"],
    note: "Comunicação via iSolarCloud API oficial.",
  },
  {
    code: "solis",
    name: "Solis Cloud",
    apiBaseUrl: "https://www.soliscloud.com",
    authModes: ["credentials", "token", "serial"],
    models: ["S5-GR1P", "S6-GR1P", "Solis Mini", "RHI-5K-48ES"],
  },
  {
    code: "victron",
    name: "Victron Energy (VRM)",
    apiBaseUrl: "https://vrmapi.victronenergy.com",
    authModes: ["token"],
    models: ["MultiPlus-II", "Quattro", "SmartSolar MPPT", "Cerbo GX"],
    note: "Monitoramento via VRM Portal API.",
  },
  {
    code: "goodwe",
    name: "GoodWe SEMS",
    apiBaseUrl: "https://eu-semsportal.goodwe.com",
    authModes: ["credentials", "token"],
    models: ["GW5048D-ES", "GW10K-ET", "Lynx Home F", "HT Series"],
  },
  {
    code: "huawei",
    name: "Huawei FusionSolar",
    apiBaseUrl: "https://eu5.fusionsolar.huawei.com",
    authModes: ["credentials", "token"],
    models: ["SUN2000-5KTL-L1", "SUN2000-10KTL-M1", "LUNA2000 Storage", "SUN2000-100KTL"],
  },
  {
    code: "fronius",
    name: "Fronius Solar.web",
    apiBaseUrl: "https://api.fronius.com",
    authModes: ["credentials", "token"],
    models: ["Primo Gen24", "Symo Adv", "Eco Series"],
  },
  {
    code: "generic",
    name: "API Genérica / Modbus",
    authModes: ["token", "manual_assisted", "serial"],
    models: ["Gateway Modbus TCP", "API REST Custom", "Datalogger Universal", "Manual Assisted"],
  },
];

const systemStore = new Map<string, SystemInfoResponse>();
const connectionSecretsStore = new Map<string, SystemConnectionInput>();
const telemetryStore = new Map<string, TelemetrySnapshot>();

const statusFromTest = (status: ConnectionStatus): ConnectionStatus => {
  if (status === "connected") return "connected";
  if (status === "pending") return "pending";
  return "disconnected";
};

const normalizeBaseUrl = (value?: string) => (value || "").trim().replace(/\/$/, "");

const getBrandByCode = (brandCode?: string) => {
  return providerCatalog.find((brand) => brand.code === brandCode) || providerCatalog[0];
};

const getConnectionMethodLabel = (authMethod: AuthMode) => {
  switch (authMethod) {
    case "credentials":
      return "Login do fabricante";
    case "token":
      return "Token API";
    case "serial":
      return "Serial / Datalogger";
    default:
      return "Integração manual assistida";
  }
};

const defaultSystemInfo = (): SystemInfoResponse => ({
  brandCode: "growatt",
  inverterBrand: "Ainda não conectado",
  inverterModel: "Selecione a marca e conecte o inversor",
  installedPower: 0,
  location: "Não informado",
  distributor: "Não informado",
  connectionMethod: "Aguardando configuração",
  lastSync: new Date().toISOString(),
  connectionStatus: "disconnected",
  setupRequired: true,
  apiBaseUrl: providerCatalog[0].apiBaseUrl,
  note: "Primeira integração real priorizada: Growatt. Informe o login do portal ou token oficial para iniciar a validação.",
  supportedAuthModes: providerCatalog[0].authModes,
});

const tryReachProvider = async (
  targetUrl: string,
  apiToken?: string
): Promise<ConnectionTestResult> => {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
    };

    if (apiToken) {
      headers.Authorization = `Bearer ${apiToken}`;
      headers["X-API-Key"] = apiToken;
      headers.token = apiToken;
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers,
    });

    if (response.ok) {
      return {
        success: true,
        status: "connected",
        message: "API do fabricante respondeu com sucesso. A conexão real foi iniciada.",
        targetUrl,
      };
    }

    if ([401, 403].includes(response.status)) {
      return {
        success: false,
        status: "pending",
        message: "A API do fabricante está acessível, mas as credenciais/token foram rejeitados.",
        targetUrl,
      };
    }

    if ([404, 405].includes(response.status)) {
      return {
        success: true,
        status: "pending",
        message: "Host do fabricante alcançado. Falta ajustar o endpoint específico da marca.",
        targetUrl,
      };
    }

    return {
      success: false,
      status: "disconnected",
      message: `A API respondeu com status ${response.status}.`,
      targetUrl,
    };
  } catch (_error) {
    return {
      success: false,
      status: "disconnected",
      message: "Não foi possível alcançar a API do fabricante. Verifique URL, token ou rede.",
      targetUrl,
    };
  }
};

export const listSupportedProviders = () => {
  return providerCatalog;
};

const testGrowattConnection = async (
  input: SystemConnectionInput,
  brand: ProviderCatalogEntry
): Promise<ConnectionTestResult> => {
  const baseUrl = normalizeBaseUrl(input.apiBaseUrl || brand.apiBaseUrl || brand.portalUrl);

  if (!baseUrl) {
    return {
      success: false,
      status: "pending",
      message: "Informe a URL do portal/API Growatt para iniciar a validação.",
    };
  }

  if (input.authMethod === "credentials") {
    const login = await loginGrowatt({
      baseUrl,
      username: input.username,
      password: input.password,
      apiToken: input.apiToken,
      deviceId: input.deviceId,
    });

    return {
      success: login.success,
      status: login.status,
      message: login.message,
      targetUrl: login.targetUrl,
    };
  }

  if ((input.authMethod === "token" || input.authMethod === "serial") && !input.apiToken && !input.deviceId) {
    return {
      success: false,
      status: "pending",
      message: "Para Growatt, informe o token da API ou o serial do datalogger.",
      targetUrl: baseUrl,
    };
  }

  return tryReachProvider(baseUrl, input.apiToken);
};

export const testInverterConnection = async (
  input: SystemConnectionInput
): Promise<ConnectionTestResult> => {
  const brand = getBrandByCode(input.brandCode);
  const targetUrl = normalizeBaseUrl(input.apiBaseUrl || brand.apiBaseUrl || brand.portalUrl);

  if (!targetUrl) {
    return {
      success: false,
      status: "pending",
      message: "Informe a URL da API do fabricante para iniciar a validação real.",
    };
  }

  if (brand.code === "growatt") {
    return testGrowattConnection(input, brand);
  }

  return tryReachProvider(targetUrl, input.apiToken);
};
const ensureBrandAndModel = async (brandName: string, modelName: string) => {
  if (!supabaseAdmin) return { brandId: null as string | null, modelId: null as string | null };

  try {
    const existingBrand = await supabaseAdmin
      .from("inverter_brands")
      .select("id")
      .eq("name", brandName)
      .maybeSingle();

    let brandId = existingBrand.data?.id || null;

    if (!brandId) {
      const createdBrand = await supabaseAdmin
        .from("inverter_brands")
        .insert({ name: brandName, api_provider: brandName })
        .select("id")
        .single();

      brandId = createdBrand.data?.id || null;
    }

    let modelId: string | null = null;

    if (brandId) {
      const existingModel = await supabaseAdmin
        .from("inverter_models")
        .select("id")
        .eq("brand_id", brandId)
        .eq("name", modelName)
        .maybeSingle();

      modelId = existingModel.data?.id || null;

      if (!modelId) {
        const createdModel = await supabaseAdmin
          .from("inverter_models")
          .insert({ brand_id: brandId, name: modelName, connectivity_methods: "api" })
          .select("id")
          .single();

        modelId = createdModel.data?.id || null;
      }
    }

    return { brandId, modelId };
  } catch (_error) {
    return { brandId: null as string | null, modelId: null as string | null };
  }
};

const ensureSite = async (user: NonNullable<AuthRequest["user"]>, input: SystemConnectionInput) => {
  if (!supabaseAdmin) return null as string | null;

  try {
    const existingSite = await supabaseAdmin
      .from("customer_sites")
      .select("id")
      .eq("tenant_id", user.tenantId)
      .eq("user_id", user.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sitePayload = {
      tenant_id: user.tenantId,
      user_id: user.userId,
      name: `${input.model} - Unidade principal`,
      address: input.location,
      city: input.location,
      state: "N/D",
      country: "Brasil",
      installed_power_kw: Number(input.installedPower || 0) / 1000,
      distributor: input.distributor,
    };

    if (existingSite.data?.id) {
      await supabaseAdmin.from("customer_sites").update(sitePayload).eq("id", existingSite.data.id);
      return existingSite.data.id as string;
    }

    const createdSite = await supabaseAdmin
      .from("customer_sites")
      .insert(sitePayload)
      .select("id")
      .single();

    return createdSite.data?.id || null;
  } catch (_error) {
    return null as string | null;
  }
};

const persistSystemConfig = async (
  user: NonNullable<AuthRequest["user"]>,
  input: SystemConnectionInput,
  status: ConnectionStatus,
  note?: string
) => {
  if (!supabaseAdmin) return;

  try {
    const siteId = await ensureSite(user, input);
    const brand = getBrandByCode(input.brandCode);
    const { brandId, modelId } = await ensureBrandAndModel(brand.name, input.model);

    if (!siteId || !brandId || !modelId) return;

    const existingConnection = await supabaseAdmin
      .from("provider_connections")
      .select("id")
      .eq("tenant_id", user.tenantId)
      .eq("site_id", siteId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      tenant_id: user.tenantId,
      site_id: siteId,
      brand_id: brandId,
      model_id: modelId,
      provider_username: input.username || null,
      provider_device_id: input.deviceId || null,
      auth_method: input.authMethod,
      is_active: status === "connected",
      last_sync: new Date().toISOString(),
      sync_error: note || null,
    };

    if (existingConnection.data?.id) {
      await supabaseAdmin.from("provider_connections").update(payload).eq("id", existingConnection.data.id);
    } else {
      await supabaseAdmin.from("provider_connections").insert(payload);
    }
  } catch (error) {
    console.warn("Aviso ao persistir integração do inversor:", error);
  }
};

const persistTelemetryToSupabase = async (
  user: NonNullable<AuthRequest["user"]>,
  telemetry: TelemetrySnapshot
) => {
  if (!supabaseAdmin) return;

  try {
    const siteRes = await supabaseAdmin
      .from("customer_sites")
      .select("id")
      .eq("tenant_id", user.tenantId)
      .eq("user_id", user.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!siteRes.data?.id) return;

    const connRes = await supabaseAdmin
      .from("provider_connections")
      .select("id")
      .eq("tenant_id", user.tenantId)
      .eq("site_id", siteRes.data.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!connRes.data?.id) return;

    await supabaseAdmin.from("telemetry_events").insert({
      site_id: siteRes.data.id,
      connection_id: connRes.data.id,
      event_type: "live-sync",
      generation_kw: telemetry.currentGeneration,
      efficiency_percent: telemetry.systemAvailability,
      status: telemetry.systemStatus,
      raw_data: telemetry.rawData || { source: telemetry.source },
      recorded_at: telemetry.lastSync,
    });
  } catch (_error) {
    // o schema pode ainda não estar aplicado; segue sem bloquear o fluxo
  }
};

export const saveSystemConfiguration = async (
  user: NonNullable<AuthRequest["user"]>,
  input: SystemConnectionInput
) => {
  const brand = getBrandByCode(input.brandCode);
  const testResult = await testInverterConnection(input);

  connectionSecretsStore.set(user.tenantId, { ...input });
  telemetryStore.delete(user.tenantId);

  const system: SystemInfoResponse = {
    brandCode: brand.code,
    inverterBrand: brand.name,
    inverterModel: input.model,
    installedPower: Number(input.installedPower || 0),
    location: input.location,
    distributor: input.distributor,
    connectionMethod: getConnectionMethodLabel(input.authMethod),
    lastSync: new Date().toISOString(),
    connectionStatus: statusFromTest(testResult.status),
    setupRequired: false,
    deviceId: input.deviceId,
    apiBaseUrl: input.apiBaseUrl || brand.apiBaseUrl,
    note: testResult.message || brand.note,
    supportedAuthModes: brand.authModes,
  };

  systemStore.set(user.tenantId, system);
  await persistSystemConfig(user, input, system.connectionStatus, system.note);

  return { system, testResult };
};

export const getSystemInfo = async (user?: AuthRequest["user"]) => {
  if (!user) return defaultSystemInfo();

  const cached = systemStore.get(user.tenantId);
  if (cached) return cached;

  if (supabaseAdmin) {
    try {
      const siteRes = await supabaseAdmin
        .from("customer_sites")
        .select("id, name, address, installed_power_kw, distributor")
        .eq("tenant_id", user.tenantId)
        .eq("user_id", user.userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (siteRes.error) {
        console.error("Erro Supabase (site):", siteRes.error);
      }

      if (siteRes.data?.id) {
        const connRes = await supabaseAdmin
          .from("provider_connections")
          .select("provider_device_id, auth_method, is_active, last_sync, sync_error, brand_id, model_id, inverter_brands(name), inverter_models(name)")
          .eq("tenant_id", user.tenantId)
          .eq("site_id", siteRes.data.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (connRes.error) {
          console.error("Erro Supabase (conn):", connRes.error);
        }

        if (connRes.data) {
          const brandData = (connRes.data as any).inverter_brands;
          const modelData = (connRes.data as any).inverter_models;
          const brandName = brandData?.name || "Inversor conectado";
          const modelName = modelData?.name || "Modelo cadastrado";
          const brand = providerCatalog.find((item) => item.name === brandName) || providerCatalog[0];

          const system: SystemInfoResponse = {
            brandCode: brand.code,
            inverterBrand: brandName,
            inverterModel: modelName,
            installedPower: Number(siteRes.data.installed_power_kw || 0) * 1000,
            location: siteRes.data.address || "Não informado",
            distributor: siteRes.data.distributor || "Não informado",
            connectionMethod: getConnectionMethodLabel(
              ((connRes.data as any).auth_method || "manual_assisted") as AuthMode
            ),
            lastSync: (connRes.data as any).last_sync || new Date().toISOString(),
            connectionStatus: (connRes.data as any).is_active ? "connected" : "pending",
            setupRequired: false,
            deviceId: (connRes.data as any).provider_device_id || undefined,
            apiBaseUrl: brand.apiBaseUrl,
            note: (connRes.data as any).sync_error || brand.note,
            supportedAuthModes: brand.authModes,
          };

          systemStore.set(user.tenantId, system);
          return system;
        }
      }
    } catch (dbError) {
      console.error("Falha fatal na consulta ao Supabase:", dbError);
    }
  }

  const fallback = defaultSystemInfo();
  systemStore.set(user.tenantId, fallback);
  return fallback;
};

export const getLiveTelemetryForUser = async (user?: AuthRequest["user"]): Promise<TelemetrySnapshot> => {
  if (!user) {
    return buildGrowattFallbackTelemetry("Faça login para iniciar a leitura da telemetria.");
  }

  const system = await getSystemInfo(user);
  const adapter = ADAPTERS[system.brandCode?.toLowerCase()];

  if (adapter) {
    try {
      const live = await adapter.fetchRealTime({
        username: connectionSecretsStore.get(user.tenantId)?.username,
        password: connectionSecretsStore.get(user.tenantId)?.password,
        apiToken: connectionSecretsStore.get(user.tenantId)?.apiToken
      });

      const snapshot: TelemetrySnapshot = {
        currentGeneration: live.generationKw,
        todayGeneration: (live.totalEnergyKwh / 100), // mock calc
        status: live.status,
        lastSync: new Date().toISOString(),
        source: adapter.brandCode,
        alerts: [], // Adapters could provide alerts too
        ...live
      } as any;

      telemetryStore.set(user.tenantId, snapshot);
      return snapshot;
    } catch (e) {
      console.warn(`Adapter ${system.brandCode} error:`, e);
    }
  }

  // Fallback para mock existente
  const generic: TelemetrySnapshot = {
    currentGeneration: system.connectionStatus === "connected" ? 4.2 : 0,
    todayGeneration: system.connectionStatus === "connected" ? 18.5 : 0,
    monthGeneration: system.connectionStatus === "connected" ? 582.3 : 0,
    estimatedSavings: system.connectionStatus === "connected" ? 289.15 : 0,
    systemAvailability: system.connectionStatus === "connected" ? 99.1 : 95,
    lastSync: new Date().toISOString(),
    systemStatus: system.connectionStatus === "connected" ? "online" : "warning",
    alerts: [
      {
        id: "generic-sync",
        title: system.connectionStatus === "connected" ? "Integração conectada" : "Integração pendente",
        description: system.note || "Conexão aguardando leitura detalhada.",
        type: system.connectionStatus === "connected" ? "success" : "warning",
        severity: system.connectionStatus === "connected" ? "low" : "medium",
        detectedAt: new Date().toISOString(),
        status: "open",
      },
    ],
    source: "adapter-fallback",
  };

  telemetryStore.set(user.tenantId, generic);
  return generic;
};

export const getLiveAlertsForUser = async (user?: AuthRequest["user"]) => {
  const telemetry = await getLiveTelemetryForUser(user);
  return telemetry.alerts;
};
