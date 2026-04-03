@echo off
echo ==========================================
echo   Solar SaaS - Deploy Assist
echo ==========================================
echo.
echo.
echo 1. Salvando alterações locais...
git add .
git commit -m "Update: Solar SaaS schema fixes and Brave integration"
echo.
echo 2. Enviando para o GitHub...
echo Local: matheus-uxdd33/telhadoaenergiasolar
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Ocorreu um problema ao enviar. 
    echo Verifique se voce esta logado no Git ou se o GitHub pediu senha.
) else (
    echo.
    echo [SUCESSO] Alterações enviadas! 
    echo A Netlify deve iniciar o deploy do novo design automaticamente agora.
)
echo.
pause
