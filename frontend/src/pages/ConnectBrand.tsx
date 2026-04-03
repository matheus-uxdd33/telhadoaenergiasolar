import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import api from "../services/api";

const BRAND_ICONS: Record<string, string> = {
    growatt: "⚡",
    solarman: "🔋",
    sungrow: "☀️",
    solis: "☁️",
    victron: "🔌",
    goodwe: "🏢",
    huawei: "🦾",
    fronius: "🔥",
    generic: "⚙️"
};

export default function ConnectBrandPage() {
    const [availableBrands, setAvailableBrands] = React.useState<any[]>([]);
    const [selectedBrand, setSelectedBrand] = React.useState<any | null>(null);
    const [formData, setFormData] = React.useState({
        model: "",
        username: "",
        password: "",
        apiToken: "",
        installedPower: 5000,
        location: "Brasil",
        distributor: "Outra"
    });
    const [connecting, setConnecting] = React.useState(false);
    const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchBrands = async () => {
            try {
                console.log("Buscando catálogo de marcas...");
                const res = await api.getInverterBrands();
                console.log("Marcas recebidas:", res?.brands?.length);
                setAvailableBrands(res.brands || []);
            } catch (err) {
                console.error("Erro ao carregar marcas:", err);
                setFeedback({ type: 'error', msg: "Erro ao carregar catálogo. Verifique sua internet." });
            }
        };
        fetchBrands();
    }, []);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setConnecting(true);
        setFeedback(null);

        try {
            const { model, ...rest } = formData;
            const result = await api.updateSystemCredentials({
                brandCode: selectedBrand.code,
                model: model || selectedBrand.models?.[0] || "Modelo Padrão",
                authMethod: selectedBrand.authModes?.[0] || "credentials",
                ...rest
            });

            if (result) {
                setFeedback({ type: 'success', msg: "Sistema conectado com sucesso!" });
                setTimeout(() => navigate("/dashboard"), 1500);
            }
        } catch (err) {
            setFeedback({ type: 'error', msg: "Erro ao conectar. Verifique as credenciais." });
        } finally {
            setConnecting(false);
        }
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
                    {availableBrands.length > 0 ? availableBrands.map(brand => (
                        <div key={brand.code} className="brand-card" onClick={() => setSelectedBrand(brand)}>
                            <span className="brand-logo">{BRAND_ICONS[brand.code] || "⚙️"}</span>
                            <span className="brand-name">{brand.name}</span>
                            <button className="connect-select-btn">Selecionar</button>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
                            <p>Carregando catálogo de inversores...</p>
                            <button onClick={() => window.location.reload()} className="nav-btn" style={{ marginTop: '10px' }}>Tentar Novamente</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="connection-form-container">
                    <button className="back-btn" onClick={() => { setSelectedBrand(null); setFeedback(null); }}>← Voltar para marcas</button>
                    <div className="premium-card highlight" style={{ maxWidth: '500px', margin: '20px auto' }}>
                        <h2>Configurar {selectedBrand.name}</h2>

                        {feedback && (
                            <div className={`status-box ${feedback.type}`} style={{ marginBottom: '15px' }}>
                                {feedback.msg}
                            </div>
                        )}

                        <form onSubmit={handleConnect} className="connect-form">
                            <div className="form-group">
                                <label>Modelo do Inversor</label>
                                <select
                                    required
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                >
                                    <option value="">Selecione o modelo...</option>
                                    {selectedBrand.models?.map((m: string) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                    <option value="Outro">Outro modelo (Manual)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Login / Usuário do Portal</label>
                                <input
                                    type="text"
                                    placeholder="Seu usuário"
                                    required
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Senha do Portal</label>
                                <input
                                    type="password"
                                    placeholder="Sua senha"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Potência Instalada (em Watts)</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 5000"
                                    required
                                    value={formData.installedPower}
                                    onChange={e => setFormData({ ...formData, installedPower: parseInt(e.target.value) })}
                                />
                            </div>

                            <button type="submit" className="nav-btn primary" style={{ width: '100%', marginTop: '20px' }}>
                                {connecting ? "Validando Conexão..." : "Sincronizar Usina"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
