import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Premium Login Page with Landing Page features.
 * 
 * Includes:
 * - High-impact Hero Header.
 * - Glassmorphism Login Card.
 * - Social Auth.
 * - Plans showcase below-the-fold.
 */

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-main overflow-x-hidden">
      {/* Navbar Section */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center text-2xl">☀️</div>
          <span className="text-2xl font-black text-white tracking-tighter">Solar<span className="text-primary">SaaS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Funcionalidades</a>
          <a href="#plans" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Planos</a>
          <button className="px-6 py-2 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/5 transition-all">Criar Conta</button>
        </div>
      </nav>

      {/* Hero Header + Login Card */}
      <main className="flex flex-col md:flex-row items-center justify-between px-12 pt-10 pb-32 gap-20 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] -z-10" />

        {/* Left: Value Prop */}
        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Universal & Inteligente</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.95]">
            Controle sua Geração, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Maximize seu Lucro.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
            A plataforma universal para monitoramento solar que transforma sol em economia real através de inteligência artificial e diagnósticos antecipados.
          </p>
          <div className="flex items-center gap-6 pt-4">
            <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:brightness-110 hover:-translate-y-1 transition-all active:scale-95">Começar Agora Grátis</button>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-bg-main bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                  {i === 4 ? '+5k' : '👤'}
                </div>
              ))}
              <span className="pl-6 text-sm text-gray-600 font-bold self-center">Usuários ativos hoje</span>
            </div>
          </div>
        </div>

        {/* Right: Glassmorphism Login Card */}
        <div className="w-full md:w-[420px] animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
          <div className="glass p-10 rounded-[40px] shadow-2xl border-white/5 relative group">
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[40px]" />

            <h2 className="text-2xl font-black text-white mb-8">Entrar no Painel</h2>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">E-mail</label>
                <input
                  type="email"
                  placeholder="exemplo@dominio.com"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between items-center py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary accent-primary" />
                  <span className="text-xs text-gray-500 font-bold">Lembrar acesso</span>
                </label>
                <a href="#" className="text-xs text-primary font-black uppercase tracking-widest hover:brightness-125">Esqueci a senha</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Entrar na Plataforma'}
              </button>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-white/5" />
                <span className="relative z-10 bg-[#0a0a10] px-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Ou acesse com</span>
              </div>

              <button type="button" className="w-full p-4 bg-white text-black font-black rounded-2xl hover:brightness-90 transition-all flex items-center justify-center gap-3">
                <span className="text-xl">G</span> Google
              </button>
            </form>

            <p className="text-center mt-10 text-sm text-gray-600 font-medium">
              Não tem uma conta? <a href="#" className="text-white hover:text-primary transition-colors font-bold">Solicite seu trial agora</a>
            </p>
          </div>
        </div>
      </main>

      {/* Plans Section - Integrated Below-the-fold */}
      <section id="plans" className="px-12 py-32 bg-black/30 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tight">Investimento em Inteligência</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Planos sob medida para residências e frotas de usinas solares.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Same premium cards as Billing.tsx could be reused here or simplified */}
            {[1, 2, 3].map(i => (
              <div key={i} className="glass p-10 rounded-[40px] border-white/5 hover:-translate-y-4 transition-all duration-500">
                <h3 className="text-2xl font-black text-white mb-2">{i === 1 ? 'Individual' : i === 2 ? 'Profissional' : 'SaaS White Label'}</h3>
                <p className="text-4xl font-black text-primary mb-8">R$ {i === 1 ? '29' : i === 2 ? '59' : '99'}<span className="text-sm opacity-40 font-bold">/mês</span></p>
                <ul className="space-y-4 mb-12">
                  <li className="text-gray-400 text-sm font-medium flex items-center gap-3"><span className="text-primary">✔</span> Recursos Vitalícios</li>
                  <li className="text-gray-400 text-sm font-medium flex items-center gap-3"><span className="text-primary">✔</span> Alertas em Tempo Real</li>
                  <li className="text-gray-400 text-sm font-medium flex items-center gap-3"><span className="text-primary">✔</span> Exportação de Dashboards</li>
                </ul>
                <button className="w-full p-5 border border-white/10 rounded-2xl text-white font-black hover:bg-white/5 transition-all">Ver Detalhes do Plano</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Logotypes */}
      <footer className="py-20 px-12 border-t border-white/5 flex flex-col items-center">
        <div className="flex flex-wrap justify-center items-center gap-20 opacity-20 hover:opacity-50 transition-opacity">
          <span className="text-2xl font-black text-white">GROWATT</span>
          <span className="text-2xl font-black text-white">DEYE</span>
          <span className="text-2xl font-black text-white">WEG</span>
          <span className="text-2xl font-black text-white">SUNGROW</span>
        </div>
        <p className="mt-12 text-xs text-gray-700 font-bold uppercase tracking-[0.5em]">SolarSaaS © 2026 • Tecnologia Brasileira para o Mundo</p>
      </footer>
    </div>
  );
};
