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
          <h2>SOLAR SAAS</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/system" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">⚙️</span>
            {sidebarOpen && <span>Meu Sistema</span>}
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">⚠️</span>
            {sidebarOpen && <span>Alertas</span>}
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">📄</span>
            {sidebarOpen && <span>Relatórios</span>}
          </NavLink>
          <NavLink to="/billing" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">💳</span>
            {sidebarOpen && <span>Planos</span>}
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">🎧</span>
            {sidebarOpen && <span>Suporte</span>}
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">👤</span>
            {sidebarOpen && <span>Perfil</span>}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            🚪 {sidebarOpen && "Sair da Conta"}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h3>Bem-vindo, {user?.name || "Usuário"}!</h3>
          </div>
          <div className="header-info">
            <span className="user-email">{user?.email}</span>
            {user?.planCode && <span className="plan-pill">{user.planCode.toUpperCase()}</span>}
          </div>
        </header>

        <div className="content-area">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
