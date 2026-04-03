import React from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

export default function RegisterPage() {
    const [formData, setFormData] = React.useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await api.register(formData.email, formData.password, formData.name);
            alert("Conta criada com sucesso! Faça login para continuar.");
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.error || "Erro ao criar conta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-screen fadeIn">
            <div className="login-card">
                <div className="login-header">
                    <span className="logo-icon">☀️</span>
                    <h1>Criar Conta Solar SaaS</h1>
                    <p>Junte-se ao monitoramento solar inteligente</p>
                </div>

                {error && <div className="error-message" style={{ color: '#ff4444', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Senha"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirme a Senha"
                            required
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Criando conta..." : "Registrar Agora"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
                </div>
            </div>
        </div>
    );
}
