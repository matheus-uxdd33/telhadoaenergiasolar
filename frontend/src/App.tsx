import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ConnectBrandPage from "./pages/ConnectBrand";
import SystemPage from "./pages/System";
import AlertsPage from "./pages/Alerts";
import AlertsPage from "./pages/Alerts";
import BillingPage from "./pages/Billing";
import SupportPage from "./pages/Support";
import "./styles/layout.css";

export default function App() {
  const isAuthenticated = useAuthStore((s: any) => s.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/connect-brand" element={<ConnectBrandPage />} />
                  <Route path="/system" element={<SystemPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/reports" element={<div>📄 Relatórios (em breve)</div>} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/profile" element={<div>👤 Perfil (em breve)</div>} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}
