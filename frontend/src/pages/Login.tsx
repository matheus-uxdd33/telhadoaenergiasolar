import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

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

const PAYPAL_EMAIL = "matheeus16k@gmail.com";

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

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M7.5 1L2 7.5h4.5L5 12l6.5-6.5H7L7.5 1z" fill="#fff" />
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

// PayPal payment link generator
function buildPayPalLink(planName: string, price: number, email: string): string {
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: email,
    item_name: `Solar SaaS - Plano ${planName}`,
    amount: price.toFixed(2),
    currency_code: "BRL",
    no_shipping: "1",
    return: window.location.origin + "/dashboard",
    cancel_return: window.location.origin + "/billing",
  });
  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [payModal, setPayModal] = useState<{ plan: typeof PLANS[0]; price: number } | null>(null);
  const plansRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const login = useAuthStore((s: any) => s.login);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "E-mail obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha obrigatória";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setErrors({ password: "E-mail ou senha incorretos." });
    } finally {
      setLoading(false);
    }
  };

  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#060d18", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::placeholder { color: rgba(255,255,255,0.22) !important; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.06) inset !important; -webkit-text-fill-color: #fff !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #060d18; } ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 99px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,0.15)} 50%{box-shadow:0 0 40px rgba(16,185,129,0.35)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.94) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .hero-h1 { animation: fadeUp 0.7s ease both; }
        .hero-sub { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-bullets { animation: fadeUp 0.7s 0.3s ease both; }
        .hero-cta { animation: fadeUp 0.7s 0.45s ease both; }
        .hero-proof { animation: fadeUp 0.7s 0.6s ease both; }
        .login-card { animation: fadeUp 0.8s 0.1s ease both; }
        .plan-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .plan-card:hover { transform: translateY(-6px); }
        .input-field:focus { border-color: rgba(16,185,129,0.7) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.12) !important; outline: none; }
        .btn-main:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .btn-main:active:not(:disabled) { transform: scale(0.98); }
        .nav-link { color: rgba(255,255,255,0.55); font-size: 14px; text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #fff; }
        .scroll-cta:hover { background: rgba(255,255,255,0.08) !important; }
        .pay-modal { animation: modalIn 0.3s ease both; }
      `}</style>

      {/* ── PAYMENT MODAL ── */}
      {payModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16, backdropFilter: "blur(10px)",
        }}
          onClick={() => setPayModal(null)}
        >
          <div
            className="pay-modal"
            style={{
              width: "100%", maxWidth: 420,
              background: "#0d1525", border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 24, padding: 32, position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPayModal(null)}
              style={{
                position: "absolute", top: 14, right: 14,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                width: 32, height: 32, borderRadius: 8, color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                Assinar Plano {payModal.plan.name}
              </h3>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>
                R$ {payModal.price}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>/mês</span>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* PayPal Button */}
              <a
                href={buildPayPalLink(payModal.plan.name, payModal.price, PAYPAL_EMAIL)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "15px", borderRadius: 12, textDecoration: "none",
                  background: "#003087", color: "#fff",
                  fontSize: 15, fontWeight: 700,
                  border: "none", cursor: "pointer",
                  transition: "filter 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7.5 3h9c1.5 0 2.5.5 3 1.5.5.9.3 2.3-.3 3.5C18.5 9.5 17 10 15 10h-2l-1 6H9l-.5-3H7l.5-4zM9 10l.5 3H12l.5-3z" fill="#009cde" />
                  <path d="M5 8.5h8c1.5 0 2.5.5 3 1.5.5.9.3 2.3-.3 3.5C15 14.5 13 15 11 15H9l-1 6H5l1-12.5z" fill="#012169" />
                </svg>
                Pagar com PayPal
              </a>

              {/* PagBank PIX Button */}
              <button
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "15px", borderRadius: 12,
                  background: "rgba(16,185,129,0.12)", border: "1.5px solid rgba(16,185,129,0.4)",
                  color: "#10b981", fontSize: 15, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
                onClick={async () => {
                  setPayModal(null);
                  try {
                    const res = await fetch("/api/billing/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ planCode: payModal.plan.id, paymentMethod: "pix" }),
                    });
                    const data = await res.json();
                    if (data.pixCode) {
                      navigator.clipboard.writeText(data.pixCode).catch(() => { });
                      alert(`✅ PIX gerado!\n\nCopie o código abaixo:\n\n${data.pixCode}\n\nApós o pagamento, seu plano será ativado automaticamente.`);
                    }
                  } catch {
                    alert("Erro ao gerar PIX. Tente novamente.");
                  }
                }}
              >
                ⚡ Pagar com PIX (PagBank)
              </button>

              {/* WhatsApp alternative */}
              <a
                href={`https://wa.me/5511999999999?text=Quero%20assinar%20o%20plano%20${encodeURIComponent(payModal.plan.name)}%20de%20R$${payModal.price}%2Fmês`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "13px", borderRadius: 12, textDecoration: "none",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600,
                }}
              >
                💬 Falar no WhatsApp
              </a>
            </div>

            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 20 }}>
              🔒 Transação segura • Cancele quando quiser
            </p>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(6,13,24,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.35s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SunIcon />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>Solar <span style={{ color: "#10b981" }}>SaaS</span></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span className="nav-link" onClick={scrollToPlans}>Planos</span>
          <span className="nav-link">Suporte</span>
          <span className="nav-link">Sobre</span>
        </div>

        <button onClick={scrollToPlans} style={{
          padding: "9px 20px", background: "transparent",
          border: "1.5px solid rgba(16,185,129,0.6)", borderRadius: 10,
          color: "#10b981", fontSize: 13, fontWeight: 600, cursor: "pointer",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          Ver planos
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "100px 40px 60px",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 80% 50%, rgba(16,185,129,0.04) 0%, transparent 60%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center", position: "relative", zIndex: 1 }}>

          {/* LEFT */}
          <div>
            <div className="hero-h1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 99, padding: "6px 14px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, color: "rgba(16,185,129,0.9)", fontWeight: 600 }}>Monitoramento em tempo real — 2.400+ MWp online</span>
            </div>

            <h1 className="hero-h1" style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 22 }}>
              Controle sua<br />
              <span style={{ color: "#10b981" }}>geração.</span><br />
              Maximize seu<br />
              <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", background: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.6) 100%)", display: "inline-block" }}>lucro.</span>
            </h1>

            <p className="hero-sub" style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 440, marginBottom: 32 }}>
              A plataforma universal para monitoramento solar. Compatível com <span style={{ color: "rgba(255,255,255,0.85)" }}>Growatt, Deye, Sungrow e WEG</span>.
            </p>

            <div className="hero-bullets" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {[
                "Alertas inteligentes de falha e perda de geração",
                "Relatórios de economia e ROI em PDF com 1 clique",
                "Instalação completa em menos de 5 minutos",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckIcon />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{t}</span>
                </div>
              ))}
            </div>

            <div className="hero-cta">
              <button onClick={scrollToPlans} className="scroll-cta" style={{
                padding: "14px 28px", background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12,
                color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s",
              }}>
                Ver planos e preços
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <div className="hero-proof" style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { val: "2400", suffix: "+ MWp", label: "monitorados" },
                { val: "98", suffix: "%", label: "uptime garantido" },
                { val: "4.8", suffix: "★", label: "avaliação" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>{s.val}{s.suffix}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Login Card */}
          <div className="login-card" style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 24, padding: "36px 32px",
            backdropFilter: "blur(24px) saturate(160%)",
            animation: "glowPulse 4s ease-in-out infinite",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <SunIcon />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Bem-vindo de volta</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>Acesso exclusivo para clientes e parceiros</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>E-mail</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: "" })); }}
                  style={{
                    width: "100%", padding: "13px 16px",
                    background: "rgba(255,255,255,0.06)", border: errors.email ? "1.5px solid #E24B4A" : "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, color: "#fff", fontSize: 14, fontFamily: "inherit",
                    transition: "border 0.2s, box-shadow 0.2s",
                  }}
                />
                {errors.email && <p style={{ fontSize: 11, color: "#E24B4A", marginTop: 5 }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input-field"
                    type={showPass ? "text" : "password"}
                    placeholder="Sua senha de acesso"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: "" })); }}
                    style={{
                      width: "100%", padding: "13px 46px 13px 16px",
                      background: "rgba(255,255,255,0.06)", border: errors.password ? "1.5px solid #E24B4A" : "1.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 12, color: "#fff", fontSize: 14, fontFamily: "inherit",
                      transition: "border 0.2s, box-shadow 0.2s",
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 11, color: "#E24B4A", marginTop: 5 }}>{errors.password}</p>}
              </div>

              <div style={{ textAlign: "right", marginBottom: 22 }}>
                <span style={{ fontSize: 12, color: "#10b981", cursor: "pointer", fontWeight: 500 }}>Esqueci minha senha</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-main"
                style={{
                  width: "100%", padding: "15px",
                  background: loading ? "rgba(16,185,129,0.5)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none", borderRadius: 13,
                  color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s", marginBottom: 20, fontFamily: "inherit",
                }}
              >
                {loading ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                    <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                ) : <BoltIcon />}
                {loading ? "Entrando..." : "Entrar no Painel"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>NÃO TEM CONTA?</span>
                <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
              </div>

              <button
                type="button"
                onClick={scrollToPlans}
                style={{
                  width: "100%", padding: "13px",
                  background: "transparent", border: "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 13, color: "rgba(255,255,255,0.7)", fontSize: 14,
                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"; e.currentTarget.style.color = "#10b981"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              >
                Criar conta grátis →
              </button>
            </form>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {["🔒 SSL Seguro", "✓ Criptografado", "💳 PayPal • PIX"].map((t, i) => (
                <span key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.12)", borderBottom: "1px solid rgba(16,185,129,0.12)", padding: "24px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {[
            { end: 2400, suffix: "+ MWp", label: "monitorados em tempo real" },
            { end: 1850, suffix: "+", label: "clientes ativos" },
            { end: 98, suffix: "%", label: "uptime médio garantido" },
            { end: 47, suffix: "M+", label: "em economia gerada (R$)" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#10b981" }}>
                <CountUp end={s.end} />{s.suffix}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLANS ── */}
      <section ref={plansRef} id="planos" style={{ padding: "100px 40px", background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(16,185,129,0.05) 0%, transparent 70%)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "#10b981", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Planos de Investimento</span>
            <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
              Escolha seu plano.<br /><span style={{ color: "#10b981" }}>Comece a economizar.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto 32px" }}>
              Sem contratos longos. Cancele quando quiser. Aceita PayPal, PIX e Cartão de Crédito.
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "6px 6px 6px 16px" }}>
              <span style={{ fontSize: 13, color: annual ? "rgba(255,255,255,0.4)" : "#fff", fontWeight: 600 }}>Mensal</span>
              <button
                onClick={() => setAnnual(v => !v)}
                style={{ width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer", background: annual ? "#10b981" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.25s" }}
              >
                <span style={{ position: "absolute", top: 3, left: annual ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s", display: "block" }} />
              </button>
              <span style={{ fontSize: 13, color: annual ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>Anual</span>
              {annual && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#060d18", background: "#10b981", borderRadius: 99, padding: "3px 10px" }}>2 meses grátis</span>
              )}
            </div>

            {/* Payment methods */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
              {[
                { icon: "💳", label: "PayPal" },
                { icon: "⚡", label: "PIX" },
                { icon: "💬", label: "WhatsApp" },
              ].map((m, i) => (
                <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 99, padding: "4px 14px", fontWeight: 500 }}>
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PLANS.map((plan) => {
              const price = annual ? plan.priceAnual : plan.price;
              return (
                <div
                  key={plan.id}
                  className="plan-card"
                  style={{
                    background: plan.popular ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.03)",
                    border: plan.popular ? "2px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20, padding: "32px 28px", position: "relative",
                    boxShadow: plan.popular ? "0 0 40px rgba(16,185,129,0.12)" : "none",
                  }}
                >
                  {plan.popular && (
                    <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: 99, padding: "5px 16px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                      ⚡ Mais Popular
                    </div>
                  )}

                  <div style={{ fontSize: 13, fontWeight: 600, color: plan.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>{plan.desc}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>R$</span>
                    <span style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>{price}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>/mês</span>
                  </div>
                  {annual && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
                      <s style={{ color: "rgba(255,255,255,0.2)" }}>R${plan.price}/mês</s>
                      <span style={{ color: "#10b981", marginLeft: 6, fontWeight: 600 }}>economize R${(plan.price - plan.priceAnual) * 12}/ano</span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "rgba(16,185,129,0.7)", marginBottom: 20, fontWeight: 500 }}>
                    Se paga em ~{Math.round(price / 22)} dias de sol ☀️
                  </div>

                  <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckIcon color={plan.color} />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    style={{
                      width: "100%", padding: "14px",
                      background: plan.popular ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.07)",
                      border: plan.popular ? "none" : `1.5px solid ${plan.color}40`,
                      borderRadius: 12, color: plan.popular ? "#fff" : plan.color,
                      fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    }}
                    onClick={() => {
                      if (plan.id === "empresa_premium") {
                        window.open(`https://wa.me/5511999999999?text=Interesse+no+plano+Empresa`, "_blank");
                      } else {
                        setPayModal({ plan, price });
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
              Todos os planos incluem 7 dias de teste gratuito. Aceita PayPal, PIX e Cartão.
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
              {["Growatt", "Deye", "Sungrow", "WEG", "Fronius", "SolarEdge"].map((b, i) => (
                <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: "0.05em" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SunIcon />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Solar SaaS © {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidade", "Termos de Uso", "Suporte", "Status"].map((l, i) => (
              <span key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", cursor: "pointer", fontWeight: 500 }}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["🔒 SSL", "💳 PayPal", "⚡ PIX", "★ 4.8"].map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 10px" }}>{s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
