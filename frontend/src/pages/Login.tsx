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
      setError(err.response?.data?.error || "Falha ao autenticar no Supabase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>☀️ Painel Solar</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail cadastrado no Supabase"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="demo-hint">Crie o usuário em Supabase Auth ou use o endpoint `POST /api/auth/register`.</p>
      </div>
    </div>
  );
}
