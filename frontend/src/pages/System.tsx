import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [system, setSystem] = React.useState<SystemInfo | null>(null);
  const [brands, setBrands] = React.useState<InverterBrandOption[]>([]);
  const [form, setForm] = React.useState<SystemConnectionForm>(initialForm);
  const [loading, setLoading] = React.useState(true);
  const [testing, setTesting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
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
      if (res.test?.success) {
        setShowSuccessModal(true);
      }
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

  return (
    <div className="system-page max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass" style={{ maxWidth: '400px', width: '100%', padding: '40px', borderRadius: '32px', textAlign: 'center', border: '1px solid #10b981' }}>
            <div style={{ width: '64px', height: '64px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4">Configuração Salva!</h2>
            <p className="text-gray-400 mb-8 font-medium">Seu inversor está enviando dados para a nuvem.</p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate("/dashboard")}
                className="w-full h-[52px] bg-emerald-500 text-[#050b14] font-black rounded-2xl hover:scale-105 transition-all"
              >
                Ir para Dashboard
              </button>
              <button 
                onClick={() => { setShowSuccessModal(false); navigate("/reports"); }}
                className="w-full h-[52px] bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
              >
                Ver Gráficos em Tempo Real
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => navigate(-1)}
        className="h-[52px] px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-white font-black hover:bg-white/10 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Voltar para o Painel
      </button>

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
              <button 
                onClick={() => navigate("/reports")}
                style={{ marginTop: '12px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', color: '#10b981', fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Ver Relatórios Detalhados
              </button>
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

