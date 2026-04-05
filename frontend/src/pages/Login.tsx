import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { supabase } from "../database/supabase";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "emergency_7d",
    name: "Básico",
    price: 49,
    priceAnual: 41,
    desc: "Para quem está começando",
    color: "#64748b",
    features: ["1 inversor", "Monitoramento básico", "Alertas por e-mail", "App mobile"],
    cta: "Começar grátis",
  },
  {
    id: "residencial_full",
    name: "Residencial",
    price: 99,
    priceAnual: 82,
    desc: "O mais escolhido",
    color: "#10b981",
    popular: true,
    features: ["Até 3 inversores", "Relatórios em PDF", "Alertas inteligentes", "Suporte prioritário", "Análise de ROI"],
    cta: "Assinar agora",
  },
  {
    id: "industrial_10mw",
    name: "Industrial 10MW",
    price: 999,
    priceAnual: 799,
    desc: "Missão Crítica & Solo",
    color: "#10b981",
    industrial: true,
    features: [
      "Usinas ilimitadas", 
      "Análise de Curva I-V", 
      "Alertas de Fuga de Corrente", 
      "Relatório de Manutenção Preventiva",
      "SLA de 99.9% Garantido"
    ],
    cta: "Falar com Engenheiro",
  },
];

const TESTIMONIALS = [
  {
    name: "Carlos Eduardo",
    role: "Integrador Solar",
    content: "O melhor monitoramento do Brasil. Reduzi meu custo operacional em 40% acompanhando todos os meus clientes num só lugar.",
    stars: 5,
    avatar: "👨"
  },
  {
    name: "Marina Silva",
    role: "Cliente Residencial",
    content: "Economia real de R$ 800/mês! O alerta inteligente me avisou de uma perda no inversor antes mesmo de eu notar na conta da concessionária.",
    stars: 5,
    avatar: "👩"
  },
  {
    name: "Roberto Mendes",
    role: "Proprietário Fazenda",
    content: "Simples, direto e não quebra nunca. A equipe de suporte resolve direto pelo WhatsApp. Já indiquei para todos meus vizinhos.",
    stars: 5,
    avatar: "👨‍🌾"
  }
];

const PARTNER_LOGOS = ["Growatt", "Deye", "WEG", "Sungrow", "Sofar", "Canadian Solar"];

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const CheckIcon = ({ color = "#10b981" }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7.5" cy="7.5" r="7.5" fill={color} fillOpacity="0.15" />
    <path d="M4.5 7.5L6.5 9.5L10.5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    {open ? (
      <>
        <path d="M1 8.5C3 5 5.5 3 8.5 3s5.5 2 7.5 5.5c-2 3.5-4.5 5.5-7.5 5.5S3 12 1 8.5z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        <circle cx="8.5" cy="8.5" r="2.2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
      </>
    ) : (
      <>
        <path d="M1 8.5C3 5 5.5 3 8.5 3s5.5 2 7.5 5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="2" y1="15" x2="15" y2="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
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
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("E-mail ou senha incorretos.");
          }
          throw error;
        }
        toast.success("Bem-vindo de volta!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro inesperado. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth" });

  const phoneMask = (val: string) => {
    let r = val.replace(/\D/g, "");
    if (r.length > 11) r = r.substring(0, 11);
    if (r.length > 2) r = r.replace(/^(\d{2})(\d)/g, "($1) $2");
    if (r.length > 7) r = r.replace(/(\d{5})(\d)/, "$1-$2");
    return r;
  };

  return (
    <div className="min-h-screen bg-[#060d18] text-white overflow-x-hidden selection:bg-emerald-500/30" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 30px rgba(16,185,129,0.15)} 50%{box-shadow:0 0 60px rgba(16,185,129,0.35)} }
        @keyframes neonPulse { 0%,100%{ opacity: 1; } 50%{ opacity: 0.7; } }

        .hero-h1 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; }
        .hero-sub { animation: fadeUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; }
        .login-card-anim { animation: scaleIn 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; }
        
        .glass-card { 
          background: rgba(13, 21, 37, 0.7); 
          backdrop-filter: blur(24px); 
          border: 1px solid rgba(16, 185, 129, 0.2);
          transition: all 0.3s ease;
        }
        
        .input-field {
          height: 52px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 0 16px;
          color: #fff;
          font-size: 16px;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
          outline: none;
        }

        .btn-primary {
          height: 54px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #060d18;
          font-weight: 800;
          font-size: 16px;
          border-radius: 14px;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-primary:active { transform: scale(0.98); }

        .pill-toggle {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 99px;
          padding: 4px;
          display: flex;
          position: relative;
        }
        .pill-toggle button {
          flex: 1;
          height: 38px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 700;
          z-index: 1;
          transition: color 0.3s;
        }
        .pill-slider {
          position: absolute;
          top: 4px;
          bottom: 4px;
          width: calc(50% - 4px);
          background: #10b981;
          border-radius: 99px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          background: rgba(16, 185, 129, 0.02);
          padding: 32px 0;
          border-top: 1px solid rgba(16, 185, 129, 0.05);
          border-bottom: 1px solid rgba(16, 185, 129, 0.05);
        }
        .marquee-content { display: inline-flex; animation: marquee 30s linear infinite; }
        .marquee-item { margin: 0 40px; font-weight: 900; color: rgba(255, 255, 255, 0.2); font-size: 18px; letter-spacing: 2px; text-transform: uppercase; }

        .industrial-card {
          border: 2px solid #10b981;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
          animation: glowPulse 4s infinite ease-in-out;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060d18; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 99px; }

        @media (max-width: 640px) {
          .mobile-px { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${scrolled ? 'bg-[#060d18]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <SunIcon />
          </div>
          <span className="text-xl font-black tracking-tighter">SOLAR <span className="text-emerald-500">SAAS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={scrollToPlans} className="text-sm font-bold text-white/50 hover:text-emerald-500 transition-colors">PLANOS</button>
          <button className="text-sm font-bold text-white/50 hover:text-emerald-500 transition-colors">SOLUÇÕES 10MW+</button>
          <button onClick={() => { setIsRegistering(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-500 text-sm font-black hover:bg-emerald-500 hover:text-[#060d18] transition-all">COMEÇAR AGORA</button>
        </div>
      </nav>

      {/* ── HERO & LOGIN CENTRALIZADO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-0">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,transparent_60%)] -z-10 pointer-events-none"></div>

        <div className="max-w-[900px] w-full text-center space-y-12">
          {/* Headline Centralizada */}
          <div className="space-y-6">
            <div className="hero-h1 inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <span className="text-xs font-black text-emerald-500 tracking-[2px] uppercase">Monitoramento de Missão Crítica</span>
            </div>
            
            <h1 className="hero-h1 text-5xl md:text-7xl font-[900] tracking-[-3px] leading-[0.95] text-white">
              A Plataforma Universal de <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse" style={{ textShadow: '0 0 40px rgba(16,185,129,0.3)' }}>Monitoramento Solar.</span>
            </h1>

            <p className="hero-sub text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
              Engenharia de precisão para quem gera de 5kW a 10MW. Maximize sua performance com o sistema mais robusto do mercado brasileiro.
            </p>
          </div>

          {/* LOGIN CARD CENTRALIZADO */}
          <div className="login-card-anim max-w-[460px] w-full mx-auto glass-card rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Pill Toggle Animado */}
            <div className="pill-toggle mb-10">
              <div className="pill-slider" style={{ transform: isRegistering ? 'translateX(100%)' : 'translateX(0)' }}></div>
              <button 
                className={!isRegistering ? 'text-[#060d18]' : 'text-white/40'} 
                onClick={() => setIsRegistering(false)}
              >
                ACESSAR PAINEL
              </button>
              <button 
                className={isRegistering ? 'text-[#060d18]' : 'text-white/40'} 
                onClick={() => setIsRegistering(true)}
              >
                CRIAR CONTA
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[2px] ml-1">Seu Nome</label>
                  <input className="input-field w-full" type="text" placeholder="Ex: João Silva" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}

              {isRegistering && (
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[2px] ml-1">WhatsApp</label>
                  <input className="input-field w-full" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={e => setPhone(phoneMask(e.target.value))} />
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[2px] ml-1">E-mail Corporativo</label>
                <input className="input-field w-full" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[2px] ml-1">Senha de Acesso</label>
                <div className="relative">
                  <input className="input-field w-full pr-12" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-emerald-500 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-4 flex items-center justify-center gap-3">
                {loading ? "PROCESSANDO..." : isRegistering ? "CRIAR CONTA AGORA →" : "ACESSAR SISTEMA →"}
              </button>

              <div className="pt-4 flex flex-col gap-3">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[1px] flex items-center justify-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Criptografia de Nível Militar
                </p>
                <button type="button" className="text-[11px] font-black text-emerald-500/50 hover:text-emerald-500 uppercase tracking-[1px] transition-colors">
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </div>

          <button onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})} className="hero-cta inline-flex flex-col items-center gap-2 text-white/20 hover:text-emerald-500 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[4px]">Role para explorar</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-bounce"><path d="m7 13 5 5 5-5M7 6l5 5 5-5"/></svg>
          </button>
        </div>
      </section>

      {/* ── LOGO MARQUEE (Esteira Infinita) ── */}
      <section className="marquee-container">
        <div className="marquee-content">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, idx) => (
            <div key={idx} className="marquee-item flex items-center gap-2">
              <span className="text-emerald-500">⚡</span> {logo}
            </div>
          ))}
        </div>
      </section>

      {/* ── PLANS SECTION (A Prova do Valor) ── */}
      <section ref={plansRef} className="py-32 px-6 bg-[#060d18] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Invista na sua <span className="text-emerald-500">Eficiência.</span></h2>
            <p className="text-white/40 text-lg font-medium">Planos escaláveis de residências a usinas de solo.</p>
            
            <div className="flex items-center justify-center gap-6 pt-10">
              <span className={`text-sm font-black tracking-widest ${!annual ? 'text-white' : 'text-white/20'}`}>MENSAL</span>
              <button onClick={() => setAnnual(!annual)} className="w-16 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-full relative transition-all">
                <div className={`absolute top-1 w-6 h-6 bg-emerald-500 rounded-full transition-all duration-300 ${annual ? 'left-9 shadow-[0_0_20px_#10b981]' : 'left-1'}`}></div>
              </button>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-black tracking-widest ${annual ? 'text-white' : 'text-white/20'}`}>ANUAL</span>
                <span className="bg-emerald-500 text-[#060d18] text-[10px] px-3 py-1 rounded-full font-black animate-pulse">20% OFF</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const price = annual ? plan.priceAnual : plan.price;
              return (
                <div 
                  key={plan.id} 
                  className={`relative p-10 rounded-[40px] flex flex-col transition-all duration-500 hover:translate-y-[-10px] ${
                    plan.industrial 
                    ? 'industrial-card bg-emerald-500/5' 
                    : 'glass-card hover:border-emerald-500/40'
                  }`}
                >
                  {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-[#060d18] px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px]">Mais Escolhido</span>}
                  
                  <div className="mb-10">
                    <h3 className="text-2xl font-black mb-3">{plan.name}</h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white/30">R$</span>
                      <span className="text-6xl font-black tracking-tighter">{price}</span>
                      <span className="text-sm font-bold text-white/30 uppercase tracking-[2px]">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-12 flex-grow">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <CheckIcon />
                        <span className="text-sm text-white/60 font-semibold">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => { setIsRegistering(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                    className={`w-full h-[60px] rounded-2xl font-black text-sm tracking-[2px] uppercase transition-all ${
                      plan.industrial 
                      ? 'bg-emerald-500 text-[#060d18] shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]' 
                      : 'bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-[#060d18]'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 px-6 border-t border-white/5 text-center space-y-8 bg-[#040a14]">
        <div className="flex items-center justify-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <SunIcon />
          </div>
          <span className="text-sm font-black tracking-tighter">SOLAR SAAS</span>
        </div>
        <div className="space-y-4">
          <p className="text-[11px] font-black text-white/20 uppercase tracking-[5px]">Engenharia de Monitoramento de Elite</p>
          <div className="flex justify-center gap-8 text-[10px] font-bold text-white/10 uppercase tracking-[2px]">
            <a href="#" className="hover:text-emerald-500 transition-colors">Termos</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
