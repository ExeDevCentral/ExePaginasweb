@echo off
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
  taskkill /F /PID %%a 2>nul
)
timeout /t 1 /nobreak >nul
cd /d "c:\Users\exeme\Desktop\ExepaginasW"
npm run api

