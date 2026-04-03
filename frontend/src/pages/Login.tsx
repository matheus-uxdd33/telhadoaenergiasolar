import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import api from "../services/api";
import "../styles/auth.css";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s: any) => s.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.login(email, password);
      setAuth(res.user, res.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Falha ao autenticar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Solar SaaS</h1>
        <span className="login-subtitle">Acesso exclusivo para clientes e parceiros</span>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>E-mail Corporativo</label>
            <input
              type="email"
              placeholder="ex: cliente@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha de Acesso</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>

        <p className="demo-hint">
          <strong>Tenha monitorado sua rede energética</strong>
        </p>
      </div>
    </div>
  );
}
