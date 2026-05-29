# ⚡ ExeSistemasWEB — Plataforma Web Premium con IA

[![Status](https://img.shields.io/badge/Status-Production-00d4ff?style=flat-square)](https://exepaginasweb.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq_LLM-Active-FF6B6B?style=flat-square&logo=groq)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com)

> **Estudio boutique de sistemas web premium.**  
> Construimos sistemas de software que resuelven cuellos de botella operativos para negocios locales: automatización de reservas, gestión de inventario, optimización de procesos. No hacemos "páginas web", creamos **empleados digitales**.

---

## Tabla de Contenidos

- [¿Qué es?](#qué-es)
- [Stack Tecnológico](#stack-tecnológico)
- [Módulos del Sistema](#módulos-del-sistema)
- [Sistema de Suscripciones](#sistema-de-suscripciones)
- [Portal de Clientes](#portal-de-clientes)
- [Autenticación](#autenticación)
- [APIs de IA](#apis-de-ia)
- [Arquitectura](#arquitectura)
- [Primeros Pasos](#primeros-pasos)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roadmap](#roadmap)

---

## ¿Qué es?

**ExeSistemasWEB** es una Single Page Application full-stack con inteligencia artificial integrada, diseñada para ser el centro digital de negocios locales y servicios profesionales.

Construido con React 18 + TypeScript + Vite, desplegado en Vercel Edge Network, con backend serverless y base de datos PostgreSQL via Supabase.

### Lo que incluye

| Módulo                            | Descripción                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| 🤖 **Chatbot IA**                 | Chat en vivo con Groq LLM (Llama 3.3), streaming palabra por palabra, memoria de contexto |
| 🎨 **Generador de Código por IA** | Subí un diseño → obtené HTML/CSS funcional generado por Groq Vision                       |
| 📧 **Contacto Inteligente**       | Formulario con EmailJS + Resend, validación Zod, rate limiting                            |
| 🧊 **Experiencias 3D**            | Productos y demos interactivos con Three.js / React Three Fiber                           |
| 🏪 **Tienda / Suscripciones**     | Planes de pago mensual con Mercado Pago (ARS)                                             |
| 📊 **Panel de Clientes**          | Dashboard con métricas, historial de pagos, soporte técnico                               |
| 🔐 **Autenticación**              | Login con Google OAuth via Supabase, sesión persistente                                   |
| 🎫 **Sistema de Tickets**         | Soporte técnico integrado con notificaciones                                              |
| ⚖️ **Páginas Legales**            | Términos de Servicio, Política de Privacidad                                              |
| 📱 **PWA Ready**                  | Responsive, manifest, safe-area para notches                                              |

---

## Stack Tecnológico

### Frontend

| Tecnología                | Versión  | Propósito                      |
| ------------------------- | -------- | ------------------------------ |
| **React**                 | 18.3.1   | UI declarativa con hooks       |
| **TypeScript**            | 5.7.3    | Tipado estático estricto       |
| **Vite**                  | 6.2.0    | Build tool + dev server        |
| **TailwindCSS**           | 3.4.17   | CSS utility-first              |
| **Framer Motion**         | 12.4.0   | Animaciones declarativas 60fps |
| **React Router DOM**      | 7.14.2   | Routing SPA con lazy loading   |
| **React Hook Form + Zod** | —        | Formularios type-safe          |
| **TanStack React Query**  | 5.100.14 | Cache y fetching de datos      |
| **date-fns**              | 4.3.0    | Manipulación de fechas         |

### Backend

| Tecnología                      | Propósito                                         |
| ------------------------------- | ------------------------------------------------- |
| **Vercel Serverless Functions** | API endpoints (chat, generate, contact, payments) |
| **Supabase**                    | Base de datos PostgreSQL + Auth + RLS             |
| **Mercado Pago API**            | Pasarela de pagos en ARS                          |
| **Groq Cloud API**              | LLM streaming + Vision                            |
| **EmailJS + Resend**            | Envío de emails                                   |

### DevOps

| Tecnología              | Propósito                                 |
| ----------------------- | ----------------------------------------- |
| **Vercel**              | Hosting, CDN edge, SSL, deploy automático |
| **ESLint + Prettier**   | Linting y formateo                        |
| **Husky + lint-staged** | Git hooks pre-commit                      |
| **Vitest**              | Tests unitarios                           |
| **Supabase CLI**        | Migraciones de base de datos              |

---

## Módulos del Sistema

### 🤖 Chatbot con Streaming (Groq LLM)

- Streaming SSE palabra por palabra desde Llama 3.3-70B
- Memoria contextual (últimos 6 mensajes)
- 4 botones de respuesta rápida predefinidos
- Fallback local con respuestas keyword-based
- Rate limiting por IP (10 requests/min)
- Validación Zod del payload

### 🧊 Experiencias 3D (Three.js + R3F)

- Carga diferida: Three.js (785KB) solo se descarga al hacer clic
- Portales interactivos: inmobiliaria, ecommerce, membresías
- Efectos de partículas y transiciones spring
- Optimizado para móviles

### 🎨 Generación de Código por IA (Groq Vision)

- Subida de imágenes (PNG/JPG/WebP hasta 10MB)
- Generación de HTML/CSS desde imagen
- Syntax highlighting del código generado

### 📧 Sistema de Contacto Dual

- EmailJS (client-side) para máxima velocidad
- Resend (server-side) como respaldo desde webhook
- Fallback local a `messages-local.json`
- Rate limiting: 5 consultas/hora por IP

### 🎫 Sistema de Tickets de Soporte

- Creación de tickets con categorías
- Notificaciones en tiempo real
- Panel de tickets en el dashboard
- Historial de conversaciones

---

## Sistema de Suscripciones

Tres planes en pesos argentinos con pagos via Mercado Pago:

| Plan         | Precio       | Incluye                                                       |
| ------------ | ------------ | ------------------------------------------------------------- |
| **Básico**   | $25.000/mes  | Landing, SSL, Hosting Vercel, Soporte estándar                |
| **Avanzado** | $50.000/mes  | Todo lo básico + BD, Backups, Monitoreo, Soporte 24/7         |
| **Premium**  | $150.000/mes | Todo avanzado + Edge prioritario, 2h dev/mes, Account Manager |

- Pagos únicos mensuales via Mercado Pago (Checkout Pro)
- Webhook de confirmación con actualización automática de suscripción
- Email de confirmación via Resend
- Historial de pagos visible en el dashboard

---

## Portal de Clientes

Cada cliente autenticado tiene un dashboard personalizado según su plan:

| Plan         | Dashboard                                                  |
| ------------ | ---------------------------------------------------------- |
| **Sin plan** | Vista free con preview de planes, botón a tienda           |
| **Básico**   | Métricas de landing, uptime, tickets de soporte            |
| **Avanzado** | Todo básico + métricas de BD, reservas, monitoreo          |
| **Premium**  | Todo avanzado + chart semanal, timelines, perks exclusivos |

### Características del dashboard

- Métricas en vivo con indicadores de rendimiento
- Timeline de actividad del sistema
- Service Pulse Hub (monitoreo de servicios)
- Panel de tickets de soporte con notificaciones
- Historial de pagos y suscripciones
- Vista previa de tiers para administradores

---

## Autenticación

- **Google OAuth** via Supabase Auth
- Flujo PKCE con `detectSessionInUrl`
- Sesión persistente (`localStorage`)
- Role-based access control (admin vs cliente)
- Trigger automático: al registrarse, se crea perfil en tabla `clientes`
- RLS policies: cada usuario ve solo sus datos

### Flujo

1. Usuario hace clic en "Login con Google"
2. Redirige a Google → consentimiento OAuth
3. Vuelve a `/auth/callback` → intercambia código por sesión
4. Redirige a `/dashboard`
5. Trigger `handle_new_user()` crea el registro en `clientes`

---

## APIs de IA

### Groq Cloud

| Modelo                         | Uso                                 | Max Tokens |
| ------------------------------ | ----------------------------------- | ---------- |
| `llama-3.3-70b-versatile`      | Chatbot principal (streaming)       | 400        |
| `llama-3.1-8b-instant`         | Fallback                            | 400        |
| `llama-3.2-11b-vision-preview` | Generación de código desde imágenes | 2000       |

---

## Arquitectura

```
🌐 Usuario (Browser)
      │
      │ (CDN: Vercel Edge Network)
      ├──────────────────────────────────────┐
      │                                      │
      ▼                                      ▼
┌─────────────────────┐          ┌────────────────────────┐
│   React SPA         │          │  Serverless Functions   │
│   (Vite Build)      │─────────▶│  /api/chat              │─────▶ Groq Cloud
│                     │          │  /api/generate          │─────▶ Groq Vision
│  ┌───────────────┐  │          │  /api/contact           │
│  │ BotWidget     │  │          │  /api/create-preference │─────▶ Mercado Pago
│  │ (Stream SSE)  │  │          │  /api/mercadopago-webhook      │
│  ├───────────────┤  │          └────────────────────────┘
│  │ DemoZone      │  │
│  │ (Vision)      │  │          ┌────────────────────────┐
│  ├───────────────┤  │          │   Supabase (PostgreSQL) │
│  │ StorePage     │  │          │   ┌──────────────────┐ │
│  │ (MP Checkout) │  │          │   │ clientes         │ │
│  ├───────────────┤  │          │   │ planes           │ │
│  │ Dashboard     │  │─────────▶│   │ suscripciones    │ │
│  │ (Cliente)     │  │          │   │ pagos            │ │
│  ├───────────────┤  │          │   │ tickets          │ │
│  │ 3D Scenes     │  │          │   └──────────────────┘ │
│  └───────────────┘  │          └────────────────────────┘
└─────────────────────┘
```

---

## Primeros Pasos

```bash
# 1. Clonar
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus claves:
#   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
#   GROQ_API_KEY
#   MERCADOPAGO_ACCESS_TOKEN

# 4. Iniciar desarrollo (dos terminales)
npm run api       # API server → localhost:3000
npm run dev       # Frontend   → localhost:5173
```

### Scripts Disponibles

| Script            | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Servidor de desarrollo frontend (HMR)    |
| `npm run api`     | Servidor de desarrollo backend (Express) |
| `npm run build`   | Build de producción con type-check       |
| `npm run lint`    | ESLint con reglas TS + React + a11y      |
| `npm run format`  | Prettier — formateo automático           |
| `npm run test`    | Tests de integración de APIs             |
| `npm run preview` | Vista previa del build de producción     |
| `npm run deploy`  | Deploy a Vercel producción               |

---

## Variables de Entorno

### Requeridas

| Variable                    | Descripción                                |
| --------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`         | URL del proyecto Supabase                  |
| `VITE_SUPABASE_ANON_KEY`    | Anon key de Supabase (publishable)         |
| `GROQ_API_KEY`              | API key de Groq Cloud                      |
| `MERCADOPAGO_ACCESS_TOKEN`  | Access Token de producción de Mercado Pago |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (para webhooks)           |

### Opcionales

| Variable               | Default                   | Descripción                          |
| ---------------------- | ------------------------- | ------------------------------------ |
| `VITE_SITE_URL`        | `http://localhost:5173`   | URL del sitio (para redirects OAuth) |
| `GROQ_MODEL`           | `llama-3.1-70b-versatile` | Modelo de chat                       |
| `ENABLE_BETA_CHAT`     | `false`                   | Feature flag                         |
| `RESEND_API_KEY`       | —                         | API key de Resend para emails        |
| `RESEND_FROM_EMAIL`    | `onboarding@resend.dev`   | Remitente de emails                  |
| `API_PORT`             | `3000`                    | Puerto del dev server                |
| `PAYPAL_CLIENT_ID`     | —                         | PayPal (futuro)                      |
| `PAYPAL_CLIENT_SECRET` | —                         | PayPal (futuro)                      |

---

## Estructura del Proyecto

```
ExePaginasweb/
├── api/                           # Vercel Serverless Functions
│   ├── chat.js                   # Groq LLM — streaming chatbot
│   ├── generate.js               # Groq Vision — code generation
│   ├── contact.js                # Email via Resend
│   ├── create-preference.js      # Mercado Pago — checkout preference
│   ├── mercadopago-webhook.js    # MP webhook — confirmación de pagos
│   ├── create-paypal-order.js    # PayPal — order creation (futuro)
│   └── paypal-webhook.js         # PayPal webhook (futuro)
│
├── supabase/
│   └── migrations/               # Migraciones SQL secuenciales
│       ├── 000_clientes.sql      # Tabla clientes + trigger auth
│       ├── 001_pagos.sql         # Tabla pagos + RLS
│       ├── 002_clientes_rls.sql  # Políticas RLS
│       ├── 003_planes_subscriptions.sql  # Planes + suscripciones
│       ├── 004_tickets.sql       # Sistema de tickets
│       ├── 005_infra_booking.sql # Booking / reservas
│       ├── 006_rpc_subscription.sql  # RPC para suscripciones
│       ├── 007_fix_auth_trigger.sql  # Fix trigger auth
│       └── 008_payment_integration.sql  # PayPal + tipo_proyecto
│
├── src/
│   ├── components/
│   │   ├── Bot/                  # Chatbot widget
│   │   ├── DemoZone/             # Portales 3D interactivos
│   │   ├── Effects/              # Efectos visuales (background)
│   │   ├── Features/             # Tarjetas de features
│   │   ├── Hero/                 # Hero section con typewriter
│   │   ├── dashboard/            # Panel de clientes
│   │   │   ├── ClientDashboard.tsx
│   │   │   ├── DashboardFree.tsx
│   │   │   ├── PlanDashboardView.tsx
│   │   │   ├── resolvePlanTier.ts
│   │   │   ├── ServicePulseHub.tsx
│   │   │   ├── SupportTicketPanel.tsx
│   │   │   ├── planDashboardConfig.ts
│   │   │   └── shared/           # Dashboard primitives
│   │   ├── layout/               # Header, Footer
│   │   └── store/                # Tienda / suscripciones
│   │       └── StorePage.tsx
│   │
│   ├── core/
│   │   ├── auth/                 # Auth context, roles
│   │   │   ├── AuthSessionProvider.tsx
│   │   │   ├── userAuth.ts
│   │   │   └── roleConfig.ts
│   │   ├── domain/               # Entidades y catálogo
│   │   │   ├── entities/
│   │   │   │   ├── Cliente.ts
│   │   │   │   ├── Suscripcion.ts
│   │   │   │   └── Ticket.ts
│   │   │   └── planCatalog.ts
│   │   └── infra/
│   │       └── supabase/
│   │           └── client.ts     # Supabase client singleton
│   │
│   ├── hooks/
│   │   ├── useDashboard.ts       # Dashboard data fetching
│   │   ├── usePayment.ts         # Mercado Pago + PayPal
│   │   ├── useSupportTickets.ts  # Tickets de soporte
│   │   ├── useScrollSpy.ts       # Scroll spy con rAF
│   │   ├── useFocusTrap.ts       # Accesibilidad
│   │   ├── useIsMobile.ts        # Mobile detection
│   │   └── useTypewriter.ts      # Efecto máquina de escribir
│   │
│   ├── infra/repositories/       # Repositorios Supabase
│   │   ├── SupabaseClienteRepository.ts
│   │   └── SupabaseSubscriptionRepository.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx         # Dashboard router
│   │   └── LoginPage.tsx         # Login con Google OAuth
│   │
│   ├── App.tsx                   # Layout + routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globales
│
├── public/                       # Assets estáticos
├── api-dev-server.js             # Dev server (Express 5)
├── test-api.js                   # Tests de integración
├── vite.config.ts                # Configuración Vite
├── tailwind.config.js            # Sistema de diseño
├── vercel.json                   # Deploy config
└── .env.example                  # Template de variables
```

---

## Roadmap

- [x] ~~Autenticación con Google OAuth~~
- [x] ~~Dashboard de clientes con tiers~~
- [x] ~~Suscripciones con Mercado Pago~~
- [x] ~~Sistema de tickets de soporte~~
- [x] ~~Precios en ARS~~
- [ ] **Módulo Reservas** — Calendario con turnos y recordatorios
- [ ] **CRM / Gestión de Clientes** — Panel admin completo
- [ ] **PayPal** — Botón de pago alternativo
- [ ] **Multi-idioma** — i18n (ES/EN/PT)
- [ ] **Modo claro/oscuro** — Toggle de tema
- [ ] **PWA Offline** — Service worker + cache
- [ ] **Notificaciones Push** — Web Push API
- [ ] **CI/CD** — GitHub Actions con lint + test + build
- [ ] **Edge Functions** — Supabase Edge Functions para webhooks

---

## Autor

**ExeDevCentral** — Estudio boutique de desarrollo de sistemas web premium.

| Contacto    |                                                     |
| ----------- | --------------------------------------------------- |
| 📧 Email    | [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com) |
| 🌐 Web      | [Exepaginasweb.com](https://Exepaginasweb.com)      |
| 💬 WhatsApp | [+54 9 341 6874786](https://wa.me/5493416874786)    |
| 🐙 GitHub   | [@ExeDevCentral](https://github.com/ExeDevCentral)  |

---

> _"No creamos páginas web. Creamos sistemas de software que resuelven cuellos de botella operativos."_
