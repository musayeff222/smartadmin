@echo off
echo ========================================
echo   SmartAdmin - Sunuculari Durdurma
echo ========================================
echo.

REM Node.js process'lerini durdur
echo Node.js process'leri durduruluyor...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Tum sunucular durduruldu!
echo.
pause


