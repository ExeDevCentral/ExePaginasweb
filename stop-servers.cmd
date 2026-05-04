@echo off
echo ========================================
echo   Deteniendo Servidores ExeSistemasWEB
echo ========================================

echo Deteniendo Backend (Puerto 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a 2>nul

echo Deteniendo Frontend (Puerto 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a 2>nul

echo.
echo Servidores apagados correctamente.
pause