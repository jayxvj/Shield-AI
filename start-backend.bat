@echo off
:: Shield-AI Backend Launcher
:: This script must be run as Administrator for live packet capture.

:: Check for admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  ============================================================
    echo   ERROR: This script must be run as Administrator.
    echo   Right-click this file and choose "Run as administrator".
    echo  ============================================================
    echo.
    pause
    exit /b 1
)

title Shield-AI Backend (Admin)
cd /d C:\Users\User\Documents\Shield-AI

echo.
echo  ============================================================
echo   Shield-AI Backend Starting...
echo   API:      http://localhost:8000
echo   Docs:     http://localhost:8000/docs
echo   Health:   http://localhost:8000/health
echo  ============================================================
echo.

venv\Scripts\uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

pause
