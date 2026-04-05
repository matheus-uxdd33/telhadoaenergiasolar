import React from "react";
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../services/api";
import { DashboardSummary } from "../types";
import { EnergyFlow } from "../components/dashboard/EnergyFlow";
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

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

  if (loading) return <div className="loading-screen">Sincronizando dados no servidor...</div>;

  const finalSummary = summary || {
    todayGeneration: 0,
    monthGeneration: 0,
    lastSync: new Date().toISOString()
  };

  // Zero-State Onboarding Mockup Flow
  // Mostramos isso se o resumo vier zerado (Novo Usuário)
  const isZeroState = finalSummary.todayGeneration === 0 && finalSummary.monthGeneration === 0;

  if (isZeroState) {
    return (
      <div style={{ padding: "60px 40px", minHeight: "100vh", background: "#060d18", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <style>{`
          @keyframes slideUp { from { opacity:0; transform:translateY(20px)} to { opacity:1; transform:translateY(0)} }
          .wiz-btn { transition: all 0.2s; }
          .wiz-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(16,185,129,0.2) }
        `}</style>

        <div style={{ textAlign: "center", marginBottom: 40, animation: "slideUp 0.5s ease" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <span style={{ fontSize: 32 }}>👋</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Olá de novo! Vamos começar.</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 500 }}>
            Para monitorar sua usina e ver quanto você está economizando, precisamos conectar seu sistema à plataforma.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, width: "100%", animation: "slideUp 0.6s ease" }}>
          {/* Botao 1: QR Code */}
          <div className="wiz-btn" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 24, padding: "40px 32px", textAlign: "center", cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)" }} />
            <div style={{ fontSize: 48, marginBottom: 20 }}>📲</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Câmera do Celular</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Aponte a câmera para o adesivo de QR Code lateral do Data Logger (Inversor).</p>
            <button style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Abrir Câmera
            </button>
          </div>

          {/* Botao 2: Digitar S/N */}
          <div className="wiz-btn" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "40px 32px", textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⌨️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Digitar Serial (S/N)</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Digite manualmente o número de série e a marca do seu inversor.</p>
            <button style={{ width: "100%", padding: "14px", background: "transparent", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Digitar Código
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40, animation: "slideUp 0.7s ease" }}>
          <a href="#" style={{ color: "#10b981", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} onClick={e => {
            e.preventDefault();
            alert("O Número de Série (S/N) costuma ter de 10 a 16 caracteres alfanuméricos e fica localizado numa etiqueta colada na lateral ou em baixo do seu inversor solar.");
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            Não sei onde encontrar o S/N do Inversor
          </a>
        </div>
      </div>
    );
  }

  const currentSavings = finalSummary.todayGeneration * kwhRate;

  return (
    <div className="dashboard-premium">
      <header className="premium-header">
        <div className="header-title">
          <h1>{getGreeting()}, {simpleMode ? "sua usina está a todo vapor! 🚀" : "Mestre Solar! 👋"}</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '4px' }}>
            {simpleMode ? "Confira quanto você já economizou hoje." : "Monitoramento em tempo real do seu sistema solar."}
          </p>
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
              <p className="simple-hint">Suficiente para manter uma geladeira ligada por 3 dias!</p>
            </div>

            <div className="premium-card">
              <span className="card-label">GERAÇÃO DO DIA</span>
              <div className="card-value">
                {finalSummary.todayGeneration.toFixed(1)} <span className="unit">kWh</span>
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
                {finalSummary.todayGeneration.toFixed(1)} <span className="unit">kWh</span>
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
                <span className="currency">R$</span> {(finalSummary.monthGeneration * kwhRate).toFixed(0)}
              </div>
              <span className="card-delta positive">↑ Baseada na tarifa de {location}</span>
            </div>

            <div className="premium-card">
              <span className="card-label">CO₂ EVITADO</span>
              <div className="card-value">
                {Math.round(finalSummary.todayGeneration * 0.5)} <span className="unit">kg</span>
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
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
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
                    <p>Monitoramento térmico estável no momento.</p>
                  </div>
                </div>
              </div>

              <div className="energy-flow-section">
                <h3 className="section-title">Fluxo de Energia</h3>
                <EnergyFlow generation={finalSummary.todayGeneration} />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="sync-info">
        <p>📡 {location} | Sincronizado em {new Date(finalSummary.lastSync).toLocaleString("pt-BR")}</p>
      </div>
    </div>
  );
}
