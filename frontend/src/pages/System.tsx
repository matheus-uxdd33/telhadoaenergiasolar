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

  if (loading) return <div className="loading">Carregando...</div>;
  if (!system) return <div className="error">Erro ao carregar dados</div>;

  const statusColor =
    system.connectionStatus === "connected"
      ? "#10b981"
      : system.connectionStatus === "pending"
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="system-page">
      <h1>Meu Sistema Solar</h1>

      {system.note && <div className="system-banner">{system.note}</div>}
      {feedback && <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div>}

      <div className="system-info">
        <div className="info-group">
          <label>Marca do Inversor</label>
          <p>{system.inverterBrand}</p>
        </div>

        <div className="info-group">
          <label>Modelo</label>
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
          <label>Método de Conexão</label>
          <p>{system.connectionMethod}</p>
        </div>

        <div className="info-group">
          <label>Status da Conexão</label>
          <p style={{ color: statusColor, fontWeight: "bold" }}>
            {system.connectionStatus === "connected"
              ? "● Conectado"
              : system.connectionStatus === "pending"
                ? "● Em validação"
                : "● Desconectado"}
          </p>
        </div>

        <div className="info-group">
          <label>Última Sincronização</label>
          <p>{new Date(system.lastSync).toLocaleString("pt-BR")}</p>
        </div>
      </div>

      {system.setupRequired && (
        <>
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ marginBottom: "16px", color: "#1f2937", fontSize: "20px", fontWeight: "600" }}>
              Selecionar marca do inversor
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {brands.map((brand) => (
                <div
                  key={brand.code}
                  onClick={() => handleBrandChange(brand.code)}
                  style={{
                    padding: "18px 16px",
                    border: form.brandCode === brand.code ? "2px solid #10b981" : "1px solid #e5e7eb",
                    borderRadius: "10px",
                    background: form.brandCode === brand.code ? "#ecfdf5" : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: form.brandCode === brand.code ? "0 2px 8px rgba(16, 185, 129, 0.15)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (form.brandCode !== brand.code) {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (form.brandCode !== brand.code) {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <div style={{ fontWeight: "600", color: "#1f2937", marginBottom: "6px", fontSize: "16px" }}>
                    {brand.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                    {brand.models?.length || 0} modelos
                  </div>
                  {brand.note && (
                    <div
                      style={{ fontSize: "11px", color: "#059669", fontStyle: "italic", marginTop: "6px" }}
                    >
                      ✓ {brand.note.split(":")[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="connection-panel">
        <div className="panel-header">
          <div>
            <h2>Configurar Inversor {selectedBrand?.name}</h2>
            <p>Informe as credenciais do portal ou token da API e valide a conexão.</p>
          </div>
          {selectedBrand?.note && <span className="provider-note">{selectedBrand.note}</span>}
        </div>

        <div className="connection-form">
          <div className="form-group">
            <label>Modelo</label>
            <select value={form.model} onChange={(e) => handleField("model", e.target.value)}>
              {(selectedBrand?.models || []).map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Potência instalada (W)</label>
            <input
              type="number"
              value={form.installedPower}
              onChange={(e) => handleField("installedPower", Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Localização</label>
            <input value={form.location} onChange={(e) => handleField("location", e.target.value)} />
          </div>

          <div className="form-group">
            <label>Distribuidora</label>
            <input value={form.distributor} onChange={(e) => handleField("distributor", e.target.value)} />
          </div>

          <div className="form-group">
            <label>Método de autenticação</label>
            <select value={form.authMethod} onChange={(e) => handleField("authMethod", e.target.value)}>
              {(selectedBrand?.authModes || ["token"]).map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>URL da API do fabricante</label>
            <input
              placeholder="https://api-do-fabricante.com"
              value={form.apiBaseUrl || ""}
              onChange={(e) => handleField("apiBaseUrl", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Serial / Device ID</label>
            <input value={form.deviceId || ""} onChange={(e) => handleField("deviceId", e.target.value)} />
          </div>

          {(form.authMethod === "credentials" || form.authMethod === "manual_assisted") && (
            <>
              <div className="form-group">
                <label>Usuário do portal</label>
                <input value={form.username || ""} onChange={(e) => handleField("username", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Senha</label>
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
              <label>Token da API</label>
              <input
                type="password"
                placeholder="Cole aqui o token do fabricante"
                value={form.apiToken || ""}
                onChange={(e) => handleField("apiToken", e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="actions">
          <button className="btn-primary" onClick={handleTestConnection} disabled={testing || saving}>
            {testing ? "Testando..." : "Testar conexão real"}
          </button>
          <button className="btn-secondary" onClick={handleSave} disabled={testing || saving}>
            {saving ? "Salvando..." : "Salvar integração"}
          </button>
        </div>
      </div>
    </div>
  );
}
