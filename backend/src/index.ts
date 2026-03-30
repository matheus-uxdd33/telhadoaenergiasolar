import "dotenv/config";
import app from "./app";
import { hasSupabaseEnv } from "./database/supabase";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}/api`);
  console.log(
    hasSupabaseEnv
      ? "🔐 Supabase Auth configurado"
      : "⚠️ Supabase não configurado: preencha o arquivo .env para autenticação real"
  );
});
