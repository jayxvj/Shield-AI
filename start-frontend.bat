@echo off
:: Shield-AI Frontend Launcher
:: No admin rights needed for this one.

title Shield-AI Frontend
cd /d C:\Users\User\Documents\Shield-AI\frontend

echo.
echo  ============================================================
echo   Shield-AI Frontend Starting...
echo   Dashboard:       http://localhost:3000
echo   Live Monitoring: http://localhost:3000/live-monitoring
echo  ============================================================
echo.

npm run dev

pause
