@echo off
title B2B CRM and ERP Production Launcher
echo =========================================================
echo  B2B CRM and ERP Platforma - Production Ishga Tushirish
echo =========================================================
echo.

echo [1/3] Docker konteynerlarini orqa fonda qurish va yoqish...
docker-compose up --build -d
if %ERRORLEVEL% neq 0 (
    echo.
    echo [XATOLIK] Docker Desktop ishga tushmadi!
    echo Iltimos, Docker Desktop dasturini yoqing va qayta urinib ko'ring.
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Yangi oynada Ngrok HTTPS tunnelini boshlash...
start cmd /k "title Ngrok HTTPS Tunnel && echo Ngrok tunnel ishga tushmoqda... && ngrok http 3000"

echo.
echo [3/3] Konteyner loglarini kuzatish (chiqish uchun Ctrl+C bosing)...
echo =========================================================
docker-compose logs -f
