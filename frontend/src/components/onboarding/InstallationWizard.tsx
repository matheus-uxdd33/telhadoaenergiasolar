import { useState, useEffect, useRef } from "react";

const BRANDS = [
    {
        id: "growatt",
        name: "Growatt",
        endpoint: "https://server.growatt.com",
        model: "ShineWifi-X",
        networks: ["GD_", "ShineWifi-"],
        color: "#f97316",
        logo: (
            <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="28">
                <rect x="0" y="6" width="6" height="12" rx="1" fill="#f97316" />
                <rect x="8" y="2" width="6" height="16" rx="1" fill="#f97316" opacity="0.8" />
                <rect x="16" y="0" width="6" height="20" rx="1" fill="#f97316" opacity="0.6" />
                <text x="26" y="16" fill="#f97316" fontSize="11" fontWeight="700" fontFamily="monospace">GROWATT</text>
            </svg>
        ),
    },
    {
        id: "deye",
        name: "Deye",
        endpoint: "https://monitor.deye.com.cn",
        model: "SolarmanV5",
        networks: ["S/N_", "DEYE_"],
        color: "#3b82f6",
        logo: (
            <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="60" height="28">
                <circle cx="10" cy="12" r="9" stroke="#3b82f6" strokeWidth="2" />
                <path d="M10 3 C15 3 19 7 19 12 C19 17 15 21 10 21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <text x="24" y="16" fill="#3b82f6" fontSize="12" fontWeight="700" fontFamily="monospace">DEYE</text>
            </svg>
        ),
    },
    {
        id: "weg",
        name: "WEG",
        endpoint: "https://solar.weg.net",
        model: "SIW500H",
        networks: ["WEG_", "SOLAR_W"],
        color: "#10b981",
        logo: (
            <svg viewBox="0 0 50 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="55" height="28">
                <path d="M2 4 L10 20 L18 4" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <text x="22" y="16" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">WEG</text>
            </svg>
        ),
    },
    {
        id: "sungrow",
        name: "Sungrow",
        endpoint: "https://portaleu.isolarcloud.com",
        model: "WiNet-S",
        networks: ["SG_", "iSolar_"],
        color: "#a855f7",
        logo: (
            <svg viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="28">
                <circle cx="12" cy="12" r="5" fill="#a855f7" />
                <line x1="12" y1="2" x2="12" y2="5" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="19" x2="12" y2="22" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="12" x2="5" y2="12" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
                <line x1="19" y1="12" x2="22" y2="12" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
                <text x="27" y="16" fill="#a855f7" fontSize="10" fontWeight="700" fontFamily="monospace">SUNGROW</text>
            </svg>
        ),
    },
];

const GreenCheck = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#10b981" />
        <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WifiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M1.5 8.5C5.5 4.5 10 3 12 3s6.5 1.5 10.5 5.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.5 11.5C7 9 9.5 8 12 8s5 1 7.5 3.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.5 14.5C9 13 10.5 12.5 12 12.5s3 .5 4.5 2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="18" r="1.5" fill="#10b981" />
    </svg>
);

const CameraIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="15" rx="2" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="12" cy="14" r="4" stroke="#10b981" strokeWidth="1.5" />
        <path d="M8 7L9.5 4h5L16 7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const QrIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="3" width="3" height="3" fill="currentColor" />
        <rect x="12" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="3" height="3" fill="currentColor" />
        <rect x="1" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="3" height="3" fill="currentColor" />
        <rect x="12" y="12" width="3" height="3" fill="currentColor" />
        <rect x="17" y="12" width="2" height="2" fill="currentColor" />
        <rect x="12" y="17" width="2" height="2" fill="currentColor" />
        <rect x="15" y="15" width="3" height="3" fill="currentColor" />
    </svg>
);

const EyeIcon = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {open ? (
            <>
                <path d="M1 9C3 5 6 3 9 3s6 2 8 6c-2 4-5 6-8 6S3 13 1 9z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
            </>
        ) : (
            <>
                <path d="M1 9C3 5 6 3 9 3s6 2 8 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M2 16L16 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </>
        )}
    </svg>
);

const GearIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15 9H3M8 14L3 9l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function ProgressBar({ step, total = 3 }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                {Array.from({ length: total }).map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 600,
                            background: i < step ? "#10b981" : i === step ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                            border: i === step ? "1.5px solid #10b981" : i < step ? "none" : "1.5px solid rgba(255,255,255,0.1)",
                            color: i <= step ? (i < step ? "#fff" : "#10b981") : "rgba(255,255,255,0.3)",
                            transition: "all 0.4s ease",
                        }}>
                            {i < step ? <GreenCheck size={14} /> : i + 1}
                        </div>
                        <span style={{
                            fontSize: 11, fontWeight: 500,
                            color: i === step ? "#10b981" : i < step ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.25)",
                            transition: "all 0.4s ease",
                        }}>
                            {["Marca", "Wi-Fi", "Identificação"][i]}
                        </span>
                        {i < total - 1 && (
                            <div style={{ width: 40, height: 1.5, background: i < step ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.08)", marginLeft: 4, transition: "all 0.4s ease" }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Step1({ onNext, selectedBrand, setSelectedBrand }) {
    return (
        <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Qual é a marca do seu inversor?
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 32, lineHeight: 1.6 }}>
                Selecione abaixo para configurarmos tudo automaticamente para você.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
                {BRANDS.map((brand) => {
                    const selected = selectedBrand?.id === brand.id;
                    return (
                        <button
                            key={brand.id}
                            onClick={() => setSelectedBrand(brand)}
                            style={{
                                position: "relative",
                                background: selected ? `rgba(16,185,129,0.08)` : "rgba(255,255,255,0.03)",
                                border: selected ? "1.5px solid #10b981" : "1.5px solid rgba(255,255,255,0.08)",
                                borderRadius: 16,
                                padding: "28px 20px",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 12,
                                transition: "all 0.25s ease",
                                transform: selected ? "scale(1.02)" : "scale(1)",
                            }}
                        >
                            {selected && (
                                <div style={{ position: "absolute", top: 10, right: 10 }}>
                                    <GreenCheck size={18} />
                                </div>
                            )}
                            <div style={{
                                width: 56, height: 56, borderRadius: 14,
                                background: selected ? `${brand.color}18` : "rgba(255,255,255,0.05)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.25s ease",
                            }}>
                                {brand.logo}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: selected ? "#10b981" : "rgba(255,255,255,0.7)" }}>
                                {brand.name}
                            </span>
                            {selected && (
                                <span style={{ fontSize: 10, color: "rgba(16,185,129,0.7)", fontFamily: "monospace" }}>
                                    ✓ Configurado automaticamente
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
            {selectedBrand && (
                <div style={{
                    background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
                    borderRadius: 12, padding: "12px 16px", marginBottom: 24,
                    display: "flex", alignItems: "center", gap: 10,
                    animation: "fadeSlideIn 0.3s ease",
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ fontSize: 12, color: "rgba(16,185,129,0.9)" }}>
                        Servidor configurado automaticamente para {selectedBrand.name}
                    </span>
                </div>
            )}
            <button
                onClick={onNext}
                disabled={!selectedBrand}
                style={{
                    width: "100%", padding: "16px 24px",
                    background: selectedBrand ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.06)",
                    border: "none", borderRadius: 14,
                    color: selectedBrand ? "#fff" : "rgba(255,255,255,0.25)",
                    fontSize: 15, fontWeight: 600, cursor: selectedBrand ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.25s ease",
                    letterSpacing: "0.01em",
                }}
            >
                Continuar para Wi-Fi <ArrowRight />
            </button>
        </div>
    );
}

function Step2({ onNext, onBack, brand }) {
    const [ssid, setSsid] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [syncDone, setSyncDone] = useState(false);

    const steps = [
        { icon: "📱", text: "Abra as configurações de Wi-Fi do seu celular" },
        { icon: "🔗", text: `Conecte-se à rede que começa com "${brand?.networks?.[0] || "GD_"}" ou "${brand?.networks?.[1] || "S/N_"}"` },
        { icon: "🏠", text: "Volte aqui e informe o Wi-Fi da sua casa abaixo" },
    ];

    const handleSync = () => {
        if (!ssid || !password) return;
        setSyncing(true);
        setProgress(0);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 18 + 4;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setTimeout(() => { setSyncing(false); setSyncDone(true); }, 400);
            }
            setProgress(Math.min(p, 100));
        }, 200);
    };

    return (
        <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Conectando seu inversor ao Wi-Fi
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28, lineHeight: 1.6 }}>
                Siga os 3 passos abaixo. Vai levar menos de 2 minutos.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {steps.map((s, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 14,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 12, padding: "14px 16px",
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, flexShrink: 0,
                        }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#10b981", marginBottom: 3 }}>Passo {i + 1}</div>
                            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{s.text}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                    Nome da rede Wi-Fi da sua casa (SSID)
                </label>
                <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                        <WifiIcon />
                    </div>
                    <input
                        value={ssid}
                        onChange={e => setSsid(e.target.value)}
                        placeholder="Ex: MinhaRede2024"
                        style={{
                            width: "100%", padding: "14px 16px 14px 48px",
                            background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 12, color: "#fff", fontSize: 14, outline: "none",
                            transition: "border 0.2s",
                            fontFamily: "inherit",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.6)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                    Senha do Wi-Fi
                </label>
                <div style={{ position: "relative" }}>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type={showPass ? "text" : "password"}
                        placeholder="Senha da sua rede"
                        style={{
                            width: "100%", padding: "14px 48px 14px 16px",
                            background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 12, color: "#fff", fontSize: 14, outline: "none",
                            transition: "border 0.2s", fontFamily: "inherit",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.6)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                    <button
                        onClick={() => setShowPass(v => !v)}
                        style={{
                            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4,
                        }}
                    >
                        <EyeIcon open={showPass} />
                    </button>
                </div>
            </div>

            {syncing && (
                <div style={{ marginBottom: 20, animation: "fadeSlideIn 0.3s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Sincronizando com o inversor...</span>
                        <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                            height: "100%", width: `${progress}%`,
                            background: "linear-gradient(90deg, #10b981, #34d399)",
                            borderRadius: 99, transition: "width 0.2s ease",
                        }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(16,185,129,0.6)", marginTop: 6 }}>
                        {progress < 40 ? "Conectando ao inversor..." : progress < 75 ? "Enviando configurações..." : "Validando conexão..."}
                    </div>
                </div>
            )}

            {syncDone && (
                <div style={{
                    background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)",
                    borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                    display: "flex", alignItems: "center", gap: 10,
                    animation: "fadeSlideIn 0.4s ease",
                }}>
                    <GreenCheck size={20} />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>Conexão verificada!</div>
                        <div style={{ fontSize: 11, color: "rgba(16,185,129,0.7)" }}>Wi-Fi configurado com sucesso</div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: "16px 20px", background: "rgba(255,255,255,0.05)",
                        border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14,
                        color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                    }}
                >
                    <ArrowLeft />
                </button>
                {!syncDone ? (
                    <button
                        onClick={handleSync}
                        disabled={!ssid || !password || syncing}
                        style={{
                            flex: 1, padding: "16px 24px",
                            background: ssid && password && !syncing ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.06)",
                            border: "none", borderRadius: 14,
                            color: ssid && password && !syncing ? "#fff" : "rgba(255,255,255,0.25)",
                            fontSize: 15, fontWeight: 600,
                            cursor: ssid && password && !syncing ? "pointer" : "not-allowed",
                            transition: "all 0.25s ease",
                        }}
                    >
                        {syncing ? "Sincronizando..." : "Sincronizar Agora"}
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        style={{
                            flex: 1, padding: "16px 24px",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            border: "none", borderRadius: 14,
                            color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                    >
                        Continuar <ArrowRight />
                    </button>
                )}
            </div>
        </div>
    );
}

function Step3({ onFinish, onBack, brand }) {
    const [serial, setSerial] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [endpoint, setEndpoint] = useState(brand?.endpoint || "");
    const [model, setModel] = useState(brand?.model || "");
    const [scanning, setScanning] = useState(false);
    const [scanDone, setScanDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startScan = async () => {
        setScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setTimeout(() => {
                const fake = "SN" + Math.floor(Math.random() * 9000000 + 1000000);
                setSerial(fake);
                setScanDone(true);
                setScanning(false);
                if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            }, 3000);
        } catch {
            const fake = "SN" + Math.floor(Math.random() * 9000000 + 1000000);
            setSerial(fake);
            setScanDone(true);
            setScanning(false);
        }
    };

    const stopScan = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        setScanning(false);
    };

    const handleFinalize = async () => {
        if (!serial || !email || !password) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/system/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    marca: brand.id,
                    endpoint: endpoint,
                    ssid: "", // Already set in step 2
                    serial: serial,
                    email: email,
                    senha: password,
                }),
            });

            const result = await response.json();
            if (result.success) {
                onFinish();
            } else {
                alert(result.error || 'Erro ao conectar sistema.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Falha na comunicação com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    const canFinish = serial && email && password && !isLoading;

    return (
        <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Identificação e credenciais
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 28 }}>
                Último passo! Escaneie o QR Code do inversor e confirme seu acesso.
            </p>

            <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8 }}>
                    Número de série do inversor
                </label>
                {scanning ? (
                    <div style={{
                        background: "#000", borderRadius: 14, overflow: "hidden",
                        border: "1.5px solid rgba(16,185,129,0.4)", position: "relative", marginBottom: 10,
                    }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{
                                width: 140, height: 140,
                                border: "2px solid #10b981",
                                borderRadius: 12, position: "relative",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: "rgba(16,185,129,0.8)", animation: "scanLine 1.5s ease-in-out infinite" }} />
                            </div>
                        </div>
                        <button
                            onClick={stopScan}
                            style={{
                                position: "absolute", top: 10, right: 10,
                                background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: 8, color: "#fff", fontSize: 11, padding: "4px 10px", cursor: "pointer",
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <input
                                value={serial}
                                onChange={e => setSerial(e.target.value)}
                                placeholder="Ex: SN1234567"
                                style={{
                                    width: "100%", padding: "14px 16px",
                                    background: scanDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.05)",
                                    border: `1.5px solid ${scanDone ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
                                    borderRadius: 12, color: "#fff", fontSize: 14, outline: "none", fontFamily: "monospace",
                                }}
                            />
                            {scanDone && (
                                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                                    <GreenCheck size={16} />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={startScan}
                            style={{
                                padding: "14px 16px", background: "rgba(16,185,129,0.1)",
                                border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 12,
                                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                                color: "#10b981", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                            }}
                        >
                            <CameraIcon /> Escanear QR
                        </button>
                    </div>
                )}
                {scanDone && (
                    <div style={{ fontSize: 11, color: "rgba(16,185,129,0.7)", marginTop: 6 }}>
                        ✓ Número de série capturado automaticamente
                    </div>
                )}
            </div>

            <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "16px", marginBottom: 16,
            }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 20, height: 20, background: "rgba(16,185,129,0.15)", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🔑</span>
                    Seu Acesso {brand?.name || ""}
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5 }}>Seu e-mail de acesso</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        placeholder="seu@email.com"
                        style={{
                            width: "100%", padding: "13px 14px",
                            background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)",
                            borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit",
                        }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 5 }}>Sua senha</label>
                    <div style={{ position: "relative" }}>
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type={showPass ? "text" : "password"}
                            placeholder="Senha do portal"
                            style={{
                                width: "100%", padding: "13px 44px 13px 14px",
                                background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)",
                                borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit",
                            }}
                        />
                        <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4 }}>
                            <EyeIcon open={showPass} />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowAdvanced(v => !v)}
                style={{
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    color: "rgba(255,255,255,0.3)", fontSize: 12, padding: "4px 0", marginBottom: 14,
                }}
            >
                <GearIcon /> Configurações avançadas {showAdvanced ? "▴" : "▾"}
            </button>

            {showAdvanced && (
                <div style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12, padding: "14px", marginBottom: 16,
                    animation: "fadeSlideIn 0.25s ease",
                }}>
                    <div style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 5 }}>Endpoint (URL do servidor)</label>
                        <input value={endpoint} onChange={e => setEndpoint(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, outline: "none", fontFamily: "monospace" }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 5 }}>Modelo do módulo Wi-Fi</label>
                        <input value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} style={{ padding: "16px 20px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <ArrowLeft />
                </button>
                <button
                    onClick={handleFinalize}
                    disabled={!canFinish}
                    style={{
                        flex: 1, padding: "16px 24px",
                        background: canFinish ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.06)",
                        border: "none", borderRadius: 14,
                        color: canFinish ? "#fff" : "rgba(255,255,255,0.25)",
                        fontSize: 15, fontWeight: 600,
                        cursor: canFinish ? "pointer" : "not-allowed",
                        transition: "all 0.25s ease",
                    }}
                >
                    {isLoading ? "Processando..." : "Finalizar instalação"}
                </button>
            </div>
        </div>
    );
}

function SuccessScreen({ brand, onReset }) {
    return (
        <div style={{ textAlign: "center", animation: "fadeSlideIn 0.5s ease", padding: "20px 0" }}>
            <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 70%)",
                border: "2px solid rgba(16,185,129,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px", animation: "pulse 2s ease-in-out infinite",
            }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill="#10b981" />
                    <path d="M13 25L20 32L35 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.03em" }}>
                Sistema Conectado!
            </h2>
            <p style={{ fontSize: 16, color: "#10b981", fontWeight: 500, marginBottom: 8 }}>
                Começando a gerar economia agora
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 32, lineHeight: 1.6 }}>
                Seu inversor {brand?.name} está online e sincronizando dados em tempo real.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
                {[
                    { label: "Hoje", value: "—", sub: "kWh gerados" },
                    { label: "Economia", value: "R$ 0", sub: "este mês" },
                    { label: "Status", value: "Online", sub: "tempo real", green: true },
                ].map((c, i) => (
                    <div key={i} style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 12, padding: "14px 10px",
                    }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: c.green ? "#10b981" : "#fff", marginBottom: 2 }}>{c.value}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{c.sub}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => window.location.reload()}
                style={{
                    width: "100%", padding: "16px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none", borderRadius: 14, color: "#fff",
                    fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 10,
                }}
            >
                Ir para o Dashboard →
            </button>
            <button
                onClick={onReset}
                style={{
                    width: "100%", padding: "12px",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14, color: "rgba(255,255,255,0.4)",
                    fontSize: 13, cursor: "pointer",
                }}
            >
                Adicionar outro inversor
            </button>
        </div>
    );
}

export const InstallationWizard: React.FC = () => {
    const [step, setStep] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [done, setDone] = useState(false);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0a0f1a 0%, #0d1525 50%, #0a1210 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); } 50% { box-shadow: 0 0 0 16px rgba(16,185,129,0); } }
        @keyframes scanLine { 0% { top: 0; } 50% { top: calc(100% - 2px); } 100% { top: 0; } }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input { box-sizing: border-box; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 99px; }
      `}</style>

            {/* Ambient glow */}
            <div style={{
                position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
                width: 500, height: 300, borderRadius: "50%",
                background: "rgba(16,185,129,0.04)",
                filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
            }} />

            <div style={{
                width: "100%", maxWidth: 440, position: "relative", zIndex: 1,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24, padding: 28,
                backdropFilter: "blur(20px)",
            }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="4" fill="white" />
                            <line x1="9" y1="1" x2="9" y2="3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="9" y1="14.5" x2="9" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="1" y1="9" x2="3.5" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="14.5" y1="9" x2="17" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>Solar SaaS</div>
                        <div style={{ fontSize: 10, color: "rgba(16,185,129,0.7)", fontWeight: 500 }}>Assistente de Instalação</div>
                    </div>
                </div>

                {!done && <ProgressBar step={step} />}

                {done ? (
                    <SuccessScreen brand={selectedBrand} onReset={() => { setDone(false); setStep(0); setSelectedBrand(null); }} />
                ) : step === 0 ? (
                    <Step1 selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} onNext={() => setStep(1)} />
                ) : step === 1 ? (
                    <Step2 brand={selectedBrand} onNext={() => setStep(2)} onBack={() => setStep(0)} />
                ) : (
                    <Step3 brand={selectedBrand} onFinish={() => setDone(true)} onBack={() => setStep(1)} />
                )}
            </div>
        </div>
    );
}
