import React from 'react';

/**
 * EnergyFlow Component
 * 
 * A high-tech visual representation of the energy ecosystem.
 * Features:
 * - Pulsing energy lines (SVG)
 * - Glassmorphism cards for Sky, Panels, Inverter, and Home
 * - Real-time "flow" animation
 */

export const EnergyFlow: React.FC<{ generation?: number }> = ({ generation }) => {
    return (
        <div className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden h-full flex flex-col justify-between">
            <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-8">Fluxo Neural de Energia</h4>

            <div className="flex-1 relative flex items-center justify-center py-10">
                {/* SVG Connections (Neural Lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Path: Panels -> Inverter */}
                    <path
                        d="M 100,100 L 200,150"
                        stroke="#10b981"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="animate-pulse opacity-40"
                    />
                    <circle r="3" fill="#34d399">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 100,100 L 200,150" />
                    </circle>

                    {/* Path: Inverter -> Home */}
                    <path
                        d="M 200,150 L 300,100"
                        stroke="#10b981"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="animate-pulse opacity-40"
                    />
                    <circle r="3" fill="#34d399">
                        <animateMotion dur="1.5s" repeatCount="indefinite" path="M 200,150 L 300,100" />
                    </circle>

                    {/* Path: Sky -> Panels */}
                    <path
                        d="M 100,20 L 100,100"
                        stroke="#34d399"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        className="opacity-30"
                    />
                </svg>

                {/* Nodes */}
                <div className="absolute top-[10px] left-[80px] flex flex-col items-center">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-xl animate-pulse">☀️</div>
                    <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Fonte</span>
                </div>

                <div className="absolute top-[90px] left-[80px] w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl shadow-xl ring-1 ring-white/10">⬛</div>
                <span className="absolute top-[145px] left-[80px] text-[10px] text-white font-black uppercase">Placas</span>

                <div className="absolute top-[140px] left-[180px] w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-2 ring-primary/50 group">
                    <span className="group-hover:rotate-12 transition-transform">📟</span>
                </div>
                <span className="absolute top-[205px] left-[175px] text-[10px] text-primary font-black uppercase">Inversor</span>

                <div className="absolute top-[90px] left-[280px] w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl shadow-xl ring-1 ring-white/10">🏠</div>
                <span className="absolute top-[145px] left-[285px] text-[10px] text-white font-black uppercase">Carga</span>
            </div>

            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Geração</p>
                    <p className="text-xl font-black text-emerald-500 tracking-tight">4.8 kW</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Consumo</p>
                    <p className="text-xl font-black text-white tracking-tight">1.2 kW</p>
                </div>
            </div>
        </div>
    );
};
