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
    // Silently ignore scan failures
  };

  const handleLocalHandshake = async () => {
    setIsConnecting(true);
    setConnectionStatus('searching');
    const LOGGER_IP = '10.10.100.254';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      toast.loading('Tentando handshake...', { id: 'handshake' });
      await fetch(`http://${LOGGER_IP}/status`, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
      });
      setConnectionStatus('connected');
      toast.success('Inversor detectado!', { id: 'handshake' });
    } catch (error: any) {
      setConnectionStatus('error');
      toast.error('Falha na conexão local.', { id: 'handshake' });
    } finally {
      setIsConnecting(false);
      clearTimeout(timeoutId);
    }
  };

  return (
    <div style={{ 
      maxWidth: 440, 
      margin: '0 auto', 
      padding: 40, 
      background: 'rgba(6, 13, 24, 0.6)', 
      border: '1px solid rgba(16, 185, 129, 0.2)', 
      borderRadius: 28, 
      backdropFilter: 'blur(24px)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    }}>
      <style>{`
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,0.1)} 50%{box-shadow:0 0 40px rgba(16,185,129,0.3)} }
        .connector-card { animation: glowPulse 4s ease-in-out infinite; }
        .input-field:focus { border-color: #10b981 !important; outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .btn-action { transition: all 0.2s; cursor: pointer; }
        .btn-action:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-action:active { transform: scale(0.98); }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Conectar Inversor</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Siga o passo a passo para sincronizar</p>
      </div>

      {/* QR Code Section */}
      <div style={{ marginBottom: 32 }}>
        {!isScanning ? (
          <button
            onClick={() => setIsScanning(true)}
            className="btn-action"
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              borderRadius: 16, 
              color: '#10b981', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
            Escanear QR Code
          </button>
        ) : (
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '2px solid #10b981' }}>
            <div id="qr-reader"></div>
            <button
              onClick={() => setIsScanning(false)}
              style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#ef4444', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* S/N Input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Número de Série (S/N)</label>
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Ex: 1234567890"
          className="input-field"
          style={{ 
            width: '100%', 
            padding: '14px 16px', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: 14, 
            color: '#fff', 
            fontSize: 15,
            transition: '0.2s'
          }}
        />
      </div>

      {/* Handshake Section */}
      <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 20 }}>
          Conecte-se ao Wi-Fi do inversor (<strong>AP Mode</strong>) para realizar o handshake local.
        </p>
        <button
          onClick={handleLocalHandshake}
          disabled={isConnecting}
          className="btn-action"
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: connectionStatus === 'connected' ? '#10b981' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            border: 'none', 
            borderRadius: 14, 
            color: connectionStatus === 'connected' ? '#060d18' : '#fff', 
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: connectionStatus === 'connected' ? '0 0 20px rgba(16,185,129,0.4)' : 'none'
          }}
        >
          {isConnecting ? (
            <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          ) : connectionStatus === 'connected' ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Conectado!
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
              Handshake Local
            </>
          )}
        </button>
      </div>

      <style>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );
};

export default InverterConnector;
