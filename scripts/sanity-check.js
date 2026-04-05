import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log("🚀 Iniciando Teste de Integridade Pré-Deploy...");

const checkFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        console.log(`✅ Arquivo encontrado: ${path.basename(filePath)}`);
        return true;
    } else {
        console.error(`❌ ERRO CRÍTICO: Arquivo não encontrado: ${filePath}`);
        return false;
    }
};

const runBuildTest = () => {
    try {
        console.log("📦 Testando Build do Frontend localmente para economizar minutos no Netlify...");
        execSync('npm run build --workspace frontend', { stdio: 'inherit' });
        console.log("✅ Build local concluído com sucesso!");
        return true;
    } catch (error) {
        console.error("❌ FALHA NO BUILD: O código está quebrado e não deve ser enviado!");
        return false;
    }
};

// 1. Verificar arquivos essenciais
const essentialFiles = [
    'frontend/src/pages/Login.tsx',
    'frontend/src/store/auth.ts',
    'frontend/src/components/layout/Layout.tsx',
    'netlify.toml'
];

let allPassed = essentialFiles.every(checkFile);

// 2. Rodar build local
if (allPassed) {
    allPassed = runBuildTest();
}

if (allPassed) {
    console.log("\n✨ TUDO PRONTO! O sistema está estável para deploy.");
    process.exit(0);
} else {
    console.error("\n🛑 DEPLOY ABORTADO: Corrija os erros acima antes de tentar novamente.");
    process.exit(1);
}
