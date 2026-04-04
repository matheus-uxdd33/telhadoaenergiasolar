import React from "react";
import api from "../services/api";
import { InverterBrandOption, SystemConnectionForm, SystemInfo } from "../types";
import { InstallationWizard } from "../components/onboarding/InstallationWizard";
import { EnergyFlow } from "../components/dashboard/EnergyFlow";
import { ReportWidget } from "../components/dashboard/ReportWidget";
import "../styles/system.css";

const initialForm: SystemConnectionForm = {
  brandCode: "growatt",
  model: "",
  installedPower: 5000,
  location: "",
  distributor: "",
  authMethod: "token",
  username: "",
  password: "",
  apiToken: "",
  apiBaseUrl: "",
  deviceId: "",
};

export default function SystemPage() {
  const [system, setSystem] = React.useState<SystemInfo | null>(null);
  const [brands, setBrands] = React.useState<InverterBrandOption[]>([]);
  const [form, setForm] = React.useState<SystemConnectionForm>(initialForm);
  const [loading, setLoading] = React.useState(true);
  const [testing, setTesting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const loadSystem = React.useCallback(async () => {
    try {
      const [systemRes, brandsRes] = await Promise.all([api.getSystem(), api.getInverterBrands()]);
      const availableBrands = brandsRes.brands || [];
      const selectedBrand = availableBrands.find((brand: InverterBrandOption) => brand.code === systemRes.brandCode) || availableBrands[0];

      setSystem(systemRes);
      setBrands(availableBrands);
      setForm({
        brandCode: systemRes.brandCode || selectedBrand?.code || "growatt",
        model:
          !systemRes.setupRequired && systemRes.inverterModel !== "Selecione a marca e conecte o inversor"
            ? systemRes.inverterModel
            : selectedBrand?.models?.[0] || "",
        installedPower: Number(systemRes.installedPower || 0) || 5000,
        location: systemRes.location !== "Não informado" ? systemRes.location : "",
        distributor: systemRes.distributor !== "Não informado" ? systemRes.distributor : "",
        authMethod: (selectedBrand?.authModes?.[0] || "token") as SystemConnectionForm["authMethod"],
        username: "",
        password: "",
        apiToken: "",
        apiBaseUrl: systemRes.apiBaseUrl || selectedBrand?.apiBaseUrl || "",
        deviceId: systemRes.deviceId || "",
      });
    } catch (err) {
      console.error("Erro ao carregar sistema:", err);
      // Força um sistema vazio para não travar a tela
      setSystem(initialForm as any);
      setFeedback({ type: "error", message: "Erro ao carregar dados do inversor. Verifique sua conexão." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSystem();
  }, [loadSystem]);

  const selectedBrand = brands.find((brand) => brand.code === form.brandCode);

  const handleField = (field: keyof SystemConnectionForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBrandChange = (value: string) => {
    const nextBrand = brands.find((brand) => brand.code === value);
    setForm((prev) => ({
      ...prev,
      brandCode: value,
      model: nextBrand?.models?.[0] || "",
      authMethod: (nextBrand?.authModes?.[0] || "token") as SystemConnectionForm["authMethod"],
      apiBaseUrl: nextBrand?.apiBaseUrl || prev.apiBaseUrl,
    }));
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setFeedback(null);

    try {
      const res = await api.testSystemConnection(form);
      setFeedback({
        type: res.success ? "success" : res.status === "pending" ? "info" : "error",
        message: res.message,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.response?.data?.error || "Falha ao testar a conexão do inversor.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const res = await api.updateSystemCredentials(form);
      setSystem(res.system);
      setFeedback({
        type: res.test?.success ? "success" : res.test?.status === "pending" ? "info" : "error",
        message: res.message || "Integração do inversor salva com sucesso.",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.response?.data?.error || "Falha ao salvar a integração do inversor.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Carregando configurações do sistema...</div>;

  if (!system) {
    return (
      <div className="error-screen">
        <h2>Ops! Problema de Sincronização</h2>
        <p>Não conseguimos carregar os dados da sua usina. O servidor pode estar ocupado ou fora do ar.</p>
        <button onClick={() => window.location.reload()} className="nav-btn primary">Tentar Novamente</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "#10b981";
      case "pending": return "#f59e0b";
      default: return "#ef4444";
    }
  };

  return (
    <div className="system-page max-w-7xl mx-auto px-6 py-10 space-y-12">
      {system.setupRequired ? (
        <div className="animate-in fade-in zoom-in duration-700">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Bem-vindo ao Futuro</h1>
            <p className="text-gray-500 text-lg">Vamos conectar sua usina e começar a monitorar sua economia real.</p>
          </div>
          <InstallationWizard />
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Gestão de Ativos Solar</h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">Unidade: {system.location}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-5 py-2 glass rounded-2xl border-emerald-500/30 flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-sm font-black text-emerald-400 capitalize">{system.connectionStatus}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-xl hover:bg-white/5 transition-all"
              >
                🔄
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EnergyFlow />
            </div>
            <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Especificações Técnicas</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-sm text-gray-400 font-bold">Inversor</span>
                  <span className="text-sm text-white font-black">{system.inverterBrand}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-sm text-gray-400 font-bold">Modelo</span>
                  <span className="text-sm text-white font-black">{system.inverterModel}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-sm text-gray-400 font-bold">Potência</span>
                  <span className="text-sm text-primary font-black">{system.installedPower} Wp</span>
                </div>
              </div>
              <button
                onClick={() => setSystem({ ...system, setupRequired: true })}
                className="w-full p-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all"
              >
                ⚙️ Editar Configurações
              </button>
            </div>
          </div>

          <ReportWidget />
        </div>
      )}
    </div>
  );
}

