import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import "../../styles/layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const user = useAuthStore((s: any) => s.user);
  const logout = useAuthStore((s: any) => s.logout);

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
          <NavLink to="/dashboard">📊 Dashboard</NavLink>
          <NavLink to="/system">⚙️ Meu Sistema</NavLink>
          <NavLink to="/alerts">⚠️ Alertas</NavLink>
          <NavLink to="/reports">📄 Relatórios</NavLink>
          <NavLink to="/billing">💳 Planos</NavLink>
          <NavLink to="/support">🎧 Suporte</NavLink>
          <NavLink to="/profile">👤 Perfil</NavLink>
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
            {user?.planCode && <span className="plan-pill">Plano: {user.planCode}</span>}
          </div>
        </header>

        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
