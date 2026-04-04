import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

/**
 * GenerationChart Component
 * 
 * Shows the hourly generation curve and highlights peak performance.
 */

interface DataPoint {
    time: string;
    generation: number;
}

const mockData: DataPoint[] = [
    { time: '06:00', generation: 0.1 },
    { time: '07:00', generation: 0.5 },
    { time: '08:00', generation: 1.2 },
    { time: '09:00', generation: 2.5 },
    { time: '10:00', generation: 3.8 },
    { time: '11:00', generation: 4.5 },
    { time: '12:00', generation: 5.2 }, // Peak
    { time: '13:00', generation: 4.8 },
    { time: '14:00', generation: 4.0 },
    { time: '15:00', generation: 2.8 },
    { time: '16:00', generation: 1.5 },
    { time: '17:00', generation: 0.6 },
    { time: '18:00', generation: 0.1 },
];

export const GenerationChart: React.FC = () => {
    // Adding prediction data
    const chartData = mockData.map(d => ({
        ...d,
        prediction: d.generation * (0.85 + Math.random() * 0.3) // Simulated neural prediction
    }));

    return (
        <div className="glass p-6 rounded-[32px] w-full mb-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Fluxo de Energia Vital</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sincronização Neural Ativa</p>
                </div>
                <div className="px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black ring-1 ring-emerald-500/20 animate-pulse">
                    ● LIVE
                </div>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4b5563', fontSize: 10, fontWeight: '700' }}
                            interval={2}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4b5563', fontSize: 10, fontWeight: '700' }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(15, 23, 42, 0.9)',
                                borderRadius: '20px',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(10px)'
                            }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        {/* Real Generation */}
                        <Area
                            type="monotone"
                            dataKey="generation"
                            name="Geração Real"
                            stroke="#10b981"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorGen)"
                            animationDuration={2500}
                        />
                        {/* Neural Prediction */}
                        <Area
                            type="monotone"
                            dataKey="prediction"
                            name="Previsão I.A."
                            stroke="#34d399"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="transparent"
                            animationDuration={3000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors group">
                    <span className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.2em]">Pico Estimado</span>
                    <p className="text-3xl font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left">5.8 kW</p>
                    <div className="mt-2 text-[10px] text-emerald-500/40 flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Probabilidade 94%
                    </div>
                </div>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors group">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Ranking Regional</span>
                    <p className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">Top 5%</p>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Sua cidade</span>
                </div>
            </div>
        </div>
    );
};
