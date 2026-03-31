# 📡 Sistema de Integração de Inversores Solares

## 🎯 Como Funciona

A plataforma suporta múltiplas marcas de inversores solares. O usuário liga o sistema em alguns passos:

### 1️⃣ Selecionar a Marca
Marcas disponíveis:
- **Growatt** (Prioridade atual)
- **Solarman / Deye**
- **GoodWe**
- **Huawei FusionSolar**
- **API Genérica** (customizadas)

### 2️⃣ Escolher Modelo
Cada marca tem modelos pré-configurados. Exemplo:
- Growatt: SPF 5000, MIN 5000TL, MOD 10KTL3-X
- Deye: Deye Hybrid, Deye String
- GoodWe: GW5048D-ES, GW10K-ET

### 3️⃣ Método de Autenticação
Cada marca suporta diferentes formas:
- **credentials** — Email/Senha (portal web)
- **token** — Chave API
- **serial** — Número de série do inversor
- **manual_assisted** — Assistido manualmente

### 4️⃣ Testar Conexão
Antes de salvar, o sistema testa:
- ✅ Acesso à API
- ✅ Credenciais válidas
- ✅ Acesso aos dados de telemetria

---

## 🔌 Detalhes Técnicos por Marca

### 📍 Growatt (API Oficial)
**URL:** `https://server.growatt.com`

**Auth suportado:**
- `POST /LoginAPI.do` — Login com email/senha
- Retorna: Token de sessão + ID do dispositivo

**Dados disponíveis:**
- Status do inversor (online/offline)
- Geração atual (W)
- Geração diária (kWh)
- Temperatura
- Erros e alertas

**Exemplo de teste:**
```bash
curl -X POST https://server.growatt.com/LoginAPI.do \
  -d "userName=seu-email@growatt.com&password=sua-senha"
```

---

### 📍 Solarman / Deye
**URL:** `https://globalapi.solarmanpv.com`

**Auth suportado:**
- Token API (recomendado)
- Email + Senha

**Dados disponíveis:**
- Status geral
- Geração real-time
- Histórico (últimas 24h)
- Eficiência

**Nota:** Popular com gateways Solarman e inversores Deye Hybrid.

---

### 📍 GoodWe
**URL:** `https://eu-semsportal.goodwe.com`

**Auth suportado:**
- Email + Senha
- Token API

**Dados disponíveis:**
- Geração atual
- Consumo em tempo real
- Bateria (se aplicável)
- Histórico mensal

---

### 📍 Huawei FusionSolar
**URL:** `https://eu5.fusionsolar.huawei.com`

**Auth suportado:**
- Email + Senha
- Token

**Dados disponíveis:**
- Status do inversor
- Potência instantânea
- Energia total
- Eficiência do sistema

---

## 🔄 Fluxo de Integração (Backend)

```
Cliente escolhe marca e credenciais
       ↓
POST /api/system/test-connection
       ↓
Backend valida schema (Zod)
       ↓
Chama testInverterConnection()
       ↓
Conecta à API do provedor
       ↓
Retorna: {
  success: true/false,
  status: "connected" | "pending" | "disconnected",
  message: "Descrição do resultado"
}
       ↓
Se OK → PUT /api/system/credentials
       ↓
Salva credenciais encriptadas no Supabase
```

---

## 💾 Armazenamento de Credenciais

As credenciais são salvas **encriptadas** na tabela `user_systems`:

```sql
- user_id (FK)
- brand_code (growatt, solarman, etc)
- inverter_model
- installed_power
- location
- distributor
- auth_method (credentials | token | serial)
- api_token (encriptado)
- device_id
- connection_status
- last_sync
```

⚠️ **Segurança:** Nunca retorne senhas em respostas. Use apenas tokens para comunicação.

---

## 📊 Dados de Telemetria Disponíveis

Após conectar, a plataforma coleta:

| Dado | Tipo | Atualização |
|------|------|-------------|
| Potência Atual | W | Real-time (1-5s) |
| Geração Hoje | kWh | Cada 1 minuto |
| Geração Mês | kWh | Cada 10 minutos |
| Status | online/offline/erro | Real-time |
| Temperatura | °C | A cada 60s |
| Alertas | texto | Disparado ao ocorrer |

---

## 🧪 Testar Localmente

### 1. Preparar Credenciais
Obtenha suas credenciais do portal do seu inversor. Ex: Growatt.com

### 2. Chamar API de Teste
```bash
curl -X POST http://localhost:4000/api/system/test-connection \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "brandCode": "growatt",
    "model": "SPF 5000",
    "installedPower": 5000,
    "location": "São Paulo, SP",
    "distributor": "Energisa",
    "authMethod": "credentials",
    "username": "seu-email@growatt.com",
    "password": "sua-senha",
    "apiToken": "",
    "apiBaseUrl": "https://server.growatt.com"
  }'
```

### 3. Verificar Resposta
```json
{
  "success": true,
  "status": "connected",
  "message": "Inversor conectado com sucesso!",
  "targetUrl": "https://server.growatt.com/LoginAPI.do"
}
```

---

## 🚀 Próximos Passos (Roadmap)

- [ ] ✅ Implementar polling automático de dados (a cada 5 minutos)
- [ ] ✅ Cache em Redis para performance
- [ ] ✅ Webhook para alertas em tempo real
- [ ] ✅ Dashboard com histórico gráfico
- [ ] ✅ Relatórios automáticos (PDF)
- [ ] ✅ Integração com mais marcas (Fronius, SMA)

---

## ❓ FAQ

**P: Posso mudar de marca depois?**
R: Sim! Basta ir em "Meu Sistema" e escolher uma nova marca/credenciais.

**P: As credenciais são seguras?**
R: Sim! Usamos encriptação AES-256 no banco de dados. Nunca são expostas em respostas.

**P: Qual autenticação é mais segura?**
R: Token API > Email/Senha. Tokens podem ser revogados via portal.

**P: Posso usar modelo diferente do que aparece?**
R: Sim! Escolha "API Genérica" e defina a URL customizada.

**P: Entrou em erro ao conectar?**
R: Verifique:
1. Credenciais corretas no portal da marca
2. Inversor está online
3. URL da API é válida

---

## 📞 Suporte

Para problemas, abra um issue ou integre o seu próprio inversor customizando o arquivo:
`backend/src/modules/system/growatt.service.ts`
