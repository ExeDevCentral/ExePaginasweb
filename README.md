<div align="center">
  <img src="public/logo.webp" alt="ExeSistemasWEB Logo" width="90" height="90" style="border-radius: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(6,182,212,0.3);" />

# ⚡ ExeSistemasWEB — Arquitectura de Software & Plataforma SaaS Multi-Tenant

  <p align="center">
    <strong>Plataforma SaaS B2B de ingeniería de software a medida y desarrollo web boutique. Construida para empresas y profesionales que exigen control absoluto de su infraestructura, máxima seguridad de datos y cero dependencias de agencias intermediarias.</strong>
  </p>

  <p align="center">
    <em>Autoría directa y arquitectura por <strong>Exequiel Echevarría</strong> (Software & Web Architect)<br>Alcance Global: Europa · EE. UU. · Sudamérica · China · Australia</em>
  </p>

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_Postgres_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-183_Passed_Tests-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev)
[![CI](https://img.shields.io/github/actions/workflow/status/ExeDevCentral/ExePaginasweb/verify.yml?label=CI&style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/ExeDevCentral/ExePaginasweb/actions)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://exepaginasweb.com)
[![License](https://img.shields.io/badge/Propiedad-100%25_Código_Tuyo-10B981?style=for-the-badge)](LICENSE)

</div>

---

## 🧭 Propuesta de Valor y Filosofía de Ingeniería

> *"Construimos software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Seguridad máxima, privacidad blindada y código 100% tuyo: control total, cero dependencias."*

### Los 4 Principios de Ingeniería Real (Matt Pocock / John Ousterhout)

1. **Identidad & Alineación Directa:** Autoría directa de **Exequiel Echevarría**. Sin intermediarios comerciales, sin cuentas offshore de revendedores, sin código inflado de plantillas comerciales ni *vibe coding* no verificado.
2. **Vocabulario Ubicuo:** Adherencia estricta al modelo de dominio formal definido en [GLOSSARY.md](GLOSSARY.md) y [CONTEXT.md](CONTEXT.md). Cada entidad, endpoint y evento responde a términos no negociables del negocio.
3. **Calidad & Robustez Inquebrantable:**
   - **TDD (Test-Driven Development):** 183 tests automatizados pasando en Vitest cubriendo flujos transaccionales y de seguridad.
   - **BigInt Monetario:** Los valores monetarios se gestionan exclusivamente en unidades mínimas enteras de 64 bits (`BigInt` en centavos), eliminando errores de punto flotante en facturación.
   - **Tipado Estricto de Extremo a Extremo:** Cero errores de compilación (`tsc --noEmit`).
4. **Módulos Profundos (Deep Modules):** Interfaces públicas compactas y limpias que encapsulan internamente una alta potencia funcional, resiliencia y seguridad.

---

## 💎 Innovaciones de Frontend & Experiencia de Usuario (UI/UX 60-144 FPS)

### 1. Botón Cybernetic HUD (`HudButton`)
- **Estética Neo-Militar Cyberpunk:** Silueta poligonal recortada mediante `clip-path` con chaflanes simétricos a 45°.
- **Gradiente Perimetral Dual:** Borde exterior con degradado cian neón (`#22d3ee`) y violeta eléctrico (`#a855f7`).
- **Haz de Barrido Lumínico (`scan-beam`):** Animación de escaneo de alta velocidad con gradiente rasante semitransparente.
- **Efecto de Desencriptación Matrix (`data-scramble`):** Algoritmo que cicla caracteres criptográficos en hover hasta reconstituir el texto original de forma interactiva.
- **Micro-Compresión Táctil:** Respuesta háptica visual en `active: scale(0.97)` para retroalimentación instantánea al click o tap.

### 2. Esfera 3D Holográfica de Glifos (`OptimusGlyphSphere`)
- **Delta-Time Adaptive:** Renderizado dinámico a 60-144 FPS (optimizado para pantallas ProMotion y gaming de alta tasa de refresco).
- **Paralaje Magnético de 2 Ejes:** Inclinación reactiva en tiempo real al vector del cursor y velocidad del puntero.
- **Física de Inercia y Fricción ("Fling & Throw"):** Arrastre táctil y con mouse que transfiere aceleración y desacelera mediante fricción exponencial natural.
- **Ultra-HD Retina (DPR 3.0):** Soporte de escalado de dispositivo hasta 3x para nitidez absoluta en pantallas de alta densidad.
- **Iluminación Especular:** Brillo en media luna superior y halo de vacío dinámico con partículas cuánticas flotantes.

### 3. Experiencia Móvil Resumida de 2 Secciones (`MobileLandingView`)
- **Sintetizada para Máxima Conversión:** Diseñada específicamente para dispositivos móviles con viewport menor a 768px (`block md:hidden`).
- **Sección 1 — Hero Compacto:** Esfera 3D interactiva táctil con rotación gestual, badge de disponibilidad en tiempo real y propuesta de valor directa.
- **Sección 2 — Soluciones Clave & Contacto Express:**
  - Comparativa contundente de **1 Solo Pago (Propiedad Total)** frente a la cuota cautiva perpetua de agencias tradicionales.
  - Tarjeta de contacto directo con botón de WhatsApp express a 1 toque con mensaje precargado.

### 4. Cotizador de Software en Tiempo Real
- **Wizard Interactivo de 4 Pasos:** Selección modular de tipo de sistema (Landing, E-commerce, SaaS, Turnero/ERP), volumen de tráfico, integraciones requeridas y plazo deseado.
- **Cálculo Transparente Instantáneo:** Estimación en tiempo real de presupuesto e inversión sin formularios ocultos.

### 5. Liquid Island & Action Sheet de Conversión
- **Barra de Navegación Flotante:** Refracción líquida SVG, luz rasante superior (`inset 0 1px 1px rgba(255,255,255,0.2)`) y blur perimetral.
- **Disponibilidad en Vivo:** Indicador `DISPONIBLE` con pulso luminoso en verde esmeralda.
- **Action Sheet Móvil:** Drawer ergonómico con avatar del autor y accesos rápidos de contacto.

### 6. Sistema Dual de Temas & Soporte i18n
- **Dual Themes:** Modo Dark Cyberpunk Absoluto (`#030712`) y Modo Crema Editorial (`#FDF8F3`).
- **Internacionalización en 7 Idiomas:** Español, Inglés, Alemán, Francés, Árabe (RTL), Portugués de Brasil y Chino Simplificado.

---

## 🏛️ Arquitectura del Sistema

```
                            [ USUARIO / NAVEGADOR ]
                                       │
                          [ Vercel Edge Network ]
                                       │
             ┌─────────────────────────┴─────────────────────────┐
             ▼                                                   ▼
  ┌──────────────────────┐                           ┌──────────────────────┐
  │  Next.js App Router  │                           │   Serverless API     │
  │  (Turbopack + SSR)   │                           │   Route Handlers     │
  ├──────────────────────┤                           ├──────────────────────┤
  │ • Landing Page (/)   │                           │ • /api/chat (Groq/AI)│
  │ • Tienda (/tienda)   │                           │ • /api/contact       │
  │ • Cotizador          │                           │ • /api/paypal-webhook│
  │ • Dashboard Multi    │                           │ • /api/webhooks/resend│
  │ • Login Aurora 3D    │                           │ • /api/register-trans│
  └──────────┬───────────┘                           └──────────┬───────────┘
             │                                                  │
             └─────────────────────────┬────────────────────────┘
                                       ▼
                         ┌───────────────────────────┐
                         │   Supabase Cloud Platform │
                         │  (PostgreSQL 15 + SSR)    │
                         ├───────────────────────────┤
                         │ • Row Level Security (RLS)│
                         │ • 27 SQL Migrations       │
                         │ • Stored Procedures (RPC) │
                         │ • Auth (OAuth + PKCE)     │
                         │ • Realtime & Triggers     │
                         └───────────────────────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           ▼                           ▼                           ▼
 ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
 │  Groq Cloud LLM  │        │   Resend + Svix  │        │  PayPal Sandbox  │
 │ (Streaming Chat) │        │ (Transac. Emails)│        │ & Live Webhooks  │
 └──────────────────┘        └──────────────────┘        └──────────────────┘
```

---

## ⚖️ Propiedad Real vs Alquiler Cautivo

| Dimensión | Enfoque ExeSistemasWEB (1 Solo Pago) | Agencias Tradicionales / SaaS Enlatado |
| :--- | :--- | :--- |
| **Titularidad del Código** | **100% Tuyo:** Entrega completa del repositorio, bases de datos y credenciales. | Código retenido o plantillas cerradas sin acceso a infraestructura. |
| **Modelo Financiero** | Inversión transparente de desarrollo único. Sin mensualidades forzadas. | Cuota mensual eterna; si dejás de pagar, tu sistema se apaga. |
| **Alojamiento & Nube** | Desplegable en tu propia infraestructura (Vercel, AWS, Cloudflare, VPS propio). | Servidores cautivos de la agencia con sobreprecio mensual. |
| **Interlocutor Técnico** | Contacto y arquitectura directa con **Exequiel Echevarría**. | Ejecutivos de cuentas comerciales sin conocimiento técnico de código. |
| **Escalabilidad** | Base de código limpia en TypeScript con arquitectura modular y tests. | Plugins obsoletos, dependencias pesadas y cuellos de botella. |

---

## 📁 Estructura del Proyecto

```
ExePaginasweb/
├── app/                          # Next.js App Router (Páginas y Route Handlers)
│   ├── api/                      # Route Handlers del Backend
│   │   ├── chat/                 # Motor LLM de streaming con captura de tickets EXE-CHT
│   │   ├── check-admin/          # Validación de roles administrativos vía RPC
│   │   ├── contact/              # Procesador de contactos con tickets EXE-CNT y Resend
│   │   ├── paypal-webhook/       # Ingesta de webhooks de PayPal y conciliación de facturas
│   │   ├── register-transfer/    # Registro de pagos por transferencia bancaria
│   │   ├── send-verification/    # Envío de códigos de seguridad por email
│   │   └── webhooks/resend/      # Receiver Svix para telemetría de emails
│   ├── auth/callback/            # Receptor de callbacks OAuth de Supabase
│   ├── cotizador/                # Página interactiva de cotización de software
│   ├── dashboard/                # Panel de control SaaS Multi-Tenant
│   ├── login/                    # Pantalla de autenticación con Aurora y Three.js
│   ├── privacidad/               # Políticas de privacidad conformes a normativas
│   ├── terminos/                 # Términos y condiciones del servicio
│   ├── test-preview/             # Vista previa de plantillas/maquetas
│   ├── tienda/                   # Catálogo de servicios y pasarela de pago
│   ├── layout.tsx                # Root layout con providers (Theme, i18n, Analytics)
│   └── page.tsx                  # Landing principal (Desktop + MobileLandingView)
│
├── src/
│   ├── components/               # Componentes UI Modulares
│   │   ├── Hero/                 # Hero principal, esferas 3D y badges
│   │   ├── Mobile/               # MobileLandingView (versión ultra-resumida de 2 secciones)
│   │   ├── dashboard/            # Vistas y paneles (Dashboard shell, Immobilizer, Onboarding)
│   │   ├── store/                # PlanCard 3D, CheckoutModal, TransferInstructions
│   │   ├── layout/               # Liquid Island Header, Footer, LanguageSwitcher, ThemeToggle
│   │   ├── Effects/              # OptimusGlyphSphere, Canvas Aurora, Three.js Geometries
│   │   └── shared/               # HudButton (Neo-Militar Cyberpunk), Modales, Toasters
│   ├── core/                     # Lógica de Dominio y Capa de Infraestructura
│   │   ├── domain/               # Motores de negocio, entidades, repositorios (ports) y servicios
│   │   │   ├── auth/             # Política de contraseñas y validaciones de seguridad
│   │   │   ├── financial/        # Motor financiero, facturación BigInt y comisiones
│   │   │   ├── onboarding/       # Onboarding de workspaces (slug, trial, grupos)
│   │   │   └── repositories/     # Interfaces de repositorio (IAuth, ITenant, ICliente...)
│   │   ├── infra/                # Adapters de infraestructura
│   │   │   ├── repositories/     # Implementaciones Supabase + fakes InMemory (tests)
│   │   │   └── supabase/         # Cliente Supabase tipado
│   │   ├── auth/                 # Contexto de sesión, guards y resolutor de roles
│   │   ├── i18n/                 # Diccionarios de idiomas (7 locales) y configuración
│   │   ├── theme/                # ThemeContext y modo oscuro
│   │   └── utils/                # Utilidades de WhatsApp oficial, sanitización y errores
│   └── hooks/                    # Custom hooks reactivos (useDashboard, useTenant, etc.)
│
├── supabase/                     # Configuración de Base de Datos
│   ├── migrations/               # 27 migraciones SQL versionadas
│   ├── seed.sql                  # Datos semilla para pruebas locales
│   └── config.toml               # Configuración del entorno Supabase
│
├── tests/                        # Suite de Pruebas Automatizadas (Vitest)
│   ├── api/                      # Tests de integración de Route Handlers y Webhooks
│   └── e2e-units/                # Tests de Dashboard, auth, mobile responsive y seguridad
│
├── docs/                         # Documentación Técnica y Arquitectónica
│   ├── adr/                      # Architecture Decision Records (0001 a 0006)
│   ├── agents/                   # Guías de triaje y domain context para agentes IA
│   └── context/                  # Modelo de dominio formal y ubiquitous language
│
└── web-automation-cli/           # CLI autónoma para automatización de workflows
```

---

## 🛠️ Tech Stack Detallado

| Capa / Módulo | Tecnologías y Librerías | Propósito |
| :--- | :--- | :--- |
| **Framework Base** | `Next.js 16.3 (App Router, Turbopack)` | SSR, ISR, Server Components y Edge Routing |
| **Librería UI** | `React 18.3` | Renderizado reactivo y gestión declarativa |
| **Lenguaje** | `TypeScript 5.7 (Strict Mode)` | Tipado estricto de extremo a extremo sin `@ts-ignore` |
| **Estilos & CSS** | `TailwindCSS 3.4 + PostCSS + CSS Vars` | Tokens de diseño adaptativos, glassmorphism y paleta dual |
| **Animaciones & Motion** | `Framer Motion 12 + GSAP 3.15 + Lenis` | Micro-animaciones a 60-144 FPS y scroll suave |
| **Gráficos 3D & Canvas** | `Three.js 0.173 + HTML5 2D Canvas` | Renderizado de esferas holográficas y shaders reactivos |
| **Base de Datos & Auth** | `Supabase (PostgreSQL 15, Auth PKCE, RLS)` | Persistencia relacional, seguridad multi-tenant y sesiones |
| **Manejo de Estado** | `@tanstack/react-query 5.100` | Caché asíncrona, revalidación y sincronización en segundo plano |
| **Validación de Datos** | `Zod 4.4` | Esquemas de validación estricta en runtime |
| **Testing Automatizado** | `Vitest 4.1.6 + Testing Library` | Suite de pruebas unitarias y de integración (**183 tests**) |
| **Emails & Webhooks** | `Resend API + Svix 1.96` | Correos transaccionales con verificación criptográfica SHA-256 |
| **Pasarela de Pagos** | `PayPal SDK + Webhooks` | Conciliación de suscripciones y facturación automática |
| **Telemetría & Monitoreo** | `@vercel/analytics + @vercel/speed-insights` | Core Web Vitals en tiempo real y diagnóstico de rendimiento |

---

## 📊 Matriz de Tests y Calidad de Software

La suite de pruebas automatizada se ejecuta mediante **Vitest**, asegurando cero regresiones en lógica crítica de negocio:

```
 ✓ tests/api/audit/system-audit.test.js           (10 tests)
 ✓ tests/api/contact.test.ts                     (6 tests)
 ✓ tests/api/chat.test.ts                        (5 tests)
 ✓ tests/api/webhooks-resend.test.ts             (5 tests)
 ✓ tests/api/paypal-webhook.test.ts              (4 tests)
 ✓ tests/e2e-units/dashboard.test.tsx            (8 tests)
 ✓ tests/e2e-units/mobile-landing.test.tsx       (6 tests)
 ✓ src/core/domain/financial/financial.test.ts   (12 tests)
 ✓ src/core/domain/tenant/tenant.test.ts         (10 tests)
 ✓ src/core/domain/auth/authPolicy.test.ts       (14 tests)
 ✓ src/core/domain/onboarding/onboarding.test.ts (8 tests)
 ✓ src/core/domain/reservations/collision.test.ts(9 tests)
 ✓ src/core/domain/availability/slots.test.ts    (7 tests)
 ✓ src/core/infra/repositories/repositories.test (18 tests)
 ✓ src/components/store/CheckoutModal.test.tsx   (2 tests)
 ...

 Test Files  30 passed (30)
      Tests  183 passed (183)
   Duration  < 3.0s
```

---

## 🌐 Endpoints de la API Backend

| Método | Endpoint | Descripción | Autenticación / Seguridad |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Asistente IA con streaming y emisión de ticket `EXE-CHT` | Pública / Rate Limiting por IP |
| `POST` | `/api/contact` | Recepción de consultas, confirmación automática y ticket `EXE-CNT` | Pública / Sanitizada con Zod |
| `POST` | `/api/webhooks/resend` | Ingesta de eventos de email (entregas, rebotes, quejas) | Criptográfica Svix (SHA-256) |
| `POST` | `/api/paypal-webhook` | Procesamiento de pagos, conciliación y emisión de facturas | Firma de Webhook de PayPal |
| `POST` | `/api/register-transfer`| Registro de transferencias bancarias y comprobantes | Pública / Validada |
| `GET`  | `/api/check-admin` | Verificación de privilegios administrativos vía RPC | Sesión Supabase autenticada |
| `POST` | `/api/send-verification`| Generación y envío de códigos de verificación OTP | Token de seguridad interno |

---

## 🚀 Puesta en Marcha (Guía Rápida)

### 1. Clonar el repositorio

```bash
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz tomando como base `.env.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Inteligencia Artificial (LLM)
GROQ_API_KEY=gsk_tu_clave_de_groq
GEMINI_API_KEY=tu_clave_de_gemini

# Resend (Emails Transaccionales)
RESEND_API_KEY=re_tu_clave_resend
RESEND_FROM_EMAIL=Contacto@exepaginasweb.com
RESEND_WEBHOOK_SIGNING_SECRET=whsec_tu_secreto_svix

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_secret
PAYPAL_WEBHOOK_ID=tu_paypal_webhook_id
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible de inmediato en `http://localhost:3000`.

### 5. Comandos de Verificación de Calidad

```bash
# Ejecutar suite completa de pruebas unitarias y de integración (183 tests)
npm test

# Verificación estricta de tipos de TypeScript (0 errores)
npx tsc --noEmit

# Análisis estático y formateo de código
npm run lint
npm run format

# Compilación de producción optimizada
npm run build
```

---

## 🤝 Contacto Directo & Desarrollo de Software a Medida

**Exequiel Echevarría — Software & Web Architect**  
*ExeDevCentral · Digital Acceleration & Cloud Systems*

- 🌐 **Sitio Web Oficial:** [exepaginasweb.com](https://exepaginasweb.com)
- 📱 **WhatsApp Oficial:** [+54 9 341 6874786](https://wa.me/5493416874786)
- 📧 **Email Directo:** [Contacto@exepaginasweb.com](mailto:Contacto@exepaginasweb.com) · [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com)
- 💻 **GitHub:** [@ExeDevCentral](https://github.com/ExeDevCentral)
- 📍 **Alcance Global:** Proyectos activos y soporte en Europa, Estados Unidos, Sudamérica, China y Australia.

---

<div align="center">
  <sub>Construido con precisión técnica y estándares de ingeniería real por <strong>Exequiel Echevarría</strong>. Todos los derechos reservados.</sub>
</div>
