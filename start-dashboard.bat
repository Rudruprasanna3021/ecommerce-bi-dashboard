@echo off
title ShopPulse BI Dashboard
cd /d "%~dp0"
set PATH=C:\Users\prasa\AppData\Local\Programs\nodejs;%PATH%
echo ========================================================
echo   Starting ShopPulse BI Dashboard...
echo ========================================================
echo.
echo Opening in your default browser...
start http://localhost:5173
echo.
npm run dev
pause
