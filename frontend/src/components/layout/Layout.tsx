import React from "react";
import { useAuthStore } from "../store/auth";
import "../styles/layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>☀️ Solar</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
            ↔️
          </button>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/system">⚙️ Meu Sistema</a>
          <a href="/alerts">⚠️ Alertas</a>
          <a href="/reports">📄 Relatórios</a>
          <a href="/billing">💰 Faturas</a>
          <a href="/support">🎧 Suporte</a>
          <a href="/profile">👤 Perfil</a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            🚪 Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h3>Bem-vindo, {user?.name}!</h3>
          <div className="header-info">
            <span>{user?.email}</span>
          </div>
        </header>

        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
