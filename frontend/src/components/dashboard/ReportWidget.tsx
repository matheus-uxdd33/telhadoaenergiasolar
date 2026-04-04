import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * ReportWidget Component
 * 
 * Deep analytics for the energy asset.
 * Includes Monthly Comparison, Environmental Impact and Health Check.
 */

const monthlyData = [
    { month: 'Jan', generation: 450 },
    { month: 'Fev', generation: 520 },
    { month: 'Mar', generation: 480 },
    { month: 'Abr', generation: 610 },
    { month: 'Mai', generation: 590 },
    { month: 'Jun', generation: 650 }, // Current
];

export const ReportWidget: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Actions */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white">Relatórios Inteligentes</h2>
                    <p className="text-gray-500 font-medium">Análise de performance e impacto ambiental</p>
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                    <span>📄</span> Exportar PDF Executivo
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Comparison Chart */}
                <div className="lg:col-span-2 glass p-8 rounded-[40px] border-white/5">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">Geração Mensal (kWh)</h4>
                        <select className="bg-transparent text-[10px] font-black text-gray-500 uppercase outline-none cursor-pointer hover:text-white transition-colors">
                            <option>Últimos 6 meses</option>
                            <option>Ano atual</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#4b5563', fontSize: 11, fontWeight: '700' }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                                />
                                <Bar dataKey="generation" radius={[10, 10, 10, 10]} barSize={40}>
                                    {monthlyData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === monthlyData.length - 1 ? '#10b981' : 'rgba(16, 185, 129, 0.15)'}
                                            className="hover:fill-primary transition-all duration-300"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Environmental Impact (Shareable Card) */}
                <div className="glass p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col justify-between relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <span className="text-8xl">🌿</span>
                    </div>

                    <div>
                        <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Impacto Ambiental</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-4xl font-black text-white tracking-tighter">124 kg</p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">CO2 Evitado este mês</p>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-4xl font-black text-white tracking-tighter">8.4</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Árvores salvas</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white tracking-tighter">620</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">km Rodados (E-Car)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-10 p-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span>🤳</span> Compartilhar Conquista
                    </button>
                </div>
            </div>

            {/* Loss Diagnosis & Health Check */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-[40px] border-white/5">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Diagnóstico de Perdas</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                            <span className="text-sm font-bold text-gray-300">Sujeira nos Painéis</span>
                            <span className="text-sm font-black text-orange-400">- 2.4%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                            <span className="text-sm font-bold text-gray-300">Performance Inversor</span>
                            <span className="text-sm font-black text-emerald-500">Normal (98%)</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                            <span className="text-sm font-bold text-gray-300">Queda de Tensão (Rede)</span>
                            <span className="text-sm font-black text-white">Nenhuma detectada</span>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
                        *Análise baseada em algoritmos neurais que comparam sua geração com o clima local em tempo real.
                    </p>
                </div>

                <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl animate-bounce text-emerald-500">🏆</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Performance de Elite</h3>
                    <p className="text-sm text-gray-400 max-w-[240px]">Seu sistema gerou 12% mais energia que a média da região este mês.</p>
                    <div className="mt-6 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-black tracking-widest border border-emerald-500/20">
                        RANKING #1 DA RUA
                    </div>
                </div>
            </div>
        </div>
    );
};
