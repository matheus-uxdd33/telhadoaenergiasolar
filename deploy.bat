@echo off
echo ==========================================
echo   Telhado a Energia Solar - Deploy
echo   github.com/matheus-uxdd33/telhadoaenergiasolar
echo ==========================================
echo.

REM Gera timestamp para o commit
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set DATA=%%c-%%b-%%a
for /f "tokens=1 delims= " %%a in ('time /t') do set HORA=%%a

echo 1. Adicionando todas as alteracoes...
git add .

echo 2. Criando commit...
git commit -m "release(%DATA% %HORA%): Solar SaaS v2 - Wizard Premium + Neural Dashboard + Backend Integration"

echo.
echo 3. Enviando para GitHub e Netlify...
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao enviar. Verifique credenciais Git / token GitHub.
    echo Tente: git config --global credential.helper manager
) else (
    echo.
    echo [SUCESSO] Codigo atualizado no GitHub!
    echo A Netlify esta fazendo o deploy automatico agora.
    echo Acesse: https://app.netlify.com para acompanhar o progresso.
)
echo.
pause
