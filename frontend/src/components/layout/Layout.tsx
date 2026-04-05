import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import "../../styles/layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fabOpen, setFabOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const user = useAuthStore((s: any) => s.user);
  const logout = useAuthStore((s: any) => s.logout);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (path: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setIsTransitioning(false);
      setFabOpen(false);
    }, 300);
  };

  const handleLogout = async () => {
    if (window.confirm("Tem certeza que deseja sair da conta?")) {
      await logout();
      navigate("/login");
    }
  };

  const breadcrumbs = location.pathname.split("/").filter(x => x);

  return (
    <div className={`layout ${isTransitioning ? "fade-out" : "fade-in"}`}>
      <style>{`
        .fade-in { opacity: 1; transition: opacity 0.3s ease; }
        .fade-out { opacity: 0; transition: opacity 0.3s ease; }
        
        /* Mobile Bottom Nav */
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 70px; background: rgba(10, 20, 40, 0.95); backdrop-filter: blur(20px); display: flex; justify-content: space-around; align-items: center; border-top: 1px solid rgba(16, 185, 129, 0.2); z-index: 1000; padding-bottom: env(safe-area-inset-bottom); }
        .bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: rgba(255,255,255,0.4); text-decoration: none; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s; }
        .bottom-nav-item.active { color: #10b981; transform: translateY(-4px); }
        .bottom-nav-icon { font-size: 20px; }

        /* FAB */
        .fab-container { position: fixed; bottom: 90px; right: 20px; z-index: 999; }
        @media (min-width: 769px) { .fab-container { bottom: 30px; right: 30px; } }
        .fab-main { width: 56px; height: 56px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #050b14; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4); border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .fab-main:hover { transform: scale(1.1) rotate(90deg); }
        .fab-menu { position: absolute; bottom: 70px; right: 0; background: rgba(13, 21, 37, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 20px; padding: 8px; display: flex; flex-direction: column; gap: 4px; min-width: 180px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform-origin: bottom right; transition: all 0.3s; opacity: 0; transform: scale(0.8) translateY(20px); pointer-events: none; }
        .fab-menu.open { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
        .fab-menu-item { padding: 12px 16px; color: white; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 10px; transition: all 0.2s; background: none; border: none; width: 100%; text-align: left; cursor: pointer; }
        .fab-menu-item:hover { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        /* Breadcrumbs */
        .breadcrumbs { display: flex; items-center: center; gap: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.3); margin-bottom: 20px; }
        .breadcrumb-item:hover { color: #10b981; cursor: pointer; }
        .breadcrumb-sep { opacity: 0.2; }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2 onClick={() => handleNavigate("/dashboard")} style={{ cursor: 'pointer' }}>SOLAR <span style={{color: '#10b981'}}>SAAS</span></h2>
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
            <button onClick={handleLogout} className="logout-btn">
              🚪 {sidebarOpen && "Sair da Conta"}
            </button>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="main-content" style={{ paddingBottom: isMobile ? '80px' : '0' }}>
        <header className="header">
          <div className="header-title">
            {!isMobile && (
              <div className="breadcrumbs">
                <span className="breadcrumb-item" onClick={() => handleNavigate("/dashboard")}>HOME</span>
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-item" onClick={() => handleNavigate(`/${breadcrumbs.slice(0, i+1).join("/")}`)}>
                      {crumb.replace("-", " ")}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
            <h3>Olá, {user?.name?.split(" ")[0] || "Usuário"}!</h3>
          </div>
          <div className="header-info">
            <span className="user-email hidden md:block">{user?.email}</span>
            {user?.planCode && <span className="plan-pill">{user.planCode.replace("_", " ").toUpperCase()}</span>}
          </div>
        </header>

        <div className="content-area">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav className="bottom-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
            <span className="bottom-nav-icon">📊</span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/system" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
            <span className="bottom-nav-icon">⚙️</span>
            <span>Sistema</span>
          </NavLink>
          <NavLink to="/billing" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
            <span className="bottom-nav-icon">💳</span>
            <span>Planos</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}>
            <span className="bottom-nav-icon">👤</span>
            <span>Perfil</span>
          </NavLink>
        </nav>
      )}

      {/* FLOATING ACTION BUTTON (FAB) */}
      <div className="fab-container">
        <div className={`fab-menu ${fabOpen ? "open" : ""}`}>
          <button onClick={() => handleNavigate("/dashboard")} className="fab-menu-item">🏠 Início</button>
          <button onClick={() => handleNavigate("/billing")} className="fab-menu-item">💳 Trocar de Plano</button>
          <button onClick={() => handleNavigate("/support")} className="fab-menu-item">🎧 Suporte Técnico</button>
          <button onClick={handleLogout} className="fab-menu-item" style={{color: '#ef4444'}}>🚪 Sair</button>
        </div>
        <button className="fab-main" onClick={() => setFabOpen(!fabOpen)}>
          {fabOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}
