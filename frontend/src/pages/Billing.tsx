import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/billing.css";

/**
 * Billing Page — PagBank Live Integration
 * Fluxo real: PIX (QR Code) ou Cartão (Redirect) via POST /api/billing/checkout
 */

type PlanCode = "emergency_7d" | "residencial_full" | "combo_residencial" | "empresa_premium";
type PayMethod = "pix" | "card";

interface CheckoutResult {
  mode: "live" | "mock";
  paymentId: string;
  status: string;
  message: string;
  checkoutUrl?: string;
  pixCode?: string;
  qrCodeBase64?: string;
  expiresAt?: string;
}

const PLANS = [
  {
    code: "emergency_7d" as PlanCode,
    name: "Emergencial",
    price: 15,
    period: "7 dias",
    features: ["1 Inversor", "Alertas de Emergência", "Geração em Tempo Real"],
    roi: 3,
  },
  {
    code: "residencial_full" as PlanCode,
    name: "Residencial",
    price: 59.9,
    period: "mês",
    features: ["1 Residência", "Histórico Completo", "Relatórios + Suporte"],
    roi: 30,
    recommended: true,
  },
  {
    code: "combo_residencial" as PlanCode,
    name: "Multi-Casas",
    price: 99.9,
    period: "mês",
    features: ["Até 3 Imóveis", "Visão Comparativa", "4 Usuários"],
    roi: 22,
  },
  {
    code: "empresa_premium" as PlanCode,
    name: "Empresa",
    price: 189,
    period: "mês",
    features: ["20 Unidades", "API Acesso", "Suporte Prioritário"],
    whatsapp: true,
  },
];

function PaymentModal({
  result,
  planName,
  onClose,
}: {
  result: CheckoutResult;
  planName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyPix = () => {
    if (result.pixCode) {
      navigator.clipboard.writeText(result.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16, backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 440,
          background: "#0d1525", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 24, padding: 32, position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: "rgba(255,255,255,0.5)", width: 32, height: 32,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >×</button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>
            {result.mode === "live" ? "✅ PagBank — Cobrança Real" : "⚠️ Modo Sandbox (Teste)"}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>
            Assinar {planName}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
            {result.message}
          </p>
        </div>

        {/* PIX QR Code */}
        {result.qrCodeBase64 && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{
              display: "inline-block", padding: 12,
              background: "#fff", borderRadius: 16,
            }}>
              <img
                src={result.qrCodeBase64}
                alt="QR Code PIX"
                style={{ width: 180, height: 180, display: "block" }}
              />
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
              Escaneie o QR Code com seu banco
            </p>
          </div>
        )}

        {/* PIX Copy Paste Code */}
        {result.pixCode && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "10px 14px",
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <input
                readOnly
                value={result.pixCode}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "monospace",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              />
              <button
                onClick={copyPix}
                style={{
                  flexShrink: 0, padding: "6px 14px",
                  background: copied ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                  color: copied ? "#10b981" : "rgba(255,255,255,0.5)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        )}

        {/* Card Checkout Redirect */}
        {result.checkoutUrl && !result.pixCode && (
          <a
            href={result.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", width: "100%", padding: "16px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "none", borderRadius: 14, color: "#fff",
              fontSize: 15, fontWeight: 700, textAlign: "center",
              textDecoration: "none", marginBottom: 10,
            }}
          >
            💳 Pagar com Cartão no PagBank →
          </a>
        )}

        <div style={{
          display: "flex", gap: 10, marginTop: 8,
          padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ fontSize: 11, color: "rgba(16,185,129,0.6)", flex: 1, display: "flex", gap: 6, alignItems: "center" }}>
            🔒 Pagamento seguro via PagBank
          </div>
          {result.expiresAt && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
              Expira: {new Date(result.expiresAt).toLocaleTimeString("pt-BR")}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 700, marginTop: "16px", cursor: "pointer" }}
        >
          Retornar ao Painel
        </button>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [busyKey, setBusyKey] = useState<PlanCode | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("pix");
  const [checkoutResult, setCheckoutResult] = useState<{ result: CheckoutResult; planName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPrice = (price: number) => isAnnual ? price * 0.8 : price;

  const handleCheckout = async (planCode: PlanCode, planName: string) => {
    setBusyKey(planCode);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planCode, paymentMethod: payMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar cobrança.");
      setCheckoutResult({ result: data, planName });
    } catch (err: any) {
      setError(err.message || "Falha ao conectar com o PagBank. Tente novamente.");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="system-page max-w-6xl mx-auto py-12 px-6">
      {checkoutResult && (
        <PaymentModal
          result={checkoutResult.result}
          planName={checkoutResult.planName}
          onClose={() => setCheckoutResult(null)}
        />
      )}

      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          Potencialize sua Economia Solar
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Escolha o plano ideal. Pagamento via PIX ou cartão, direto pelo PagBank.
        </p>

        {/* Payment Method Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPayMethod("pix")}
            style={{
              padding: "8px 20px", borderRadius: 99, fontWeight: 700, fontSize: 13,
              background: payMethod === "pix" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
              border: payMethod === "pix" ? "1.5px solid #10b981" : "1.5px solid rgba(255,255,255,0.08)",
              color: payMethod === "pix" ? "#10b981" : "rgba(255,255,255,0.4)",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >⚡ PIX</button>
          <button
            onClick={() => setPayMethod("card")}
            style={{
              padding: "8px 20px", borderRadius: 99, fontWeight: 700, fontSize: 13,
              background: payMethod === "card" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
              border: payMethod === "card" ? "1.5px solid #10b981" : "1.5px solid rgba(255,255,255,0.08)",
              color: payMethod === "card" ? "#10b981" : "rgba(255,255,255,0.4)",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >💳 Cartão</button>
        </div>

        {/* Cycle Toggle */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className={`text-sm font-bold transition-colors ${!isAnnual ? "text-primary" : "text-gray-500"}`}>Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-9 bg-gray-900 rounded-full relative p-1.5 transition-all border border-white/10 hover:border-primary/50"
          >
            <div className={`w-6 h-6 bg-primary rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] ${isAnnual ? "translate-x-7" : "translate-x-0"}`} />
          </button>
          <span className={`text-sm font-bold transition-colors ${isAnnual ? "text-primary" : "text-gray-500"}`}>
            Anual{" "}
            <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
              2 meses grátis
            </span>
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 12, padding: "12px 20px", marginBottom: 24,
          color: "#f87171", fontSize: 13, fontWeight: 500, textAlign: "center",
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map(plan => (
          <div
            key={plan.code}
            className={`glass p-8 rounded-[40px] relative transition-all hover:scale-[1.02] group ${plan.recommended ? "ring-2 ring-primary bg-primary/5" : "border-white/5"}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full shadow-[0_10px_20px_rgba(16,185,129,0.3)] animate-pulse tracking-widest uppercase">
                Mais Popular
              </div>
            )}

            <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 text-white mb-4">
              <span className="text-sm opacity-40 font-bold">R$</span>
              <span className="text-4xl font-black tracking-tighter">
                {getPrice(plan.price).toFixed(2).replace(".", ",")}
              </span>
              <span className="text-xs opacity-30 ml-1">/{plan.period}</span>
            </div>

            {plan.roi && (
              <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-6">
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] text-center">
                  🍃 ROI estimado em {plan.roi} dias
                </p>
              </div>
            )}

            <ul className="space-y-3 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">✔</span>
                  {f}
                </li>
              ))}
            </ul>

            {plan.whatsapp ? (
              <a
                href="https://wa.me/5511999999999?text=Olá! Tenho interesse no plano Empresa do Solar SaaS."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-3xl font-black hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 block text-center"
                style={{ textDecoration: "none" }}
              >
                <span>💬</span> Falar com Consultor
              </a>
            ) : (
              <button
                className={`w-full p-4 rounded-3xl font-black transition-all flex items-center justify-center gap-2 ${plan.recommended ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"} active:scale-95`}
                disabled={busyKey === plan.code}
                onClick={() => handleCheckout(plan.code, plan.name)}
              >
                {busyKey === plan.code ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {payMethod === "pix" ? "⚡ Pagar com PIX" : "💳 Pagar com Cartão"}
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Trust */}
      <div className="mt-20 pt-12 border-t border-white/5 flex flex-col items-center">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em] mb-6 text-center">
          Pagamentos Protegidos por
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-xl font-black tracking-tighter">PAGBANK</span>
          <span className="text-xl font-black tracking-tighter text-green-500">PIX</span>
          <span className="text-xl font-black tracking-tighter text-emerald-500">GROWATT</span>
          <span className="text-xl font-black tracking-tighter">DEYE</span>
        </div>
        <p className="text-[10px] text-gray-700 mt-6">
          🔒 Ambiente Sandbox ativo — para produção, troque para o token de produção do PagBank
        </p>
      </div>
    </div>
  );
}

export { BillingPage as Billing };
