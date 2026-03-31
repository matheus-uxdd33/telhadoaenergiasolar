# 🚀 **DEPLOY — Deixar Online Agora**

## 🎯 **Opções de Deploy (Escolha Uma)**

---

## **1️⃣ NETLIFY (Recomendado para Iniciantes)**

### **Passo 1: Criar Conta**
```
🌐 ACESSE: https://netlify.com
👤 CRIE CONTA: GitHub, GitLab ou Email
```

### **Passo 2: Conectar Repositório**
```
➕ CLIQUE: "New site from Git"
🔗 CONECTE: Seu repositório GitHub
📁 SELECIONE: Repositório da plataforma solar
```

### **Passo 3: Configurar Build**
```
⚙️ BUILD SETTINGS:
├── Branch: main
├── Build command: npm run build
└── Publish directory: frontend/dist
```

### **Passo 4: Adicionar Variáveis**
```
🔧 SITE SETTINGS → Build & deploy → Environment:
├── BACKEND_URL: (deixe vazio - Netlify Functions)
├── VITE_API_BASE_URL: /api
└── NODE_VERSION: 20
```

### **Passo 5: Deploy**
```
✅ CLIQUE: "Deploy site"
⏳ ESPERE: 2-3 minutos
🌐 SITE ONLINE: https://nome-gerado.netlify.app
```

---

## **2️⃣ VERCEL (Alternativa Profissional)**

### **Passo 1: Criar Conta**
```
🌐 ACESSE: https://vercel.com
👤 CRIE CONTA: GitHub
```

### **Passo 2: Importar Projeto**
```
➕ CLIQUE: "New Project"
🔗 CONECTE: Repositório GitHub
📁 SELECIONE: Pasta do projeto
```

### **Passo 3: Configurar**
```
⚙️ FRAMEWORK PRESET: Other
📁 ROOT DIRECTORY: ./
🔧 BUILD COMMAND: npm run build
📦 OUTPUT DIRECTORY: frontend/dist
```

### **Passo 4: Adicionar Variáveis**
```
🔧 Environment Variables:
├── BACKEND_URL: (auto-detectado)
├── VITE_API_BASE_URL: /api
└── NODE_ENV: production
```

### **Passo 5: Deploy**
```
✅ CLIQUE: "Deploy"
⏳ ESPERE: 3-5 minutos
🌐 SITE ONLINE: https://nome-projeto.vercel.app
```

---

## **3️⃣ SUPABASE (Banco de Dados)**

### **Passo 1: Criar Projeto**
```
🌐 ACESSE: https://supabase.com
👤 CRIE CONTA gratuita
➕ CLIQUE: "New project"
```

### **Passo 2: Configurar Projeto**
```
📝 PROJECT DETAILS:
├── Name: Plataforma Solar SaaS
├── Database Password: senha-forte-123
└── Region: São Paulo (South America)
```

### **Passo 3: Executar Schema**
```
🗄️ SQL EDITOR (painel lateral)
📄 COLE: Todo conteúdo do arquivo supabase/schema.sql
▶️ CLIQUE: "Run"
✅ SCHEMA CRIADO
```

### **Passo 4: Copiar Credenciais**
```
⚙️ SETTINGS → API
📋 ANOTE:
├── Project URL: https://xxx.supabase.co
├── anon/public key: eyJ...
└── service_role key: eyJ...
```

---

## **4️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE**

### **Arquivo `.env` (local)**
```bash
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# JWT
JWT_SECRET=sua-chave-secreta-super-forte-aqui

# Porta
PORT=4000
```

### **No Deploy (Netlify/Vercel)**
```
🔧 Environment Variables:
├── VITE_SUPABASE_URL: https://xxx.supabase.co
├── VITE_SUPABASE_ANON_KEY: eyJ...
├── JWT_SECRET: sua-chave-secreta-super-forte-aqui
└── NODE_ENV: production
```

---

## **5️⃣ DOMÍNIO PERSONALIZADO (Opcional)**

### **Netlify:**
```
⚙️ Site settings → Domain management
➕ Add custom domain
🔗 Configure DNS no seu provedor
```

### **Vercel:**
```
⚙️ Settings → Domains
➕ Add your domain
🔗 Configure DNS
```

---

## **6️⃣ TESTAR PRODUÇÃO**

### **Após Deploy:**
```
🌐 ACESSE: https://seu-site.com
👤 CRIE CONTA de teste
🔌 VÁ EM: "Meu Sistema"
🎯 SELECIONE: Growatt (teste)
🧪 TESTE: Conexão (usar credenciais demo)
📊 VERIFIQUE: Dashboard carrega
```

---

## **7️⃣ MONITORAMENTO**

### **Netlify:**
```
📊 Site settings → Analytics
📈 Functions → Logs de erro
🚨 Deploy notifications
```

### **Vercel:**
```
📊 Dashboard → Analytics
📈 Functions → Logs
🚨 Error monitoring
```

---

## **8️⃣ BACKUP E SEGURANÇA**

### **Supabase:**
```
🗄️ Database → Backups
📤 Exportar dados regularmente
🔒 Row Level Security (RLS) ativado
```

### **Monitoramento:**
```
🚨 Alertas de uptime (UptimeRobot grátis)
📊 Google Analytics
🔍 Error tracking (Sentry)
```

---

## **💰 CUSTOS**

### **Gratuito:**
```
Netlify: 100GB bandwidth/mês
Supabase: 500MB database
Vercel: 100GB bandwidth/mês
```

### **Pago (se necessário):**
```
Netlify: $19/mês (1000GB)
Supabase: $25/mês (2GB)
Vercel: $20/mês (1000GB)
```

---

## **🎯 CHECKLIST FINAL**

### **Antes do Deploy:**
- ✅ Git commit feito
- ✅ Build sem erros
- ✅ Supabase configurado
- ✅ Variáveis de ambiente
- ✅ Teste local funcionando

### **Após Deploy:**
- ✅ Site acessível
- ✅ Cadastro funcionando
- ✅ Login funcionando
- ✅ "Meu Sistema" acessível
- ✅ Conexão teste OK
- ✅ Dashboard carrega

---

## **🚨 SUPORTE**

### **Problemas Comuns:**
```
❌ Build falha: Verificar Node.js version
❌ API erro: Verificar variáveis ambiente
❌ DB erro: Verificar Supabase credentials
❌ Functions erro: Verificar logs no painel
```

### **Ajuda:**
```
📧 Email: suporte@plataforma.com
💬 Discord: discord.gg/solar-saas
📚 Docs: Ver arquivos .md no repositório
```

---

## **🎉 PRONTO PARA IR ONLINE!**

**Seu site estará online em 10 minutos!** 🚀

Escolha **Netlify** para começar rápido, ou **Vercel** para mais controle.

**URL final:** `https://sua-plataforma-solar.netlify.app` 🌐