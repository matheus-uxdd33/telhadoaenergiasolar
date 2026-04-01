import React from "react";
import api from "../services/api";
import { DashboardSummary, Alert, SubscriptionState } from "../types";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [subscription, setSubscription] = React.useState<SubscriptionState | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryRes, alertsRes, currentPlanRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getAlerts(),
          api.getCurrentPlan(),
        ]);
        setSummary(summaryRes);
        setAlerts(alertsRes.alerts || []);
        setSubscription(currentPlanRes.subscription || null);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <div className="loading">Sincronizando dados com o inversor...</div>;
  if (!summary) return <div className="error">Ops! Ocorreu um problema ao carregar os dados.</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "#10b981";
      case "offline": return "#ef4444";
      case "warning": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "low": return "✅";
      case "medium": return "⚠️";
      case "high": return "🚨";
      case "critical": return "🔥";
      default: return "ℹ️";
    }
  };

  const hasHistory = subscription?.features?.includes("history");

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Principal</h1>
        <p className="dashboard-subtitle">Acompanhe em tempo real a performance do seu sistema solar</p>
      </header>

      {subscription && (
        <div className="plan-banner">
          <span className="icon">🚀</span>
          <span>
            <strong>{subscription.planName}</strong> · Status: <b>{subscription.status.toUpperCase()}</b>
            {!hasHistory && " — Upgrade disponível para acessar histórico completo."}
          </span>
        </div>
      )}

      <div className="cards-grid">
        <div className="card" style={{ borderLeft: `6px solid ${getStatusColor(summary.systemStatus)}` }}>
          <h3>Status do Sistema</h3>
          <p className="value">
            {summary.systemStatus.toUpperCase()}
            <span style={{ fontSize: '12px', color: getStatusColor(summary.systemStatus) }}>●</span>
          </p>
        </div>

        <div className="card">
          <h3>Geração Atual</h3>
          <p className="value">
            {summary.currentGeneration.toFixed(2)} <span className="unit">kW</span>
          </p>
        </div>

        <div className="card">
          <h3>Geração Hoje</h3>
          <p className="value">
            {summary.todayGeneration.toFixed(2)} <span className="unit">kWh</span>
          </p>
        </div>

        {hasHistory ? (
          <>
            <div className="card">
              <h3>Geração Este Mês</h3>
              <p className="value">
                {summary.monthGeneration.toFixed(2)} <span className="unit">kWh</span>
              </p>
            </div>

            <div className="card">
              <h3>Economia Estimada</h3>
              <p className="value">
                <span className="unit">R$</span> {summary.estimatedSavings.toFixed(2)}
              </p>
            </div>

            <div className="card">
              <h3>Disponibilidade</h3>
              <p className="value">
                {summary.systemAvailability.toFixed(1)} <span className="unit">%</span>
              </p>
            </div>
          </>
        ) : (
          <div className="card upgrade-card">
            <h3>Recursos Premium</h3>
            <p className="value" style={{ fontSize: '20px' }}>Histórico & BI</p>
            <p className="upgrade-text">Dados analíticos e relatórios avançados.</p>
            <button className="upgrade-btn">Ver Planos</button>
          </div>
        )}
      </div>

      <div className="alerts-section">
        <h2><span className="icon">🔔</span> Alertas Recentes</h2>
        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.severity}`}>
                <div className="alert-icon">{getAlertIcon(alert.severity)}</div>
                <div className="alert-content">
                  <strong>{alert.title}</strong>
                  <p>{alert.description}</p>
                  <span className="alert-time">{new Date(alert.detectedAt).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">Nenhum evento registrado no momento.</div>
          )}
        </div>
      </div>

      <div className="sync-info">
        <p>📡 Dados sincronizados em {new Date(summary.lastSync).toLocaleString("pt-BR")}</p>
      </div>
    </div>
  );
}
