import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { SystemInfo } from "../types";
import "../styles/system.css";

export default function SystemPage() {
  const [system, setSystem] = React.useState<SystemInfo | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSystem = async () => {
      try {
        const res = await api.getSystem();
        setSystem(res);
      } catch (err) {
        console.error("Erro ao carregar sistema:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSystem();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (!system) return <div className="error">Erro ao carregar dados</div>;

  return (
    <div className="system-page">
      <h1>Meu Sistema Solar</h1>

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
          <p
            style={{
              color: system.connectionStatus === "connected" ? "#10b981" : "#ef4444",
              fontWeight: "bold",
            }}
          >
            {system.connectionStatus === "connected" ? "● Conectado" : "● Desconectado"}
          </p>
        </div>

        <div className="info-group">
          <label>Última Sincronização</label>
          <p>{new Date(system.lastSync).toLocaleString("pt-BR")}</p>
        </div>
      </div>

      <div className="actions">
        <button className="btn-primary">Testar Conexão</button>
        <button className="btn-secondary">Atualizar Credenciais</button>
      </div>
    </div>
  );
}
