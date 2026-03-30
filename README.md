# Plataforma Solar SaaS — Painel do Cliente

Projeto full-stack com **React + TypeScript** no frontend, **Node.js + Express + TypeScript** no backend, integração preparada para **Supabase**, deploy em **Netlify** e fluxo pronto para **GitHub**.

## Estrutura

- `frontend/` — painel do cliente
- `backend/` — API REST multi-tenant
- `netlify/functions/api.ts` — adaptação serverless para produção no Netlify
- `supabase/schema.sql` — base inicial do banco de dados

## Execução local

```bash
cp .env.example .env
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api`
- Login demo: `client@solarsaas.com` / `demo123`

## Deploy

1. Suba este repositório para o GitHub.
2. Conecte o repositório ao Netlify.
3. Configure as variáveis do `.env.example` no painel do Netlify.
4. Crie o banco no Supabase e rode `supabase/schema.sql`.

## Módulos disponíveis

- Dashboard
- Meu Sistema
- Alertas
- Relatórios
- Faturas
- Suporte
- Perfil
- Integrações
