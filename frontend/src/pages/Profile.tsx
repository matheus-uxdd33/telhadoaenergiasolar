import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import api from "../services/api";
import "../styles/dashboard.css";

export default function ProfilePage() {
    const user = useAuthStore((s: any) => s.user);
    const logout = useAuthStore((s: any) => s.logout);
    const [system, setSystem] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        api.getSystem().then(res => {
            setSystem(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-premium fadeIn">
            <header className="premium-header">
                <div className="header-title">
                    <h1>Meu Perfil</h1>
                    <p style={{ color: 'var(--text-light)' }}>Gerencie sua conta e visualize suas conexões</p>
                </div>
                <button onClick={handleLogout} className="nav-btn" style={{ borderColor: '#ff4444', color: '#ff4444' }}>
                    Sair da Conta
                </button>
            </header>

            <div className="main-charts-grid">
                <div className="premium-card">
                    <span className="card-label">DADOS PESSOAIS</span>
                    <div style={{ marginTop: '20px' }}>
                        <p><strong>Nome:</strong> {user?.name || 'Não informado'}</p>
                        <p><strong>E-mail:</strong> {user?.email}</p>
                        <p><strong>ID do Cliente:</strong> {user?.userId?.substring(0, 8)}...</p>
                    </div>
                    <button className="nav-btn" style={{ marginTop: '20px', width: 'fit-content' }}>Editar Dados</button>
                </div>

                <div className="premium-card highlight">
                    <span className="card-label">STATUS DE CONECTIVIDADE</span>
                    {loading ? (
                        <p>Carregando status...</p>
                    ) : system && !system.setupRequired ? (
                        <div style={{ marginTop: '20px' }}>
                            <p><strong>Inversor:</strong> {system.inverterBrand} - {system.inverterModel}</p>
                            <p><strong>Status:</strong> <span style={{ color: system.connectionStatus === 'connected' ? '#10b981' : '#f59e0b' }}>
                                ● {system.connectionStatus === 'connected' ? 'Conectado e Sincronizando' : 'Pendente / Aguardando'}
                            </span></p>
                            <p><strong>Última Leitura:</strong> {new Date(system.lastSync).toLocaleString("pt-BR")}</p>
                            <button
                                onClick={() => navigate("/connect-brand")}
                                className="nav-btn primary"
                                style={{ marginTop: '20px', width: '100%' }}
                            >
                                Alterar Equipamento
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <p>Nenhum inversor conectado ainda.</p>
                            <button
                                onClick={() => navigate("/connect-brand")}
                                className="nav-btn primary"
                                style={{ marginTop: '15px' }}
                            >
                                Conectar Agora
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="simple-alert-box" style={{ marginTop: '30px' }}>
                <h3>🔒 Segurança da Conta</h3>
                <p>Sua conta está protegida por criptografia de ponta a ponta. Suas chaves de API e senhas de inversores são armazenadas de forma segura no Supabase.</p>
            </div>
        </div>
    );
}
