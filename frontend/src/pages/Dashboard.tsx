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

  if (loading) return <div className="loading">Carregando...</div>;
  if (!summary) return <div className="error">Erro ao carregar dados</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#10b981";
      case "offline":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const hasHistory = subscription?.features?.includes("history");

  return (
    <div className="dashboard">
      <h1>Dashboard do Sistema Solar</h1>

      {subscription && (
        <div className="plan-banner">
          <strong>Plano atual:</strong> {subscription.planName} · <b>{subscription.status}</b>
          {!hasHistory && <span> — este plano mostra geração atual e sinais de emergência.</span>}
        </div>
      )}

      <div className="cards-grid">
        <div
          className="card"
          style={{ borderLeft: `4px solid ${getStatusColor(summary.systemStatus)}` }}
        >
          <h3>Status do Sistema</h3>
          <p className="value">{summary.systemStatus.toUpperCase()}</p>
        </div>

        <div className="card">
          <h3>Geração Atual</h3>
          <p className="value">{summary.currentGeneration.toFixed(2)} kW</p>
        </div>

        <div className="card">
          <h3>Geração Hoje</h3>
          <p className="value">{summary.todayGeneration.toFixed(2)} kWh</p>
        </div>

        {hasHistory ? (
          <>
            <div className="card">
              <h3>Geração Este Mês</h3>
              <p className="value">{summary.monthGeneration.toFixed(2)} kWh</p>
            </div>

            <div className="card">
              <h3>Economia Estimada</h3>
              <p className="value">R$ {summary.estimatedSavings.toFixed(2)}</p>
            </div>

            <div className="card">
              <h3>Disponibilidade</h3>
              <p className="value">{summary.systemAvailability.toFixed(1)}%</p>
            </div>
          </>
        ) : (
          <div className="card upgrade-card">
            <h3>Upgrade recomendado</h3>
            <p className="value">Plano completo</p>
            <p className="upgrade-text">Desbloqueie histórico, relatórios e suporte em `Planos`.</p>
          </div>
        )}
      </div>

      <div className="alerts-section">
        <h2>Alertas Recentes</h2>
        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.severity}`}>
                <strong>{alert.title}</strong>
                <p>{alert.description}</p>
                <small>{new Date(alert.detectedAt).toLocaleString("pt-BR")}</small>
              </div>
            ))
          ) : (
            <p className="no-data">Sem alertas novos</p>
          )}
        </div>
      </div>

      <div className="sync-info">
        <small>Última sincronização: {new Date(summary.lastSync).toLocaleString("pt-BR")}</small>
      </div>
    </div>
  );
}
