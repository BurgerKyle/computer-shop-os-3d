@echo off
REM Startup Batch Script to Launch Computer Shop OS 3D in Locked Kiosk Mode
cd /d "%~dp0\.."

REM Check if Electron is installed locally or via npx
where electron >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  start "" electron src/electron/kiosk-main.js
) else (
  REM Fallback to high-performance Chrome/Edge App Mode with locked flags
  start "" node server.js
  timeout /t 2 /nobreak >nul
  start "" msedge.exe --kiosk http://localhost:5173 --edge-kiosk-type=fullscreen --no-first-run --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI
)
