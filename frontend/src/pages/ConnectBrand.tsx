import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const BRANDS = [
    { id: "growatt", name: "Growatt", logo: "⚡" },
    { id: "deye", name: "Deye", logo: "🔋" },
    { id: "fronius", name: "Fronius", logo: "☀️" },
    { id: "sma", name: "SMA", logo: "🏢" }
];

export default function ConnectBrandPage() {
    const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({ serial: "", apiKey: "", region: "Brasil" });
    const [connecting, setConnecting] = React.useState(false);
    const navigate = useNavigate();

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setConnecting(true);
        // Simulation
        setTimeout(() => {
            setConnecting(false);
            alert("Sistema conectado com sucesso! Sincronizando dados em tempo real.");
            navigate("/dashboard");
        }, 2000);
    };

    return (
        <div className="dashboard-premium">
            <header className="premium-header">
                <div className="header-title">
                    <h1>Conectar Novo Sistema</h1>
                    <p className="status-indicator">Selecione o fabricante do seu inversor para iniciar o monitoramento</p>
                </div>
            </header>

            {!selectedBrand ? (
                <div className="brand-grid">
                    {BRANDS.map(brand => (
                        <div key={brand.id} className="brand-card" onClick={() => setSelectedBrand(brand.id)}>
                            <span className="brand-logo">{brand.logo}</span>
                            <span className="brand-name">{brand.name}</span>
                            <button className="connect-select-btn">Selecionar</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="connection-form-container">
                    <button className="back-btn" onClick={() => setSelectedBrand(null)}>← Voltar para marcas</button>
                    <div className="premium-card highlight" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <h2>Configurar {BRANDS.find(b => b.id === selectedBrand)?.name}</h2>
                        <form onSubmit={handleConnect} className="connect-form">
                            <div className="form-group">
                                <label>Número de Série do Inversor (S/N)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: GRW-12345678"
                                    required
                                    value={formData.serial}
                                    onChange={e => setFormData({ ...formData, serial: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Chave de API / Token</label>
                                <input
                                    type="password"
                                    placeholder="Cole sua chave aqui"
                                    required
                                    value={formData.apiKey}
                                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Região de Instalação</label>
                                <select
                                    value={formData.region}
                                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                                >
                                    <option>Bahia</option>
                                    <option>Minas Gerais</option>
                                    <option>São Paulo</option>
                                    <option>Rio de Janeiro</option>
                                    <option>Goiás</option>
                                </select>
                            </div>
                            <button type="submit" className="nav-btn primary" style={{ width: '100%', marginTop: '20px' }}>
                                {connecting ? "Sincronizando..." : "Confirmar Conexão"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
