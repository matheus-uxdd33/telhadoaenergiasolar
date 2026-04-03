import React from "react";
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../services/api";
import { DashboardSummary } from "../types";
import "../styles/dashboard.css";

const hourlyData = [
  { name: '6h', value: 0.2 }, { name: '8h', value: 1.2 }, { name: '10h', value: 2.8 },
  { name: '12h', value: 4.5 }, { name: '14h', value: 4.2 }, { name: '16h', value: 3.1 },
  { name: '18h', value: 0.8 }
];

export default function DashboardPage() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [kwhRate, setKwhRate] = React.useState(0.85);
  const [simpleMode, setSimpleMode] = React.useState(false);
  const [location] = React.useState("Belo Horizonte, MG");

  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        const summaryRes = await api.getDashboardSummary();
        setSummary(summaryRes);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div className="loading-screen">Sincronizando dados com o inversor...</div>;
  if (!summary) return <div className="error-screen">Ops! Ocorreu um problema ao carregar os dados.</div>;

  const currentSavings = summary.todayGeneration * kwhRate;

  return (
    <div className="dashboard-premium">
      <header className="premium-header">
        <div className="header-title">
          <h1>{simpleMode ? "Sua Usina Solar" : "Monitoramento em tempo real"}</h1>
          <div className="status-indicator">
            <span className="dot online"></span>
            <span>{simpleMode ? "Sistema funcionando perfeitamente! ✅" : "Sistema ativo · Eficiência Térmica: 94%"}</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className={`nav-btn ${simpleMode ? "primary" : ""}`}
            onClick={() => setSimpleMode(!simpleMode)}
          >
            {simpleMode ? "✨ Modo Analítico" : "🌾 Modo Simples"}
          </button>
          {!simpleMode && (
            <div className="weather-widget">
              <span className="weather-icon">☀️</span>
              <div className="weather-info">
                <strong>32°C</strong>
                <span>{location}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {simpleMode ? (
        <div className="simple-mode-content fadeIn">
          <div className="big-status-card success">
            <span className="big-icon">🌞</span>
            <div className="status-text">
              <h2>Tudo Certo com seu Sol!</h2>
              <p>Sua geração está ótima hoje. Você já economizou bastante!</p>
            </div>
          </div>

          <div className="summary-grid">
            <div className="premium-card highlight large">
              <span className="card-label">DINHEIRO NO BOLSO HOJE</span>
              <div className="card-value large">
                <span className="currency">R$</span> {currentSavings.toFixed(2)}
              </div>
              <p className="simple-hint">Suficiente para manter sua geladeira ligada por 3 dias!</p>
            </div>

            <div className="premium-card">
              <span className="card-label">GERAÇÃO DO DIA</span>
              <div className="card-value">
                {summary.todayGeneration.toFixed(1)} <span className="unit">kWh</span>
              </div>
            </div>
          </div>

          <div className="simple-alert-box">
            <h3>💡 Dica do Especialista</h3>
            <p>O dia está lindo em {location}! Seus painéis estão limpos e gerando o máximo possível. Aproveite para usar as máquinas pesadas agora.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="summary-grid">
            <div className="premium-card">
              <span className="card-label">GERAÇÃO HOJE</span>
              <div className="card-value">
                {summary.todayGeneration.toFixed(1)} <span className="unit">kWh</span>
              </div>
              <span className="card-delta positive">↑ Monitoramento térmico OK</span>
            </div>

            <div className="premium-card highlight">
              <span className="card-label">LUCRO ESTIMADO HOJE</span>
              <div className="card-value">
                <span className="currency">R$</span> {currentSavings.toFixed(2)}
              </div>
              <div className="rate-selector">
                <label>Tarifa: R$ </label>
                <input
                  type="number"
                  step="0.01"
                  value={kwhRate}
                  onChange={e => setKwhRate(parseFloat(e.target.value))}
                  className="rate-input"
                />
              </div>
            </div>

            <div className="premium-card">
              <span className="card-label">ECONOMIA ESTIMADA (MÊS)</span>
              <div className="card-value">
                <span className="currency">R$</span> {(summary.monthGeneration * kwhRate).toFixed(0)}
              </div>
              <span className="card-delta positive">↑ Baseada na tarifa de {location}</span>
            </div>

            <div className="premium-card">
              <span className="card-label">CO₂ EVITADO</span>
              <div className="card-value">
                {Math.round(summary.todayGeneration * 0.5)} <span className="unit">kg</span>
              </div>
              <span className="card-delta positive">Equivale a 18 árvores</span>
            </div>
          </div>

          <div className="main-charts-grid">
            <div className="chart-container large">
              <div className="chart-header">
                <h3>Geração por hora — hoje</h3>
                <span className="unit">Dados processados via Engenharia Solar</span>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,158,11,0.1)' }}
                      contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="side-panel">
              <div className="status-alerts">
                <div className="status-box success">
                  <span className="icon">✓</span>
                  <div className="text">
                    <strong>Placas em temperatura ideal.</strong>
                    <p>Monitoramento térmico estável.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="sync-info">
        <p>📡 {location} | Sincronizado em {new Date(summary.lastSync).toLocaleString("pt-BR")}</p>
      </div>
    </div>
  );
}
