@echo off
echo ========================================
echo   Iniciando Servidores ExeSistemasWEB
echo ========================================
echo.

REM Verificar que Node.js este instalado
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH
    echo Descarga Node.js desde https://nodejs.org
    pause
    exit /b 1
)

echo Node.js version: 
node --version
echo.

REM Verificar que las dependencias esten instaladas
if not exist "node_modules\express" (
    echo ERROR: Las dependencias no estan instaladas
    echo Ejecutando npm install...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install fallo
        pause
        exit /b 1
    )
)

REM Iniciar backend en una nueva ventana
echo [1/2] Iniciando Backend API...
start "Backend API" cmd /c "cd /d %~dp0 && node api-dev-server.js"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

REM Verificar si el backend inicio
curl -s http://localhost:3000/ >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ADVERTENCIA: El backend podria no haber iniciado correctamente
    echo Verifica la ventana 'Backend API' para ver errores
)

REM Iniciar frontend
echo [2/2] Iniciando Frontend...
start "Frontend" cmd /c "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   Servidores Iniciados!
echo ========================================
echo.
echo - Backend: http://localhost:3000
echo - Frontend: http://localhost:5173
echo.
echo Presiona Ctrl+C en cada ventana para detener los servidores.
echo.
echo Para verificar que funcionan:
echo   - Abri http://localhost:5173 en tu navegador
echo   - El backend responde en http://localhost:3000
echo.