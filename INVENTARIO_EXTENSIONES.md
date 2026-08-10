# Inventario y Guía de Uso de Extensiones recomendadas (+30 Extensiones)

Este documento detalla la lista completa de **36 extensiones de VS Code** integradas y configuradas en el proyecto **ExeSistemasWEB** (`.vscode/extensions.json` y `.vscode/settings.json`), organizadas en 4 pilares estratégicos.

---

## 📑 Índice de Pilares

1. [🛠️ Desarrollo y Productividad (11 Extensiones)](#1--desarrollo-y-productividad-11-extensiones)
2. [🛡️ Seguridad, Auditoría y Fugas de Datos (9 Extensiones)](#2--seguridad-auditor%C3%ADa-y-fugas-de-datos-9-extensiones)
3. [⚡ Rendimiento y Optimización de Código (8 Extensiones)](#3--rendimiento-y-optimizaci%C3%B3n-de-c%C3%B3digo-8-extensiones)
4. [🔀 Gestión de Versiones y Git (8 Extensiones)](#4--gesti%C3%B3n-de-versiones-y-git-8-extensiones)

---

## 1. 🛠️ Desarrollo y Productividad (11 Extensiones)

| #   | Extensión ID                         | Nombre / Propósito            | Uso en el Proyecto                                                                           |
| --- | ------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | `dbaeumer.vscode-eslint`             | **ESLint**                    | Analiza en tiempo real errores de sintaxis y reactividad (`react-hooks/rules-of-hooks`).     |
| 2   | `esbenp.prettier-vscode`             | **Prettier - Code Formatter** | Formatea automáticamente el código al guardar (`Format on Save`).                            |
| 3   | `bradlc.vscode-tailwindcss`          | **Tailwind CSS IntelliSense** | Autocompletado de clases, vista previa de colores HSL/HEX y soporte para `cva()` / `cn()`.   |
| 4   | `dsznajder.es7-react-js-snippets`    | **ES7+ React Snippets**       | Generación ultra-rápida de componentes (`rafce`, `tsrfce`, `useContext`, etc.).              |
| 5   | `formulahendry.auto-rename-tag`      | **Auto Rename Tag**           | Renombra automáticamente la etiqueta de cierre al cambiar la de apertura en JSX/HTML.        |
| 6   | `formulahendry.auto-close-tag`       | **Auto Close Tag**            | Cierra automáticamente las etiquetas HTML/JSX al escribir `>`.                               |
| 7   | `christian-kohler.path-intellisense` | **Path IntelliSense**         | Autocompleta rutas de archivos locales en importaciones (`src/components/...`).              |
| 8   | `christian-kohler.npm-intellisense`  | **NPM IntelliSense**          | Autocompleta nombres de paquetes de `node_modules` en sentencias `import`.                   |
| 9   | `vitest.explorer`                    | **Vitest Test Explorer**      | Ejecuta y visualiza el estado de las pruebas unitarias desde la pestaña de Pruebas.          |
| 10  | `yoavbls.pretty-ts-errors`           | **Pretty TypeScript Errors**  | Convierte errores complejos de tipos de TypeScript en bloques formateados y fáciles de leer. |
| 11  | `usernamehw.error-lens`              | **ErrorLens**                 | Muestra los errores y advertencias directamente al final de la línea de código afectada.     |

---

## 2. 🛡️ Seguridad, Auditoría y Fugas de Datos (9 Extensiones)

| #   | Extensión ID                               | Nombre / Propósito     | Uso en el Proyecto                                                                      |
| --- | ------------------------------------------ | ---------------------- | --------------------------------------------------------------------------------------- |
| 12  | `snyk-security.snyk-vulnerability-scanner` | **Snyk Security**      | Escanea librerías npm en búsqueda de vulnerabilidades conocidas (CVEs).                 |
| 13  | `sonarsource.sonarlint-vscode`             | **SonarLint**          | Detecta "code smells", vulnerabilidades de inyección SQL, XSS y problemas OWASP.        |
| 14  | `gitguardian.gitguardian`                  | **GitGuardian**        | Bloquea y alerta si se intentan escribir o commitear API Keys, secret keys o Passwords. |
| 15  | `redhat.vscode-yaml`                       | **Red Hat YAML**       | Valida esquemas de seguridad en archivos `.yaml` y `.yml` (GitHub Actions, Vercel).     |
| 16  | `aquasecurity.trivy-vulnerability-scanner` | **Trivy Scanner**      | Auditoría de seguridad para contenedores, dependencias e infraestructura como código.   |
| 17  | `postman.postman-for-vscode`               | **Postman**            | Prueba y audita endpoints REST, RPCs de Supabase y webhooks de PayPal directamente.     |
| 18  | `supabase.supabase-vscode`                 | **Supabase Extension** | Inspecciona tablas PostgreSQL, esquemas RLS (Row Level Security) y migraciones.         |
| 19  | `mikestead.dotenv`                         | **DotENV Syntax**      | Resalta sintaxis y evita errores en archivos de entorno `.env` y `.env.local`.          |
| 20  | `streetsidesoftware.code-spell-checker`    | **Code Spell Checker** | Evita erratas en nombres de variables, funciones y endpoints que originen bugs.         |

---

## 3. ⚡ Rendimiento y Optimización de Código (8 Extensiones)

| #   | Extensión ID                   | Nombre / Propósito       | Uso en el Proyecto                                                                       |
| --- | ------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------- |
| 21  | `wix.vscode-import-cost`       | **Import Cost**          | Muestra en KB el peso minificado y comprimido (gzip) de cada paquete importado.          |
| 22  | `lokalise.i18n-ally`           | **i18n Ally**            | Analiza la cobertura de traducciones en `react-i18next` y optimiza su carga.             |
| 23  | `csstools.postcss`             | **PostCSS Language**     | Revisa la eficiencia de reglas CSS y Tailwind compiladas para producción.                |
| 24  | `mechatroner.rainbow-csv`      | **Rainbow CSV**          | Permite inspeccionar logs de auditoría y métricas de rendimiento en formato CSV/TSV.     |
| 25  | `pflannery.vscode-versionlens` | **VersionLens**          | Muestra la versión instalada vs la última versión disponible en `package.json`.          |
| 26  | `antfu.iconify`                | **Iconify IntelliSense** | Previsualiza y optimiza iconos en línea reduciendo SVG slop.                             |
| 27  | `eamodio.find-related`         | **Find Related Files**   | Salto inmediato entre componentes React, sus archivos de prueba (`.test.tsx`) y estilos. |
| 28  | `tamasfe.even-better-toml`     | **Even Better TOML**     | Validación de configuraciones TOML de herramientas de bundling.                          |

---

## 4. 🔀 Gestión de Versiones y Git (8 Extensiones)

| #   | Extensión ID                        | Nombre / Propósito       | Uso en el Proyecto                                                                      |
| --- | ----------------------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| 29  | `eamodio.gitlens`                   | **GitLens**              | Muestra culpable por línea (blame), comparación de commits y mapas de calor de cambios. |
| 30  | `mhutchie.git-graph`                | **Git Graph**            | Árbol gráfico de ramas, tags y commits con opciones visuales de rebase y cherry-pick.   |
| 31  | `codezombiai.gitignore`             | **.gitignore Generator** | Ayuda a agregar reglas de ignorado para Node, Vercel, Vite y archivos del sistema.      |
| 32  | `vivxi.vscode-conventional-commits` | **Conventional Commits** | Asistente gráfico para redactar commits estandarizados (`feat:`, `fix:`, `sec:`).       |
| 33  | `github.vscode-pull-request-github` | **GitHub PRs & Issues**  | Revisa Pull Requests y responde a comentarios de GitHub directamente en VS Code.        |
| 34  | `donjayamanne.githistory`           | **Git History**          | Historial visual detallado de modificaciones por archivo a lo largo del tiempo.         |
| 35  | `stef-prazeres.git-rebase-buttons`  | **Git Rebase Buttons**   | Botones gráficos para resolver conflictos de merge de manera intuitiva.                 |
| 36  | `arturojp.git-stash`                | **Git Stash Manager**    | Explora, aplica, guarda y elimina stashes de Git con vista previa de diff.              |

---

## 💡 Cómo Instalar / Activar en VS Code

Al abrir este proyecto en VS Code:

1. Aparecerá una notificación en la esquina inferior derecha: _"¿Desea instalar las extensiones recomendadas para este espacio de trabajo?"_. Haz clic en **Instalar todas**.
2. Alternativamente, abre la pestaña de **Extensiones** (`Ctrl+Shift+X` o `Cmd+Shift+X`), escribe `@recommended` en la barra de búsqueda e instala el paquete completo.

---

## 🚀 Comandos NPM de Apoyo Agregados

- `npm run audit:sec`: Ejecuta auditoría de seguridad de dependencias en consola.
- `npm run check:deps`: Revisa si hay parches o versiones nuevas de paquetes instalados.
- `npm run bundle:analyze`: Compila el proyecto generando un reporte de tamaño de bundle visual.
