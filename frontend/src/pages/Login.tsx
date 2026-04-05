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
    id: "empresa_premium",
    name: "Empresa",
    price: 299,
    priceAnual: 249,
    desc: "Para integradores e empresas",
    color: "#a855f7",
    features: ["Inversores ilimitados", "Multi-clientes", "API de integração", "Relatório de carbono", "Gerente dedicado"],
    cta: "Falar com consultor",
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
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="4.5" fill="#10b981" />
    <line x1="11" y1="1" x2="11" y2="4" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="11" y1="18" x2="11" y2="21" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="1" y1="11" x2="4" y2="11" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="18" y1="11" x2="21" y2="11" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="3.5" y1="3.5" x2="5.9" y2="5.9" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="16.1" y1="16.1" x2="18.5" y2="18.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="18.5" y1="3.5" x2="16.1" y2="5.9" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="5.9" y1="16.1" x2="3.5" y2="18.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
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

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1L10.16 5.37L15 6L11.5 9.39L12.33 14.2L8 11.93L3.67 14.2L4.5 9.39L1 6L5.84 5.37L8 1Z" fill="#F59E0B" />
  </svg>
);

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val.toLocaleString("pt-BR")}{suffix}</span>;
}

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
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: "#060d18", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::placeholder { color: rgba(255,255,255,0.22) !important; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.06) inset !important; -webkit-text-fill-color: #fff !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #060d18; } ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 99px; }
        
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 30px rgba(16,185,129,0.2)} 50%{box-shadow:0 0 60px rgba(16,185,129,0.4)} }
        
        .hero-h1 { animation: fadeUp 0.7s ease both; }
        .hero-sub { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-bullets { animation: fadeUp 0.7s 0.3s ease both; }
        .hero-cta { animation: fadeUp 0.7s 0.45s ease both; }
        .login-card { animation: fadeUp 0.8s 0.1s ease both; }
        
        .plan-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .plan-card:hover { transform: translateY(-6px); }
        .input-field:focus { border-color: rgba(16,185,129,0.7) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12) !important; outline: none; }
        .btn-main:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .btn-main:active:not(:disabled) { transform: scale(0.98); }
        .hover-color:hover { color: #10b981 !important; }
        
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          border-top: 1px solid rgba(16,185,129,0.1);
          border-bottom: 1px solid rgba(16,185,129,0.1);
          background: rgba(16,185,129,0.03);
          padding: 24px 0;
          display: flex;
          position: relative;
        }
        .marquee-container::before, .marquee-container::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 150px; z-index: 2;
        }
        .marquee-container::before { left: 0; background: linear-gradient(to right, #060d18, transparent); }
        .marquee-container::after { right: 0; background: linear-gradient(to left, #060d18, transparent); }
        .marquee-content {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
        .marquee-item {
          display: inline-flex; alignItems: center; gap: 8px;
          margin: 0 40px; font-weight: 800; font-size: 18px; color: rgba(255,255,255,0.4);
          letter-spacing: 1px; text-transform: uppercase;
        }
        
        .grid-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 60px;
        }
        @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
            .hero-bullets { align-items: center; }
            .hero-cta { justify-content: center; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(6,13,24,0.96)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SunIcon />
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.5px" }}>Solar <span style={{ color: "#10b981" }}>SaaS</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span className="hover-color" style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "0.2s" }} onClick={scrollToPlans}>Planos</span>
          <span className="hover-color" style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "0.2s" }}>Integrações</span>
          <button onClick={() => setIsRegistering(true)} style={{ padding: "10px 24px", background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.6)", borderRadius: 12, color: "#10b981", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "0.2s" }}>Começar Grátis</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 40px 60px", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 65%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 440px", gap: 64, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div className="hero-h1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 99, padding: "6px 16px", marginBottom: 28, boxShadow: "0 0 20px rgba(16,185,129,0.2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulseDot 1.8s ease-in-out infinite" }} />
              <span style={{ fontSize: 13, color: "#10b981", fontWeight: 700 }}>+12.000 Clientes Ativos • 4.2 GWp monitorados</span>
            </div>

            <h1 className="hero-h1" style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: 22 }}>
              A plataforma universal para <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)" }}>Energia Solar.</span>
            </h1>

            <p className="hero-sub" style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 500, marginBottom: 36, fontWeight: 500 }}>
              Gerencie todas as marcas de inversores em um só lugar. Obtenha diagnósticos instantâneos e relatórios reais com 1 clique.
            </p>

            <div className="hero-bullets" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
              {["Universal: Growatt, Deye, WEG e mais", "Relatórios Financeiros e de Carbono", "Onboarding Rápido e Descomplicado"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckIcon />
                  <span style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Auth Card */}
          <div className="login-card" style={{ background: "rgba(6,13,24,0.6)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 28, padding: "40px", backdropFilter: "blur(24px)", animation: "glowPulse 4s ease-in-out infinite", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", transition: "all 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 10px 25px -5px rgba(16,185,129,0.5)" }}>
                <SunIcon />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>{isRegistering ? "Criar Conta" : "Área do Cliente"}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{isRegistering ? "Sua usina conectada em 2 minutos." : "Acesse sua usina virtual"}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Seu Nome</label>
                    <input className="input-field" type="text" placeholder="João Silva" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 15, fontFamily: "inherit", transition: "all 0.2s" }} />
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, textTransform: "uppercase" }}>WhatsApp / Celular</label>
                    <input className="input-field" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={e => setPhone(phoneMask(e.target.value))} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 15, fontFamily: "inherit", transition: "all 0.2s" }} />
                  </div>
                </>
              )}

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, textTransform: "uppercase" }}>E-mail de Acesso</label>
                <input className="input-field" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 15, fontFamily: "inherit", transition: "all 0.2s" }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8, textTransform: "uppercase" }}>Sua Senha</label>
                <div style={{ position: "relative" }}>
                  <input className="input-field" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "14px 46px 14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#fff", fontSize: 15, fontFamily: "inherit", transition: "all 0.2s" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-main" style={{ width: "100%", padding: "16px", background: loading ? "rgba(16,185,129,0.5)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", marginBottom: 24, boxShadow: "0 10px 20px -10px rgba(16,185,129,0.5)" }}>
                {loading ? "Aguarde..." : isRegistering ? "Criar Conta Agora →" : "Acessar Painel →"}
              </button>

              <button type="button" onClick={() => setIsRegistering(!isRegistering)} style={{ width: "100%", padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {isRegistering ? "Já tem conta? Faça Login" : "Não tem conta? Cadastre-se"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ── */}
      <section className="marquee-container">
        <div className="marquee-content">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, idx) => (
            <div key={idx} className="marquee-item">📍 {logo}</div>
          ))}
        </div>
      </section>

      {/* ── PLANS SECTION ── */}
      <section ref={plansRef} id="planos" style={{ padding: "100px 40px", background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(16,185,129,0.03) 0%, transparent 70%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ display: "inline-block", fontSize: 13, fontWeight: 800, color: "#10b981", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Preços Transparentes</span>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 16 }}>Escolha o plano ideal</h2>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "8px 8px 8px 24px", marginTop: 24 }}>
              <span style={{ fontSize: 15, color: annual ? "rgba(255,255,255,0.4)" : "#fff", fontWeight: 700 }}>Mensal</span>
              <button onClick={() => setAnnual(!annual)} style={{ width: 52, height: 28, borderRadius: 99, border: "none", cursor: "pointer", background: annual ? "#10b981" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.25s" }}>
                <span style={{ position: "absolute", top: 3, left: annual ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.25s", display: "block" }} />
              </button>
              <span style={{ fontSize: 15, color: annual ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 700 }}>Anual</span>
              {annual && <span style={{ fontSize: 12, fontWeight: 800, color: "#060d18", background: "#10b981", borderRadius: 99, padding: "4px 12px", marginLeft: 4, letterSpacing: "0.5px" }}>ECONOMIZE 20%</span>}
            </div>
          </div>

          <div className="grid-responsive">
            {PLANS.map((plan) => {
              const price = annual ? plan.priceAnual : plan.price;
              return (
                <div key={plan.id} className="plan-card" style={{ background: plan.popular ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)", border: plan.popular ? "2px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "40px 32px", position: "relative" }}>
                  {plan.popular && <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#10b981", color: "#060d18", padding: "4px 16px", borderRadius: 99, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>Mais Escolhido</span>}
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{plan.name}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>{plan.desc}</p>
                  <div style={{ marginBottom: 32 }}>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>R$ </span>
                    <span style={{ fontSize: 42, fontWeight: 900 }}>{price}</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>/mês</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckIcon />
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setIsRegistering(true)} className="btn-main" style={{ width: "100%", padding: "14px", background: plan.popular ? "#10b981" : "rgba(255,255,255,0.05)", border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: plan.popular ? "#060d18" : "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "0.2s" }}>{plan.cta}</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "100px 40px", background: "#060d18" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900 }}>O que dizem nossos clientes</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: 32, borderRadius: 24 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(t.stars)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 24 }}>"{t.content}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.avatar}</div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</h4>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: "60px 40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "1px" }}>© 2026 SOLAR SAAS • TODOS OS DIREITOS RESERVADOS</p>
      </footer>
    </div>
  );
}
