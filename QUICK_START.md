# 📋 Checklist Rápido — Solar SaaS

## ✅ Pré-requisitos

- ✅ Node.js 18+
- ✅ npm ou yarn
- ✅ Git
- ✅ Conta GitHub
- ✅ Conta Netlify (gratuita)
- ✅ Conta Supabase (gratuita)

## 🎯 Ações imediatas

### 1. Local — Testar primeiro
```bash
npm install
npm run dev
# Abre em http://localhost:5173
# Login: qualquer email/senha
```

### 2. GitHub — Versionar
```bash
git remote add origin https://github.com/seu-usuario/solar-saas.git
git push -u origin main
```

### 3. Supabase — Criar banco
1. Criar projeto em supabase.com
2. Copiar credenciais
3. Executar SQL: `supabase/schema.sql`

### 4. Netlify — Deploy frontend
1. Conectar repositório GitHub
2. Build command: `npm run build`
3. Publish: `frontend/dist`
4. Adicionar variáveis de ambiente

### 5. Vercel/Railway — Deploy backend
1. Conectar GitHub
2. Selecionar pasta `backend`
3. Deploy automático

## 🔑 Variáveis de ambiente necessárias

### Backend (.env)
```
PORT=4000
JWT_SECRET=seu-segredo-aqui
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Frontend (.env ou Netlify)
```
VITE_API_BASE_URL=https://sua-api.com/api
```

## 📊 Status atual

| Componente | Status | Localização |
|-----------|--------|-------------|
| Backend | ✅ Pronto | `backend/` |
| Frontend | ✅ Pronto | `frontend/` |
| Database | ✅ Schema pronto | `supabase/schema.sql` |
| Git | ✅ Inicializado | `.git/` |
| Docs | ✅ Completo | `GUIA_COMPLETO.md` |

## 🚀 Deploy (ordem)

1. Push para GitHub ➜ `git push`
2. Supabase pronto ➜ Schema importado
3. Backend deploy ➜ Copiar URL
4. Frontend deploy ➜ Configurar variável `VITE_API_BASE_URL`
5. Testar em produção

## 💡 Dicas

- **Local**: Qualquer email/senha funciona (demo mode)
- **Produção**: Integrar autenticação real (Supabase Auth ou outro)
- **Performance**: Frontend é estático (Netlify é grátis), backend pay-as-you-go
- **Escalabilidade**: Multi-tenant pronto, just add tenant selection UI

## ❓ Próximas funcionalidades

```
[ ] Relatórios / Billing / Suporte
[ ] Integração com APIs de inversores
[ ] Autenticação social (Google, GitHub)
[ ] Push notifications
[ ] Analytics
[ ] Admin dashboard
```

---

**Status**: Pronto para ir online! 🌍
