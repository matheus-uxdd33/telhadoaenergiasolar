import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ConnectBrandPage from "./pages/ConnectBrand";
import SystemPage from "./pages/System";
import AlertsPage from "./pages/Alerts";
import BillingPage from "./pages/Billing";
import SupportPage from "./pages/Support";
import ProfilePage from "./pages/Profile";
import ProvisioningPage from "./pages/Provisioning";
import { Toaster } from "react-hot-toast";
import "./styles/layout.css";

export default function App() {
  const isAuthenticated = useAuthStore((s: any) => s.isAuthenticated);

  React.useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#0a1428', color: '#fff', border: '1px solid #10b981' } }} />
      <Routes>
        {/* Unificado: Login e Register em uma só Landing Page Modal */}
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
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/provisioning" element={<ProvisioningPage />} />
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
