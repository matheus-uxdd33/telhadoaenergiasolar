import React from "react";
import api from "../services/api";
import { InverterBrandOption, SystemConnectionForm, SystemInfo } from "../types";
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
      setFeedback({ type: "error", message: "Erro ao carregar dados do inversor." });
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
  if (!system) return <div className="error">Ops! Falha ao carregar as informações do sistema.</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "#10b981";
      case "pending": return "#f59e0b";
      default: return "#ef4444";
    }
  };

  return (
    <div className="system-page">
      <h1>Configurações do Sistema</h1>

      {system.note && <div className="system-banner"><span className="icon">ℹ️</span> {system.note}</div>}
      {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

      <div className="system-info-grid">
        <div className="info-group">
          <label>Marca do Inversor</label>
          <p>{system.inverterBrand}</p>
        </div>

        <div className="info-group">
          <label>Modelo do Equipamento</label>
          <p>{system.inverterModel}</p>
        </div>

        <div className="info-group">
          <label>Potência Instalada</label>
          <p>{system.installedPower} W</p>
        </div>

        <div className="info-group">
          <label>Localização</label>
          <p>{system.location}</p>
        </div>

        <div className="info-group">
          <label>Distribuidora</label>
          <p>{system.distributor}</p>
        </div>

        <div className="info-group">
          <label>Status da Conexão</label>
          <p style={{ color: getStatusColor(system.connectionStatus) }}>
            {system.connectionStatus === "connected"
              ? "● Conectado"
              : system.connectionStatus === "pending"
                ? "● Validando"
                : "● Desconectado"}
          </p>
        </div>
      </div>

      <div className="brand-selection-area">
        <h2 className="brand-selection-title">1. Selecione o Fabricante</h2>
        <div className="brands-grid">
          {brands.map((brand) => (
            <div
              key={brand.code}
              className={`brand-card ${form.brandCode === brand.code ? 'active' : ''}`}
              onClick={() => handleBrandChange(brand.code)}
            >
              <div className="brand-card-top">
                <h4>{brand.name}</h4>
                <span className="confirm-icon">✅</span>
              </div>
              <span>{brand.models?.length || 0} modelos suportados</span>
              {brand.note && <span className="brand-note">{brand.note.split(":")[0]}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="connection-panel">
        <header className="panel-header">
          <h2>2. Configurar Integração {selectedBrand?.name}</h2>
          <p>Informe as credenciais de acesso ou tokens para sincronizar os dados.</p>
        </header>

        <div className="connection-form">
          <div className="form-group">
            <label>Modelo do Inversor</label>
            <select value={form.model} onChange={(e) => handleField("model", e.target.value)}>
              {(selectedBrand?.models || []).map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Potência Instalada (W)</label>
            <input
              type="number"
              value={form.installedPower}
              onChange={(e) => handleField("installedPower", Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Cidade / Estado</label>
            <input value={form.location} onChange={(e) => handleField("location", e.target.value)} />
          </div>

          <div className="form-group">
            <label>Distribuidora de Energia</label>
            <input value={form.distributor} onChange={(e) => handleField("distributor", e.target.value)} />
          </div>

          <div className="form-group">
            <label>Método de Autenticação</label>
            <select value={form.authMethod} onChange={(e) => handleField("authMethod", e.target.value)}>
              {(selectedBrand?.authModes || ["token"]).map((mode) => (
                <option key={mode} value={mode}>{mode.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Endpoint / Base URL da API</label>
            <input
              placeholder="https://server.fabricante.com"
              value={form.apiBaseUrl || ""}
              onChange={(e) => handleField("apiBaseUrl", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Número de Série / ID</label>
            <input value={form.deviceId || ""} onChange={(e) => handleField("deviceId", e.target.value)} />
          </div>

          {(form.authMethod === "credentials" || form.authMethod === "manual_assisted") && (
            <>
              <div className="form-group">
                <label>E-mail do Portal</label>
                <input value={form.username || ""} onChange={(e) => handleField("username", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Senha do Portal</label>
                <input
                  type="password"
                  value={form.password || ""}
                  onChange={(e) => handleField("password", e.target.value)}
                />
              </div>
            </>
          )}

          {(form.authMethod === "token" || form.authMethod === "manual_assisted") && (
            <div className="form-group full-width">
              <label>Chave de API / Access Token</label>
              <input
                type="password"
                placeholder="Cole o token de acesso aqui"
                value={form.apiToken || ""}
                onChange={(e) => handleField("apiToken", e.target.value)}
              />
            </div>
          )}
        </div>

        <footer className="actions">
          <button className="btn-primary" onClick={handleTestConnection} disabled={testing || saving}>
            {testing ? "Validando..." : "Testar Conexão"}
          </button>
          <button className="btn-secondary" onClick={handleSave} disabled={testing || saving}>
            {saving ? "Processando..." : "Salvar Configurações"}
          </button>
        </footer>
      </div>
    </div>
  );
}
