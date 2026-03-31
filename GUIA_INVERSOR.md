# 🔌 Guia de Uso — Seleção de Inversor Solar

## ✅ Passo a Passo (5 minutos)

### 1️⃣ Acessar a página "Meu Sistema"
- Faça login
- Clique em "Meu Sistema" no menu lateral
- Veja a seção **"Selecionar marca do inversor"**

### 2️⃣ Escolher a marca do seu inversor
São 4 opções principais (visuais, com cards interativos):

| Marca | Modelos | Melhor Para |
|-------|---------|-----------|
| 🌐 **Growatt** | SPF 5000, MIN 5000TL, MOD 10KTL3-X | Inversores Growatt (maioria) |
| 📡 **Solarman / Deye** | Deye Hybrid, Deye String, Logger Solarman | Inversores Deye e gateways Solarman |
| ⚡ **GoodWe** | GW5048D-ES, GW10K-ET, Lynx Home F | Inversores GoodWe |
| 🏢 **Huawei FusionSolar** | SUN2000-5KTL, SUN2000-10KTL, LUNA2000 | Inversores Huawei |

**Como identificar sua marca:**
- Procure a etiqueta no equipamento (painel da bota)
- Oder acesse o portal do fabricante que você usa

### 3️⃣ Preencher os dados
Após selecionar a marca, um formulário aparece com:

```
📋 INFORMAÇÕES BÁSICAS
├─ Modelo do inversor  [dropdown com opções]
├─ Potência instalada  [ex: 5000 W]
├─ Localização        [ex: São Paulo, SP]
└─ Distribuidora      [ex: Energisa]

🔐 AUTENTICAÇÃO
├─ Método de autenticação  [credentials, token, serial, manual]
│
└─ Se "credentials":
   ├─ Usuário do portal   [seu-email@growatt.com]
   └─ Senha              [sua-senha]
│
└─ Se "token":
   └─ Token da API       [cole o token gerado no portal]

⚙️ AVANÇADO (opcional)
├─ URL da API         [preenchida automaticamente]
└─ Serial/Device ID   [se necessário]
```

### 4️⃣ Testar a conexão
Clique em **"Testar conexão real"** para validar:

- ✅ Credenciais estão corretas
- ✅ Inversor está online
- ✅ API está respondendo

Possíveis respostas:
- ✅ **Verde** — "Inversor conectado com sucesso!"
- ⏳ **Amarelo** — "Validação pendente..."
- ❌ **Vermelho** — Verifique credenciais/inversor

### 5️⃣ Salvar integração
Se o teste passou, clique em **"Salvar integração"**

Pronto! Agora o sistema começará a coletar dados reais do seu inversor.

---

## 🆘 Solução de Problemas

### ❌ "Falha ao conectar"
**Causas comuns:**

1. **Credenciais erradas**
   - Acesse `portal.growatt.com` (ou do seu fabricante)
   - Verifique email/senha
   - Se usar token, copie exatamente como gerado no portal

2. **Inversor está offline**
   - Verifique se há internet no local
   - Reinicie o inversor (desculpe 30 segundos)
   - Veja se há erros de inicialização

3. **URL da API incorreta**
   - Para Growatt: `https://server.growatt.com`
   - Para Solarman: `https://globalapi.solarmanpv.com`
   - Para GoodWe: `https://eu-semsportal.goodwe.com`
   - Para Huawei: `https://eu5.fusionsolar.huawei.com`

### ⏳ "Validação pendente"
- Significa que o sistema está verificando com o fabricante
- Espere 30 segundos e recarregue a página
- Se permanecer, tente salvar mesmo assim

### 🔑 "Qual autenticação usar?"
**Recomendação:**
1. Tente **"credentials"** primeiro (email/senha)
2. Se não funcionar, gere um **"token"** no portal do fabricante
3. Se ainda não funcionar, contacte o suporte

---

## 💡 Dicas de Segurança

✅ **Faça:**
- Use senhas fortes no portal do inversor
- Gere tokens de API com permissão **somente leitura**
- Revogue tokens antigos que não usa mais

❌ **Não faça:**
- Compartilhe suas credenciais
- Coloque senhas em código (elas são encriptadas aqui)
- Use senhas iguais em vários portais

---

## 📊 Dados que serão coletados

Após conectar, o dashboard mostrará automaticamente:

| Dado | Atualização | Visibilidade |
|------|------------|-------------|
| 🟢 Geração atual (kW) | Real-time | Always |
| 📈 Geração hoje (kWh) | 1x por minuto | Always |
| 📅 Geração este mês (kWh) | 10x por minuto | Premium |
| 💰 Economia estimada | Horária | Premium |
| ⚠️ Alertas | Ao ocorrer | Always |
| 🔴 Erros/Manutenção | Real-time | Always |

---

## ❓ FAQ

**P: Posso mudar de marca depois?**
R: Sim! Volte para "Meu Sistema" e selecione outra marca. Os dados anteriores serão substituídos.

**P: Posso ter múltiplos inversores?**
R: Atualmente suportamos 1 inversor por conta. Para múltiplos, contacte suporte.

**P: Quanto tempo leva para aparecer dados?**
R: Normalmente 1-2 minutos após conectar. Se demorar, recarregue a página.

**P: E se a API do fabricante ficar offline?**
R: O sistema mantém os dados da última sincronização. Você verá um aviso de "último sync há X minutos".

**P: Os dados dele nuca são apagados?**
R: Dados são mantidos por 2 anos no banco (Premium) ou 30 dias (Gratuito).

---

## 🎬 Next Steps

Após conectar seu inversor:

1. Veja o **Dashboard** para acompanhar geração em tempo real
2. Abra **Alertas** para receber notificações de problemas
3. Gere **Relatórios** (Premium) para análises detalhadas
4. Configure **Suporte** se precisar de ajuda

Qualquer dúvida, abra um ticket em **"Suporte"**. 🚀
