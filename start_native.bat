@echo off
title B2B CRM and ERP Native Launcher
echo =========================================================
echo  B2B CRM and ERP Platforma - Native (Docker-siz) Ishga Tushirish
echo =========================================================
echo.

echo [1/3] Loyihani production uchun qurish (build)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [XATOLIK] Loyihani qurishda xatolik yuz berdi! Iltimos, dependency-larni tekshiring.
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Yangi oynada Ngrok HTTPS tunnelini boshlash...
start cmd /k "title Ngrok HTTPS Tunnel && echo Ngrok tunnel ishga tushmoqda... && ngrok http 3000"

echo.
echo [3/3] Tizimni production rejimida ishga tushirish...
echo =========================================================
call npm run start
