import React from "react";
import api from "../services/api";
import { Alert } from "../types";
import "../styles/alerts.css";

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = React.useState<Alert[]>([]);
  const [filter, setFilter] = React.useState<string>("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await api.getAlerts();
        setAlerts(res.alerts || []);
        setFilteredAlerts(res.alerts || []);
      } catch (err) {
        console.error("Erro ao carregar alertas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const handleFilter = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter === "all") {
      setFilteredAlerts(alerts);
    } else {
      setFilteredAlerts(alerts.filter((a) => a.severity === newFilter));
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="alerts-page">
      <h1>Alertas do Sistema</h1>

      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => handleFilter("all")}
        >
          Todos ({alerts.length})
        </button>
        <button
          className={filter === "critical" ? "active" : ""}
          onClick={() => handleFilter("critical")}
        >
          Críticos
        </button>
        <button
          className={filter === "high" ? "active" : ""}
          onClick={() => handleFilter("high")}
        >
          Altos
        </button>
        <button
          className={filter === "medium" ? "active" : ""}
          onClick={() => handleFilter("medium")}
        >
          Médios
        </button>
        <button
          className={filter === "low" ? "active" : ""}
          onClick={() => handleFilter("low")}
        >
          Baixos
        </button>
      </div>

      <div className="alerts-table">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-row severity-${alert.severity}`}>
              <div className="alert-header">
                <strong>{alert.title}</strong>
                <span className={`badge severity-${alert.severity}`}>{alert.severity}</span>
              </div>
              <p>{alert.description}</p>
              <small>{new Date(alert.detectedAt).toLocaleString("pt-BR")}</small>
            </div>
          ))
        ) : (
          <p className="no-data">Nenhum alerta encontrado</p>
        )}
      </div>
    </div>
  );
}
