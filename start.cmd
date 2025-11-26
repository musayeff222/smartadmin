@echo off
echo ========================================
echo   SmartAdmin - Otomatik Baslatma
echo ========================================
echo.

REM Backend'i yeni bir terminal penceresinde baslat
echo Backend baslatiliyor...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM 3 saniye bekle (backend'in baslamasi icin)
timeout /t 3 /nobreak >nul

REM Frontend'i yeni bir terminal penceresinde baslat
echo Frontend baslatiliyor...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Her iki sunucu da baslatildi!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Sunuculari durdurmak icin terminal pencerelerini kapatin.
echo.
pause


