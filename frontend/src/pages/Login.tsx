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
    priceAnual: 39,
    desc: "Para quem está começando",
    color: "#10b981",
    features: ["1 inversor", "Monitoramento básico", "Alertas por e-mail", "App mobile"],
    cta: "Começar grátis",
  },
  {
    id: "residencial_full",
    name: "Residencial",
    price: 99,
    priceAnual: 79,
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
    priceAnual: 239,
    desc: "Para integradores e empresas",
    color: "#10b981",
    features: ["Inversores ilimitados", "Multi-clientes", "API de integração", "Relatório de carbono", "Gerente dedicado"],
    cta: "Falar com consultor",
  },
];

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const plansRef = useRef<HTMLElement>(null);
  const { signUpWithWhatsApp } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !phone || !email || !password) {
          throw new Error("Preencha todos os campos.");
        }
        await signUpWithWhatsApp(email, password, name, phone);
        // Após o cadastro, o store já atualiza o estado via onAuthStateChange
        // Mas se precisar de redirecionamento manual:
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
          }
          throw error;
        }
        toast.success("Bem-vindo de volta!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#050b14] text-white selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'bg-[#050b14]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <SunIcon />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">Solar <span className="text-emerald-500">SaaS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/60">
            <button onClick={scrollToPlans} className="hover:text-emerald-400 transition-colors">Planos</button>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Funcionalidades</a>
            <button 
              onClick={() => setIsRegistering(true)}
              className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section + Login Box */}
      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 blur-[120px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Líder em Monitoramento Solar
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              A usina na palma <br />
              da sua <span className="text-emerald-500">mão.</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Integração nativa com Growatt, Deye, Sungrow e mais de 50 marcas. 
              Diagnósticos reais e monitoramento 24/7 sem complicações.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050b14] bg-emerald-900 flex items-center justify-center text-[10px] font-bold">
                    User
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40 font-semibold">
                Junte-se a mais de <span className="text-white">12.000</span> integradores
              </p>
            </div>
          </div>

          {/* Login/Register Glass Card */}
          <div className="w-full max-w-[480px] mx-auto">
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-emerald-500 to-emerald-400 opacity-50"></div>
              
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">
                  {isRegistering ? 'Comece agora' : 'Bem-vindo de volta'}
                </h2>
                <p className="text-white/40 text-sm font-medium">
                  {isRegistering ? 'Crie sua conta em segundos' : 'Acesse seu painel de controle'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Nome Completo</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">WhatsApp</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider ml-1">Senha</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#050b14] font-black rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Processando...' : isRegistering ? 'CRIAR MINHA CONTA' : 'ACESSAR AGORA'}
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  )}
                </button>

                <button 
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="w-full py-4 text-white/40 hover:text-white text-xs font-bold transition-colors"
                >
                  {isRegistering ? 'JÁ POSSUO UMA CONTA' : 'AINDA NÃO TENHO CONTA'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Plans Section */}
      <section ref={plansRef} className="py-24 px-6 bg-[#080f1c] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black">Planos que cabem no seu <span className="text-emerald-500">bolso.</span></h2>
            <p className="text-white/40 font-medium">Selecione o melhor custo-benefício para sua operação.</p>
            
            {/* Toggle Anual/Mensal */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <span className={`text-sm font-bold ${!annual ? 'text-white' : 'text-white/30'}`}>Mensal</span>
              <button 
                onClick={() => setAnnual(!annual)}
                className="w-14 h-7 bg-white/10 rounded-full relative p-1 transition-all"
              >
                <div className={`w-5 h-5 bg-emerald-500 rounded-full transition-all duration-300 ${annual ? 'translate-x-7' : 'translate-x-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}></div>
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${annual ? 'text-white' : 'text-white/30'}`}>Anual</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-500/20">20% OFF</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map(plan => (
              <div 
                key={plan.id}
                className={`p-8 rounded-[32px] border transition-all duration-500 hover:translate-y-[-10px] flex flex-col ${plan.popular ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[0_20px_60px_rgba(16,185,129,0.1)] scale-105 z-10' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
              >
                {plan.popular && (
                  <div className="bg-emerald-500 text-[#050b14] text-[10px] font-black px-3 py-1 rounded-full w-fit mb-6 tracking-tighter uppercase">Mais Popular</div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/40 text-sm mb-6">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white/40">R$</span>
                    <span className="text-4xl font-black tracking-tighter">{annual ? plan.priceAnual : plan.price}</span>
                    <span className="text-sm font-bold text-white/40">/mês</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-0.5 bg-emerald-500/10 rounded-full">
                        <CheckIcon />
                      </div>
                      <span className="text-sm text-white/60 font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setIsRegistering(true)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-emerald-500 text-[#050b14] shadow-[0_10px_20px_rgba(16,185,129,0.2)]' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050b14]">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/20 text-xs font-bold uppercase tracking-[4px]">
          © 2026 Solar SaaS • Elevando o Padrão do Monitoramento Solar
        </div>
      </footer>
    </div>
  );
}
