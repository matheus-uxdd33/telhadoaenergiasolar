import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { DashboardSummary, ChartData, Alert } from "../types";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [charts, setCharts] = React.useState<ChartData | null>(null);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryRes, chartsRes, alertsRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getDashboardCharts(),
          api.getAlerts(),
        ]);
        setSummary(summaryRes);
        setCharts(chartsRes);
        setAlerts(alertsRes.alerts || []);
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

  return (
    <div className="dashboard">
      <h1>Dashboard do Sistema Solar</h1>

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
