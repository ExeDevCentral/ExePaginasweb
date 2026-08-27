# 🤖 Web Automation CLI — Developer Tooling

Herramienta de línea de comandos en Node.js/TypeScript para automatizar tareas de scaffolding, generación de componentes, análisis de bundle y despliegues asistidos en el ecosistema de **ExeSistemasWEB**.

---

## 📦 Instalación y Compilación Local

Dentro del directorio `web-automation-cli`:

```bash
cd web-automation-cli
npm install
npm run build
```

---

## ⚡ Comandos Disponibles

```bash
# Mostrar ayuda general y comandos
node dist/index.js --help

# Crear un nuevo proyecto o módulo
node dist/index.js create-project --name mi-modulo --template modern-saas

# Generar un componente con estilos y tests automatizados
node dist/index.js add-component MiTarjeta --with-styles --with-tests

# Analizar rendimiento y bundle size
node dist/index.js analyze --type performance

# Desplegar a plataforma configurada
node dist/index.js deploy vercel --prod
```

---

## 🛠️ Tecnologías

- **Commander.js:** Motor de CLI e interfaz de comandos.
- **TypeScript:** Tipado e inferencia de argumentos.
- **Node.js:** Runtime de ejecución.
