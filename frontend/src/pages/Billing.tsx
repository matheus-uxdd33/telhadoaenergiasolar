import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/billing.css";

/**
 * Billing Page - Premium Redesign
 * 
 * Features:
 * - Monthly/Annual Toggle
 * - ROI Estimation
 * - Upgrade Logic
 * - Glassmorphism UI
 */

export const Billing: React.FC = () => {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // Mock plans data - should ideally come from backend/config
  const plans = [
    { code: "basic", name: "Residencial", price: 29.90, cycleLabel: "mês", roiDays: 45, features: ["1 Inversor", "Alertas WhatsApp", "Suporte Padrão"] },
    { code: "profssional", name: "Pro Solar", price: 59.90, cycleLabel: "mês", roiDays: 32, features: ["Até 5 Inversores", "Previsão Neural", "Suporte Prioritário"], recommended: true },
    { code: "empresa_premium", name: "Empresa Premium", price: 199.90, cycleLabel: "mês", roiDays: 20, features: ["Inversores Ilimitados", "API Access", "Créditos de Carbono"], whatsapp: true },
  ];

  const getPrice = (price: number) => isAnnual ? price * 0.8 : price; // 20% discount for annual

  return (
    <div className="system-page max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Potencialize sua Economia</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Escolha o plano ideal para gerir sua energia com inteligência artificial e diagnósticos de alta precisão.</p>

        {/* Toggle Switch */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-primary' : 'text-gray-500'}`}>Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-9 bg-gray-900 rounded-full relative p-1.5 transition-all border border-white/10 hover:border-primary/50"
          >
            <div className={`w-6 h-6 bg-primary rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-primary' : 'text-gray-500'}`}>
            Anual <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">2 meses grátis</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div key={plan.code} className={`glass p-8 rounded-[40px] relative transition-all hover:scale-[1.02] group ${plan.recommended ? 'ring-2 ring-primary bg-primary/5' : 'border-white/5'}`}>
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full shadow-[0_10px_20px_rgba(16,185,129,0.3)] animate-pulse tracking-widest uppercase">
                Mais Popular
              </div>
            )}

            <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 text-white mb-6">
              <span className="text-lg opacity-40 font-bold">R$</span>
              <span className="text-5xl font-black tracking-tighter">{getPrice(plan.price).toFixed(2).replace('.', ',')}</span>
              <span className="text-xs opacity-30 ml-1">/{plan.cycleLabel}</span>
            </div>

            <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-8">
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] text-center">
                🍃 ROI: Se paga em {plan.roiDays} dias de sol
              </p>
            </div>

            <ul className="space-y-4 mb-12">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">✔</span>
                  {f}
                </li>
              ))}
            </ul>

            {plan.whatsapp ? (
              <button className="w-full p-5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-3xl font-black hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95">
                <span className="text-xl">💬</span> Falar com Consultor
              </button>
            ) : (
              <button
                className={`w-full p-5 rounded-3xl font-black transition-all flex items-center justify-center gap-2 ${plan.recommended ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'} active:scale-95`}
                onClick={() => setBusyKey(plan.code)}
              >
                {busyKey === plan.code ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  'Começar Agora'
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em] mb-10 text-center">Tecnologia Certificada e Segura</p>
        <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-2xl font-black tracking-tighter">PAGBANK</span>
          <span className="text-2xl font-black tracking-tighter text-emerald-500">GROWATT</span>
          <span className="text-2xl font-black tracking-tighter">DEYE</span>
          <span className="text-2xl font-black tracking-tighter">SUNGROW</span>
        </div>
      </div>
    </div>
  );
};
