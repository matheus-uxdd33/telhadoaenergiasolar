import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

const InverterScanner = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isScanning && isMobile && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current.render(
        (decodedText) => {
          setSerialNumber(decodedText);
          setIsScanning(false);
          toast.success("S/N Capturado!");
          scannerRef.current?.clear();
          scannerRef.current = null;
        },
        () => {}
      );
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isScanning, isMobile]);

  const handleHandshake = async () => {
    if (!serialNumber) {
      toast.error("Insira o Número de Série.");
      return;
    }
    setIsValidating(true);
    try {
      // POST para validar as credenciais do portal do fabricante
      const response = await fetch('/api/system/validate-handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial_number: serialNumber })
      });
      
      if (response.ok) {
        toast.success("Handshake realizado com sucesso!");
      } else {
        throw new Error("Falha na validação do fabricante.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro no handshake.");
    } finally {
      setIsValidating(false);
    }
  };

  const snMask = (val: string) => {
    return val.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 16);
  };

  return (
    <div className="max-w-[440px] mx-auto p-8 glass-card rounded-[32px] space-y-8 industrial-neon">
      <style>{`
        .glass-card { background: rgba(13, 21, 37, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(16, 185, 129, 0.2); }
        .industrial-neon { border: 2px solid #10b981 !important; box-shadow: 0 0 40px rgba(16, 185, 129, 0.2) !important; }
        .input-dark { background: rgba(5, 11, 20, 0.8) !important; border: 1px solid rgba(255,255,255,0.05) !important; transition: all 0.2s; color: white; }
        .input-dark:focus { border-color: #10b981 !important; outline: none; }
        .btn-neon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #050b14; font-weight: 800; transition: all 0.2s; }
        .btn-neon:hover { transform: scale(1.02); filter: brightness(1.1); box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
      `}</style>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight uppercase">Sincronizar Inversor</h2>
        <p className="text-sm text-white/40 font-medium">Engenharia de Conectividade IoT</p>
      </div>

      {isMobile ? (
        <div className="space-y-6">
          {!isScanning ? (
            <button 
              onClick={() => setIsScanning(true)}
              className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-[#050b14] transition-all"
            >
              Abrir Câmera (QR Code)
            </button>
          ) : (
            <div id="qr-reader" className="rounded-2xl overflow-hidden border-2 border-emerald-500"></div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Número de Série (S/N)</label>
          <input 
            type="text" 
            placeholder="EX: GRW12345678"
            value={serialNumber}
            onChange={(e) => setSerialNumber(snMask(e.target.value))}
            className="w-full h-14 rounded-xl px-4 input-dark font-mono tracking-widest"
          />
        </div>
      )}

      {isMobile && (
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">S/N Detectado</label>
          <input 
            type="text" 
            value={serialNumber}
            onChange={(e) => setSerialNumber(snMask(e.target.value))}
            className="w-full h-14 rounded-xl px-4 input-dark font-mono tracking-widest"
          />
        </div>
      )}

      <button 
        onClick={handleHandshake}
        disabled={isValidating}
        className="w-full h-14 btn-neon rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
      >
        {isValidating ? "Validando..." : (
          <>
            Teste de Handshake
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-white/20 font-bold uppercase tracking-widest">
        Validação em Tempo Real via API do Fabricante
      </p>
    </div>
  );
};

export default InverterScanner;
