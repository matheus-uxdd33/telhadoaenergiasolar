import React from "react";
import "../styles/dashboard.css"; // Reuse premium styles

export default function SupportPage() {
    const phoneNumber = "5533998650351";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Olá! Preciso de suporte técnico no Solar SaaS.`;

    return (
        <div className="dashboard-premium fadeIn">
            <header className="premium-header">
                <div className="header-title">
                    <h1>Central de Ajuda & Suporte</h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Estamos aqui para garantir que sua usina gere o máximo sempre.</p>
                </div>
            </header>

            <div className="summary-grid">
                <div className="premium-card highlight">
                    <span className="card-label">SUPORTE VIA WHATSAPP</span>
                    <div className="card-value" style={{ fontSize: '28px', margin: '15px 0' }}>
                        (33) 99865-0351
                    </div>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="nav-btn primary" style={{ textAlign: 'center', display: 'block' }}>
                        Abrir Conversa Agora
                    </a>
                </div>

                <div className="premium-card">
                    <span className="card-label">HORÁRIO DE ATENDIMENTO</span>
                    <div className="card-value" style={{ fontSize: '20px', margin: '15px 0' }}>
                        Segunda a Sábado
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Das 08:00 às 18:00</p>
                </div>

                <div className="premium-card">
                    <span className="card-label">NOSSA SEDE</span>
                    <div className="card-value" style={{ fontSize: '20px', margin: '15px 0' }}>
                        Engenharia Solar
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Belo Horizonte - MG</p>
                </div>
            </div>

            <div className="simple-alert-box" style={{ marginTop: '30px' }}>
                <h3>💡 Como podemos te ajudar?</h3>
                <ul style={{ color: 'var(--text-light)', paddingLeft: '20px', marginTop: '10px', lineHeight: '2' }}>
                    <li>Dúvidas sobre os gráficos de geração</li>
                    <li>Ajuda para conectar um novo inversor</li>
                    <li>Explicação sobre as economias do mês</li>
                    <li>Problemas técnicos de acesso</li>
                </ul>
            </div>
        </div>
    );
}
