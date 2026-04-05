@echo off
echo ==========================================
echo   SOLAR SAAS - ESCUDO DE DEPLOY V3
echo   github.com/matheus-uxdd33/telhadoaenergiasolar
echo ==========================================
echo.

echo 🔍 PASSO 1: Rodando Testes de Integridade Locais...
node scripts/sanity-check.js
if %errorlevel% neq 0 (
    echo.
    echo 🛑 [ERRO] O deploy foi bloqueado porque o sistema nao passou nos testes.
    echo Verifique os erros acima antes de tentar novamente.
    pause
    exit /b %errorlevel%
)

REM Gera timestamp para o commit
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set DATA=%%c-%%b-%%a
for /f "tokens=1 delims= " %%a in ('time /t') do set HORA=%%a

echo.
echo 🚀 PASSO 2: Sincronizando com GitHub...
git add .
git commit -m "release(%DATA% %HORA%): Solar SaaS v2 - Deploy Seguro + Sanity Check"

git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ❌ [ERRO] Falha ao enviar para o GitHub.
    pause
) else (
    echo.
    echo ✨ [SUCESSO] Codigo enviado com segurança!
    echo 🌐 O Netlify iniciara o build otimizado agora.
    echo 💡 DICA: Se o Netlify continuar bloqueado, use o link do Vercel como backup.
)

echo.
pause
