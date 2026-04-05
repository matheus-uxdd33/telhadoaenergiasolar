import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { supabase } from "../database/supabase";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "emergency_7d",
    name: "Residencial Básico",
    price: 49,
    priceAnual: 39,
    desc: "Monitoramento essencial para sua casa.",
    features: ["1 inversor", "Monitoramento básico", "Alertas por e-mail", "App mobile"],
    cta: "Começar Agora",
  },
  {
    id: "residencial_full",
    name: "Residencial Premium",
    price: 99,
    priceAnual: 79,
    desc: "O padrão ouro para residências.",
    popular: true,
    features: ["Até 3 inversores", "Relatórios em PDF", "Alertas inteligentes", "Suporte prioritário", "Análise de ROI"],
    cta: "Assinar Premium",
  },
  {
    id: "empresa_premium_10mw",
    name: "Empresa Premium (10MW)",
    price: 499,
    priceAnual: 399,
    desc: "Engenharia de Missão Crítica.",
    industrial: true,
    features: ["Inversores ilimitados", "Análise de Curva I-V", "Alertas de Fuga de Corrente", "Relatório de Carbono", "Gerente dedicado"],
    cta: "Falar com Especialista",
  },
];

const PARTNER_LOGOS = ["Growatt", "Deye", "WEG", "Sungrow", "Sofar", "Canadian Solar", "Fronius", "Solis"];

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const plansRef = useRef<HTMLElement>(null);
  const { signUpWithWhatsApp } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim() || !phone.trim() || !email || !password) {
          throw new Error("Preencha todos os campos obrigatórios.");
        }
        await signUpWithWhatsApp(email, password, name, phone);
        toast.success("Conta criada! Redirecionando...");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("E-mail ou senha incorretos.");
        toast.success("Acesso autorizado!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const phoneMask = (val: string) => {
    let r = val.replace(/\D/g, "");
    if (r.length > 11) r = r.substring(0, 11);
    if (r.length > 2) r = r.replace(/^(\d{2})(\d)/g, "($1) $2");
    if (r.length > 7) r = r.replace(/(\d{5})(\d)/, "$1-$2");
    return r;
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-[100] h-20 glass-header flex items-center justify-between px-6 md:px-12 transition-all ${scrolled ? 'border-b border-white/5' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <SunIcon />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Solar <span className="text-emerald-500">SaaS</span></span>
        </div>
        <button 
          onClick={() => { setIsRegistering(false); window.scrollTo({top: 0, behavior: 'smooth'}); }}
          className="text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-500/20 hover:bg-emerald-500 hover:text-[#050b14] transition-all"
        >
          Entrar
        </button>
      </header>

      {/* ── SECTION 1: HERO & LOGIN ── */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08)_0%,transparent_50%)]">
        <div className="max-w-[1000px] w-full text-center space-y-8 animate-fade-up">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-[-2px] leading-[0.95] uppercase">
              Monitoramento de <br />
              <span className="text-emerald-500 animate-glow-green">Missão Crítica</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/40 font-medium tracking-tight">
              Engenharia de precisão para geração ininterrupta de <span className="text-white">5kW a 10MW</span>.
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="w-full max-w-[420px] mx-auto glass-card rounded-[32px] p-8 md:p-10 space-y-8">
            {/* Pill Toggle */}
            <div className="relative flex p-1 bg-white/5 rounded-full">
              <div 
                className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-emerald-500 rounded-full transition-transform duration-300 ease-out shadow-lg shadow-emerald-500/20"
                style={{ transform: isRegistering ? 'translateX(100%)' : 'translateX(0)' }}
              />
              <button 
                className={`relative flex-1 py-2 text-[11px] font-black tracking-widest uppercase z-10 transition-colors duration-300 ${!isRegistering ? 'text-[#050b14]' : 'text-white/40'}`}
                onClick={() => setIsRegistering(false)}
              >
                Acessar Painel
              </button>
              <button 
                className={`relative flex-1 py-2 text-[11px] font-black tracking-widest uppercase z-10 transition-colors duration-300 ${isRegistering ? 'text-[#050b14]' : 'text-white/40'}`}
                onClick={() => setIsRegistering(true)}
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ex: João da Silva" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="w-full h-12 rounded-xl px-4 bg-[#050b14]/80 border border-white/5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="(00) 00000-0000" 
                      value={phone} 
                      onChange={e => setPhone(phoneMask(e.target.value))}
                      className="w-full h-12 rounded-xl px-4 bg-[#050b14]/80 border border-white/5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    />
                  </div>
                </>
              )}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl px-4 bg-[#050b14]/80 border border-white/5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-12 rounded-xl px-4 pr-12 bg-[#050b14]/80 border border-white/5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-emerald-500 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-[#050b14] font-black rounded-2xl text-[13px] uppercase tracking-widest mt-6 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Processando..." : (
                  <>
                    {isRegistering ? "Confirmar Registro" : "Acessar Sistema"}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: MARQUEE LOGOS ── */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex animate-marquee opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
            <div key={i} className="flex items-center gap-2 mx-12 font-black text-xl tracking-tighter text-white/20 uppercase whitespace-nowrap">
              <span className="text-emerald-500">⚡</span> {logo}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: PLANOS EXECUTIVOS ── */}
      <section ref={plansRef} className="py-32 px-6 md:px-12 bg-[#060d18]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              ⚡ 20% OFF Assinatura Anual
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Investimento em <span className="text-emerald-500">Eficiência</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map(plan => (
              <div 
                key={plan.id}
                className={`p-10 rounded-[40px] glass-card flex flex-col space-y-8 transition-all hover:translate-y-[-10px] hover:border-emerald-500/40 ${plan.industrial ? 'industrial-neon' : ''}`}
              >
                {plan.popular && <span className="bg-emerald-500 text-[#050b14] text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full w-fit">Mais Escolhido</span>}
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p className="text-sm text-white/40 font-medium">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-white/20">R$</span>
                  <span className="text-5xl font-black tracking-tighter">{annual ? plan.priceAnual : plan.price}</span>
                  <span className="text-xs font-bold text-white/20 uppercase tracking-widest">/mês</span>
                </div>
                <div className="space-y-4 flex-grow">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-semibold text-white/60">
                      <CheckIcon /> {f}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => { setIsRegistering(true); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                  className={`w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${plan.industrial ? 'bg-emerald-500 text-[#050b14] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 border-t border-white/5 text-center bg-[#050b14]">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex items-center justify-center gap-2 opacity-20 grayscale">
            <SunIcon /> <span className="font-black tracking-tighter">SOLAR SAAS</span>
          </div>
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[6px]">Engenharia de Monitoramento • Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
