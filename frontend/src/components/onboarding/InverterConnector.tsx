import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

const InverterConnector = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'searching' | 'connected' | 'error'>('idle');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const onScanSuccess = (decodedText: string) => {
    setSerialNumber(decodedText);
    setIsScanning(false);
    toast.success('S/N capturado com sucesso!');
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  const onScanFailure = (error: any) => {
    // Silently ignore scan failures (they happen every frame)
  };

  const handleLocalHandshake = async () => {
    setIsConnecting(true);
    setConnectionStatus('searching');
    
    // IP padrão do data logger (AP Mode)
    const LOGGER_IP = '10.10.100.254';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      toast.loading('Tentando handshake com o inversor...', { id: 'handshake' });
      
      // Tentativa de conexão real com o IP do Data Logger
      // Geralmente os loggers usam porta 80 ou portas específicas de fabricante
      const response = await fetch(`http://${LOGGER_IP}/status`, {
        method: 'GET',
        mode: 'no-cors', // Importante para cross-origin em AP Mode
        signal: controller.signal
      });

      // Como usamos 'no-cors', não teremos acesso ao body, 
      // mas se a promise resolve, a rede está acessível.
      setConnectionStatus('connected');
      toast.success('Inversor detectado na rede local!', { id: 'handshake' });
    } catch (error: any) {
      console.error('Handshake failed:', error);
      setConnectionStatus('error');
      if (error.name === 'AbortError') {
        toast.error('Timeout: Verifique se você está conectado ao Wi-Fi do Inversor.', { id: 'handshake' });
      } else {
        toast.error('Falha na conexão local. Verifique o sinal Wi-Fi.', { id: 'handshake' });
      }
    } finally {
      setIsConnecting(false);
      clearTimeout(timeoutId);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#0a1428] border border-emerald-500/20 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Conectar Inversor</h2>
        <p className="text-emerald-500/60 text-sm">Escaneie o QR Code ou conecte via Wi-Fi Local</p>
      </div>

      {/* QR Code Scanner Section */}
      <div className="mb-8">
        {!isScanning ? (
          <button
            onClick={() => setIsScanning(true)}
            className="w-full py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
            Escanear QR Code (S/N)
          </button>
        ) : (
          <div className="relative">
            <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-emerald-500/50"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Manual Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-emerald-500/50 uppercase tracking-wider mb-2">Número de Série (S/N)</label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Ex: 1234567890"
            className="w-full px-4 py-3 bg-white/5 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Local Handshake Section */}
        <div className="pt-4 border-t border-emerald-500/10">
          <p className="text-xs text-white/40 mb-4 text-center">
            Certifique-se de estar conectado ao Wi-Fi gerado pelo inversor (ex: <strong>Datalogger_XXXX</strong>)
          </p>
          <button
            onClick={handleLocalHandshake}
            disabled={isConnecting}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
              connectionStatus === 'connected' 
              ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
              : 'bg-white/5 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
            }`}
          >
            {isConnecting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
            ) : connectionStatus === 'connected' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Conectado com Sucesso!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
                Realizar Handshake Local
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InverterConnector;
