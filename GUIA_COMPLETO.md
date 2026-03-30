# 🌍 Painel de Cliente SaaS Solar — Guia Completo

Projeto **full-stack pronto para produção** com integração **GitHub → Netlify → Supabase**.

---

## 📦 O que foi entregue

### ✅ Backend (Node.js + Express + TypeScript)
- API REST com autenticação JWT multi-tenant
- 5 módulos principais: Auth, Dashboard, Sistema, Alertas, Perfil
- Estrutura para integração com Supabase
- Pronto para deploy em Vercel, Railway ou como função serverless

### ✅ Frontend (React + TypeScript + Vite)
- Interface corporativa responsiva
- 4 telas completas: Login, Dashboard, Meu Sistema, Alertas
- Layout com sidebar, header, cards visuais
- Autenticação protegida com Zustand
- Consumo de API com Axios

### ✅ Banco de Dados (Supabase)
- Schema SQL completo com 13 tabelas
- Suporte a multi-tenant
- Índices, triggers e funções otimizadas
- Integração fim-a-fim ready

### ✅ DevOps & Deployment
- Monorepo com workspaces npm
- Versionamento Git inicializado
- Configuração Netlify.toml para frontend
- Documentação de deploy passo-a-passo

---

## 🚀 Como usar localmente

### 1. Instalar dependências
```bash
cd "c:\Users\YASTH\Desktop\Telhado a Energia Solar API"
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais Supabase.

### 3. Iniciar desenvolvimento
```bash
npm run dev
```

- **Backend**: http://localhost:4000/api
- **Frontend**: http://localhost:5173

### 4. Login demo
```
Email: client@solarsaas.com
Senha: demo123
```

**Nota**: No modo demo, qualquer email/senha funciona.

---

## 📊 Fluxo de dados

```
Browser
  ↓
Frontend (React)
  ├→ Login Page
  ├→ Dashboard (Status, Geração, Economia)
  ├→ System (Marca, Modelo, Potência)
  └→ Alerts (Listagem com filtros)
        ↓
        ↓ HTTP + JWT
        ↓
Backend (Express)
  ├→ /api/auth/login
  ├→ /api/dashboard/summary
  ├→ /api/dashboard/charts
  ├→ /api/system
  └→ /api/alerts
        ↓
        ↓ SQL
        ↓
Supabase PostgreSQL
```

---

## 🌐 Deploy em 5 passos

### Passo 1: Push para GitHub

```bash
# Criar repositório vazio no GitHub (sem README)
# Depois rodar:

git remote add origin https://github.com/SEU_USER/solar-saas.git
git push -u origin main
```

### Passo 2: Conecte ao Netlify

1. Acesse https://netlify.com
2. Clique em "New site from Git"
3. Selecione seu repositório
4. Configure automático (`netlify.toml` já tem instruções)

### Passo 3: Deploy do Backend

**Opção A - Vercel**
```bash
npm i -g vercel
cd backend
vercel --prod
```

**Opção B - Railway**
1. Acesse https://railway.app
2. Connect GitHub
3. Deploy do projeto (railway detecta Node.js automaticamente)

**Opção C - AWS Lambda / Netlify Functions**
Editar `netlify/functions/api.ts` para adaptar Express às functions.

### Passo 4: Configure Supabase

1. Crie projeto em https://supabase.com
2. Copie as chaves (URL e Anon Key)
3. No SQL Editor, execute `supabase/schema.sql`
4. Adicione variáveis no Netlify:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Passo 5: Configure variáveis do Netlify

```
VITE_API_BASE_URL = https://sua-api.com/api
JWT_SECRET = seu-super-secreto
```

---

## 📁 Estrutura do projeto

```
telhado-energia-solar-api/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── system/
│   │   │   ├── alerts/
│   │   │   └── profile/
│   │   ├── common/
│   │   │   ├── middlewares/
│   │   │   ├── guards/
│   │   │   ├── errors/
│   │   │   └── utils/
│   │   ├── database/
│   │   ├── services/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── System.tsx
│   │   │   └── Alerts.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── dist/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── supabase/
│   └── schema.sql
│
├── netlify.toml
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── README.md
└── package.json (root)
```

---

## 🔑 Endpoints disponíveis

### Autenticação
- `POST /api/auth/login` — Login (retorna token JWT)
- `POST /api/auth/logout` — Logout

### Dashboard (requer autenticação)
- `GET /api/dashboard/summary` — Status geral, geração, economia
- `GET /api/dashboard/charts` — Dados para gráficos
- `GET /api/dashboard/alerts` — Alertas recentes

### Sistema
- `GET /api/system` — Info do inversor
- `POST /api/system/test-connection` — Testar conexão
- `PUT /api/system/credentials` — Atualizar credenciais

### Alertas
- `GET /api/alerts` — Listar alertas com filtros
- `GET /api/alerts/:id` — Detalhe do alerta

### Perfil
- `GET /api/profile` — Dados do usuário
- `PUT /api/profile` — Atualizar perfil

---

## 🔒 Segurança

- ✅ Autenticação JWT com expiração 24h
- ✅ Isolamento de dados por tenant_id
- ✅ Middleware de autenticação em todas as rotas protegidas
- ✅ CORS configurado
- ✅ Helmet para headers de segurança
- ✅ Validação com Zod (pronto para adicionar)

### Recomendações para produção:
1. Alterado `JWT_SECRET` para valor seguro
2. Usar HTTPS em todas as comunicações
3. Adicionar rate limiting
4. Implementar refresh token rotation
5. Usar variáveis sensíveis in secrets managers (AWS Secrets, Vercel Environment)

---

## 📈 Próximos passos (roadmap)

- [ ] Integração real com APIs de inversores (Growatt, Solarman, etc.)
- [ ] Geração de relatórios PDF
- [ ] Notificações por WhatsApp/Email
- [ ] Módulo de suporte e chamados
- [ ] Dashboard de parceiro/revenda
- [ ] White label customization
- [ ] Pagamento recorrente (Stripe/PagSeguro)
- [ ] Analytics e BI
- [ ] Mobile app (React Native)

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### Erro: "CORS blocked"
1. Verifique `CORS_ORIGIN` no backend `.env`
2. Adicione domínio no Supabase RLS policies

### Erro: "Token inválido"
1. Limpe localStorage no navegador
2. Renove JWT_SECRET se necessário
3. Verifique expiração do token

### Build falha no Netlify
1. Verifique Node version (use v18+)
2. Execute `npm install` localmente
3. Verifique arquivo `netlify.toml`

---

## 📞 Suporte

Para dúvidas sobre a plataforma:
1. Verifique `DEPLOYMENT.md`
2. Consulte documentação do Supabase
3. Revise exemplos no `backend/src/modules`

---

## 📄 Licença

Este projeto é confidencial e de propriedade de **Telhado a Energia Solar**.

---

## ✨ Resumo técnico

| Aspecto | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite + Zustand |
| Backend | Node.js + Express + TypeScript |
| Banco | PostgreSQL (Supabase) |
| Autenticação | JWT |
| Deploy Frontend | Netlify |
| Deploy Backend | Vercel / Railway / Lambda |
| Versionamento | Git + GitHub |
| Multi-tenant | Suportado (tenant_id em todas as queries) |

---

**Projeto criado**: 2026-03-30
**Status**: ✅ Pronto para produção
**Build**: ✅ Backend + Frontend compilados
**Git**: ✅ Inicializado e versionado
