import React from "react";
import "./EnergyFlow.css";

interface EnergyFlowProps {
    generation: number;
}

export default function EnergyFlow({ generation }: EnergyFlowProps) {
    const isActive = generation > 0;

    return (
        <div className="energy-flow-container">
            <div className="flow-grid">
                {/* SUN SECTION */}
                <div className="flow-node sky">
                    <div className="node-icon sun">☀️</div>
                    <span>Céu</span>
                </div>

                {/* PANELS SECTION */}
                <div className="flow-node panels">
                    <div className="node-icon">📡</div>
                    <span>Placas</span>
                </div>

                {/* INVERTER SECTION */}
                <div className="flow-node inverter active">
                    <div className="node-icon">📦</div>
                    <span>Inversor</span>
                </div>

                {/* CONSUMPTION SECTION */}
                <div className="flow-node house">
                    <div className="node-icon">🏠</div>
                    <span>Consumo</span>
                </div>

                {/* GRID SECTION */}
                <div className="flow-node grid-node">
                    <div className="node-icon">🔌</div>
                    <span>Rede</span>
                </div>

                {/* PATHS (SVG) */}
                <svg className="flow-svg" viewBox="0 0 400 200">
                    {/* Sun to Panels */}
                    <path d="M 50 40 L 120 40" className={`path-line ${isActive ? 'moving' : ''}`} />
                    {/* Panels to Inverter */}
                    <path d="M 180 40 L 230 100" className={`path-line ${isActive ? 'moving' : ''}`} strokeDasharray="5,5" />
                    {/* Inverter to House */}
                    <path d="M 270 100 L 320 100" className={`path-line ${isActive ? 'moving' : ''}`} />
                    {/* Inverter to Grid */}
                    <path d="M 250 140 L 250 180" className={`path-line ${isActive ? 'moving' : ''}`} strokeDasharray="5,5" />
                </svg>
            </div>
        </div>
    );
}
