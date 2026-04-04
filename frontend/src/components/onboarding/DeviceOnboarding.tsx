import React, { useState } from 'react';

/**
 * DeviceOnboarding Component
 * 
 * Flow:
 * 1. Introduction: "Vamos conectar seu sistema".
 * 2. Scan QR Code or Type S/N manually.
 * 3. Match S/N with manufacturer database.
 * 4. Proceed to WiFi Handshake.
 */

export const DeviceOnboarding: React.FC = () => {
    const [method, setMethod] = useState<'qr' | 'manual' | null>(null);
    const [serialNumber, setSerialNumber] = useState('');

    const handleScan = (data: string | null) => {
        if (data) {
            setSerialNumber(data);
            // Logic to validate S/N format for Growatt, Deye, etc.
            console.log(`QR Code Scanned: ${data}`);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (serialNumber.length < 8) {
            alert("O número de série parece curto demais. Verifique na etiqueta do seu datalogger.");
            return;
        }
        // Proceed to Step 2
        console.log(`Manual S/N: ${serialNumber}`);
    };

    return (
        <div className="onboarding-container p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Conectar Novo Equipamento</h2>
            <p className="text-gray-500 mb-6">
                Localize a etiqueta com o QR Code no seu datalogger (módulo Wi-Fi).
            </p>

            {!method ? (
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setMethod('qr')}
                        className="flex items-center justify-center p-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition"
                    >
                        📷 Ler QR Code da Etiqueta
                    </button>
                    <button
                        onClick={() => setMethod('manual')}
                        className="p-4 text-gray-600 font-medium hover:underline"
                    >
                        Digitar número de série manualmente
                    </button>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {method === 'qr' && (
                        <div className="qr-reader-placeholder aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-dashed border-2 border-gray-300">
                            <span className="text-gray-400">Scanner de QR Code Ativado...</span>
                            {/* Integration with react-qr-reader would go here */}
                        </div>
                    )}

                    {method === 'manual' && (
                        <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                            <label className="text-sm font-semibold text-gray-700">Número de Série (S/N)</label>
                            <input
                                type="text"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                                placeholder="Ex: GRW-XXXX-1234"
                                className="p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="p-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition"
                            >
                                Vincular Sistema
                            </button>
                        </form>
                    )}

                    <button
                        onClick={() => setMethod(null)}
                        className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition"
                    >
                        ← Voltar
                    </button>
                </div>
            )}
        </div>
    );
};
