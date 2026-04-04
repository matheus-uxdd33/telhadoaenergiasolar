import React from 'react';

/**
 * EconomyCard Component
 * 
 * Performance indicators for kWh generated and currency savings.
 */

interface EconomyProps {
    kwhDay: number;
    kwhMonth: number;
    tariff: number; // R$ per kWh
}

export const EconomyCard: React.FC<EconomyProps> = ({ kwhDay, kwhMonth, tariff }) => {
    const savingsDay = (kwhDay * tariff).toFixed(2);
    const ROI_Acumulado = 12450.75; // Simulated ROI

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Total ROI Card (The Luxury Focus) */}
            <div className="relative overflow-hidden glass p-8 rounded-[32px] shadow-2xl group active:scale-[0.98] transition-all cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all" />

                <h4 className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Retorno de Investimento (ROI)</h4>
                <div className="flex items-baseline gap-2 text-white">
                    <span className="text-xl font-medium opacity-50">R$</span>
                    <span className="text-5xl font-black tracking-tight">{ROI_Acumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                                {i === 1 ? '☀️' : i === 2 ? '🔋' : '💎'}
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Ativo Rentável</span>
                </div>
            </div>

            {/* Sustainable Impact Card */}
            <div className="relative overflow-hidden glass p-8 rounded-[32px] border-white/5 group">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />

                <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Impacto Hoje</h4>
                <div className="flex items-baseline gap-2 text-white/90">
                    <span className="text-xl font-medium opacity-50">R$</span>
                    <span className="text-5xl font-black tracking-tight">{savingsDay}</span>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Árvores Salvas</p>
                        <p className="text-2xl font-black text-emerald-500 tracking-tighter">14 Unidades</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)] group-hover:rotate-12 transition-transform">
                        <span className="text-2xl">🌱</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
