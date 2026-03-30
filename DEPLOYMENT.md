# GitHub Setup

1. Inicializar repositório:
```bash
cd "c:\Users\YASTH\Desktop\Telhado a Energia Solar API"
git init
git config user.email "seu-email@example.com"
git config user.name "Seu Nome"
git add .
git commit -m "Initial commit: Solar SaaS platform with client panel"
git branch -M main
```

2. No GitHub, criar repositório sem README, depois:
```bash
git remote add origin https://github.com/SEU_USER/solar-saas-client.git
git push -u origin main
```

# Netlify Setup

1. **Conecte a conta do Netlify** com o GitHub.
2. **Clique em "New site from Git"** e selecione o repositório.
3. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. **Adicione variáveis de ambiente** em "Site settings" → "Build & deploy" → "Environment":
   - `BACKEND_URL`: URL da API quando publicada
   - `VITE_API_BASE_URL`: `/api` ou URL produção

# Supabase Setup

1. Criar projeto em https://supabase.com
2. Copiar as credenciais do projeto
3. Executar SQL do arquivo `supabase/schema.sql` no SQL Editor do painel Supabase
4. Adicionar variáveis de ambiente no `.env` do seu projeto

# Executar localmente

```bash
# Instalar dependências
npm install

# Iniciar frontend e backend
npm run dev

# Backend: http://localhost:4000/api
# Frontend: http://localhost:5173
# Login: qualquer email/senha (demo)
```

# Deploy Preview

1. Faça push para GitHub
2. Netlify detecta automaticamente e faz deploy
3. Backend precisa de serverless (considere Vercel ou Railway para Node.js)

# Estrutura do projeto

- `/backend` — API Express com autenticação JWT
- `/frontend` — Interface React + TypeScript
- `/supabase/schema.sql` — Banco de dados
- `/netlify.toml` — Configurações do Netlify
- `.env.example` — Variáveis necessárias
