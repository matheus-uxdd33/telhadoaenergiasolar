import React from "react";
import api from "../services/api";
import { CheckoutResponse, SubscriptionPlan, SubscriptionState } from "../types";
import "../styles/billing.css";

export default function BillingPage() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [current, setCurrent] = React.useState<SubscriptionState | null>(null);
  const [checkout, setCheckout] = React.useState<CheckoutResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busyKey, setBusyKey] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const loadBilling = React.useCallback(async () => {
    try {
      const [plansRes, currentRes] = await Promise.all([api.getPlans(), api.getCurrentPlan()]);
      setPlans(plansRes.plans || []);
      setCurrent(currentRes.subscription || null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar planos.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const handleCheckout = async (planCode: string, paymentMethod: "pix" | "card") => {
    setBusyKey(`${planCode}-${paymentMethod}`);
    setMessage("");
    setError("");

    try {
      const res = await api.createCheckout(planCode, paymentMethod);
      setCheckout(res);
      setCurrent(res.subscription || null);
      setMessage(res.message || "Cobrança criada com sucesso.");

      if (paymentMethod === "card" && res.checkoutUrl) {
        window.open(res.checkoutUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Não foi possível gerar a cobrança.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDevConfirm = async () => {
    if (!checkout?.paymentId) return;

    try {
      const res = await api.confirmDevelopmentPayment(checkout.paymentId);
      setCurrent(res.subscription || null);
      setMessage(res.message || "Pagamento confirmado.");
      await loadBilling();
    } catch (err: any) {
      setError(err.response?.data?.error || "Falha ao confirmar pagamento local.");
    }
  };

  if (loading) return <div className="loading">Carregando planos...</div>;

  return (
    <div className="billing-page">
      <div className="billing-hero">
        <div>
          <h1>Planos e Pagamentos</h1>
          <p>
            Escolha o plano ideal e receba por <strong>PIX</strong> ou <strong>cartão</strong>
            com integração PagBank.
          </p>
        </div>

        {current && (
          <div className="current-plan-box">
            <span className="mini-label">Plano atual</span>
            <strong>{current.planName}</strong>
            <small>
              Status: <b>{current.status}</b> · até {new Date(current.expiresAt).toLocaleDateString("pt-BR")}
            </small>
          </div>
        )}
      </div>

      {message && <div className="success-banner">✅ {message}</div>}
      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="plans-grid">
        {plans.map((plan) => {
          const isCurrent = current?.planCode === plan.code && current?.status !== "expired";

          return (
            <div key={plan.code} className={`plan-card ${plan.code === "empresa_premium" ? "featured" : ""}`}>
              <div className="plan-header">
                <div>
                  <h2>{plan.name}</h2>
                  <p>{plan.audience}</p>
                </div>
                {isCurrent && <span className="current-badge">Ativo</span>}
              </div>

              <div className="plan-price">
                <strong>R$ {plan.price.toFixed(2)}</strong>
                <span>/{plan.cycleLabel}</span>
              </div>

              <p className="plan-description">{plan.description}</p>
              {plan.highlight && <div className="plan-highlight">⭐ {plan.highlight}</div>}

              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature.replace(/_/g, " ")}</li>
                ))}
              </ul>

              <div className="limits-box">
                <small>Até {plan.limits.maxSites} unidade(s) e {plan.limits.maxUsers} usuário(s)</small>
              </div>

              <div className="plan-actions">
                <button
                  onClick={() => handleCheckout(plan.code, "pix")}
                  disabled={busyKey !== null}
                  className="pix-btn"
                >
                  {busyKey === `${plan.code}-pix` ? "Gerando PIX..." : "Pagar com PIX"}
                </button>
                <button
                  onClick={() => handleCheckout(plan.code, "card")}
                  disabled={busyKey !== null}
                  className="card-btn"
                >
                  {busyKey === `${plan.code}-card` ? "Abrindo checkout..." : "Pagar com cartão"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {checkout && (
        <div className="checkout-panel">
          <h2>Pagamento em andamento</h2>
          <p>
            Método: <strong>{checkout.subscription?.paymentMethod === "pix" ? "PIX" : "Cartão"}</strong>
          </p>
          <p>
            Plano: <strong>{checkout.subscription?.planName}</strong>
          </p>

          {checkout.pixCode && (
            <>
              <label>Código PIX copia e cola</label>
              <textarea readOnly value={checkout.pixCode} rows={5} />
            </>
          )}

          {checkout.qrCodeBase64 && (
            <div className="pix-preview">
              <img src={checkout.qrCodeBase64} alt="QR Code PIX" />
            </div>
          )}

          {checkout.checkoutUrl && (
            <a href={checkout.checkoutUrl} target="_blank" rel="noreferrer" className="checkout-link">
              Abrir checkout seguro do PagBank
            </a>
          )}

          {checkout.mode === "mock" && checkout.status === "pending" && (
            <button onClick={handleDevConfirm} className="confirm-btn">
              Confirmar pagamento local
            </button>
          )}
        </div>
      )}
    </div>
  );
}
