#!/usr/bin/env bash

# setup.sh - Script de automatización de Infraestructura como Código (IaC)
# Para React + Vite + Supabase Local Dev Environment con Google OAuth

# Configuración de colores para salida premium en terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color
BOLD='\033[1m'

clear

echo -e "${BLUE}${BOLD}======================================================================${NC}"
echo -e "${BLUE}${BOLD}   ___               ____               __            __  __      __  ${NC}"
echo -e "${BLUE}${BOLD}  / _ \___ ___ _____/ / /_  ___ ____ _ / /__ ___  ___/ /_/ /  ___/ /  ${NC}"
echo -e "${BLUE}${BOLD} / , _/ -_) _ \/ __/ _  / |/ / // _ \`/  '_/(_-< / _  / __/ _ \/ _  /   ${NC}"
echo -e "${BLUE}${BOLD}/_/|_|\__/\_,_/\__/_//_/|___/\_,_/\_,_/_/\_\/___/ \_,_/\__/_//_/\_,_/    ${NC}"
echo -e "${BLUE}${BOLD}                                                                      ${NC}"
echo -e "${BLUE}${BOLD}       STUDIO PREMIUM IAAS - SUPABASE & VERCEL SETUP SCRIPT           ${NC}"
echo -e "${BLUE}${BOLD}======================================================================${NC}"
echo ""

# 1. Comprobar herramientas obligatorias
echo -e "${BLUE}[1/6] Validando herramientas del sistema...${NC}"

check_tool() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}ERROR: '$1' no está instalado o no se encuentra en el PATH.${NC}"
    return 1
  fi
  return 0
}

ERRORS=0
check_tool "node" || ERRORS=$((ERRORS+1))
check_tool "npm" || ERRORS=$((ERRORS+1))
check_tool "supabase" || ERRORS=$((ERRORS+1))
check_tool "docker" || {
  echo -e "${YELLOW}ADVERTENCIA: Docker no se detectó o no está ejecutándose. Es obligatorio para iniciar Supabase localmente.${NC}"
}

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}Por favor instala las dependencias faltantes para continuar.${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Todas las herramientas básicas están presentes.${NC}"
echo ""

# 2. Configurar variables de entorno (.env)
echo -e "${BLUE}[2/6] Verificando variables de entorno (.env)...${NC}"
if [ ! -f .env.local ] && [ ! -f .env ]; then
  echo -e "${YELLOW}No se encontró ningún archivo .env.local o .env.${NC}"
  if [ -f .env.example ]; then
    echo -e "Copiando .env.example a .env.local..."
    cp .env.example .env.local
    echo -e "${GREEN}✔ Se creó un archivo base .env.local.${NC}"
  else
    echo -e "Creando un archivo .env.local básico..."
    cat <<EOT > .env.local
# Entorno de Desarrollo Local
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=tu_google_client_id_aca
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=tu_google_client_secret_aca
EOT
    echo -e "${GREEN}✔ Se creó .env.local. Recuerda completarlo con tus credenciales de Google Console.${NC}"
  fi
else
  echo -e "${GREEN}✔ Archivo de variables de entorno detectado.${NC}"
fi
echo ""

# 3. Instalación de dependencias del frontend
echo -e "${BLUE}[3/6] Instalando dependencias de Node.js...${NC}"
npm install
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✔ Dependencias instaladas con éxito.${NC}"
else
  echo -e "${RED}ERROR: La instalación de paquetes de Node falló.${NC}"
  exit 1
fi
echo ""

# 4. Levantar entorno Supabase Local
echo -e "${BLUE}[4/6] Levantando entorno de Supabase (Docker)...${NC}"
# Comprobar si docker daemon está corriendo
if ! docker info &> /dev/null; then
  echo -e "${RED}ERROR: Docker no está en ejecución. Abre Docker Desktop y vuelve a intentarlo.${NC}"
  exit 1
fi

echo -e "Ejecutando 'supabase start'..."
supabase start

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✔ Contenedores de Supabase iniciados con éxito.${NC}"
else
  echo -e "${RED}ERROR: No se pudo iniciar Supabase. Si ya estaba iniciado, continuaremos con las migraciones.${NC}"
fi
echo ""

# 5. Aplicar migraciones y semillas
echo -e "${BLUE}[5/6] Aplicando migraciones y base de datos semilla...${NC}"
echo -e "Ejecutando 'supabase db reset' para aplicar las migraciones ordenadas..."
supabase db reset

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✔ Base de datos reseteada y migraciones aplicadas correctamente.${NC}"
else
  echo -e "${RED}ERROR: La aplicación de las migraciones SQL falló.${NC}"
  exit 1
fi
echo ""

# 6. Mostrar credenciales y resumen
echo -e "${BLUE}[6/6] Entorno local listo y configurado.${NC}"
echo -e "${GREEN}${BOLD}======================================================================${NC}"
echo -e "${GREEN}${BOLD}   ¡ENTORNO DE DESARROLLO Y INFRAESTRUCTURA CONFIGURADA CON ÉXITO!    ${NC}"
echo -e "${GREEN}${BOLD}======================================================================${NC}"
echo ""
echo -e "${BOLD}Direcciones y Consolas locales:${NC}"
echo -e " 👉 ${BOLD}Supabase Studio Dashboard:${NC}  http://localhost:54323"
echo -e " 👉 ${BOLD}API Local Endpoint:${NC}         http://localhost:54321"
echo -e " 👉 ${BOLD}Inbucket (Emails Test):${NC}     http://localhost:54324"
echo ""
echo -e "${YELLOW}${BOLD}Nota Importante sobre Google OAuth:${NC}"
echo -e "Para que el login con Google funcione de forma local:"
echo -e "1. Asegúrate de configurar ${BOLD}SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID${NC} y ${BOLD}SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET${NC}."
echo -e "2. Puedes añadirlas en tu archivo local o en el panel de control de Supabase Studio."
echo ""

# Preguntar si se desea iniciar el servidor de desarrollo Vite inmediatamente
read -p "¿Deseas iniciar el servidor de desarrollo de React Vite ahora mismo? (s/n): " confirm
if [[ $confirm == [sS] || $confirm == [sS][iI] ]]; then
  echo -e "${BLUE}Iniciando 'npm run dev' en el frontend...${NC}"
  npm run dev
else
  echo -e "${GREEN}Configuración completa. Para iniciar la app más tarde ejecuta: ${BOLD}npm run dev${NC}"
fi
