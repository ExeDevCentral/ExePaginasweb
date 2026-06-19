# ⚡ ExeSistemasWEB — Plataforma Premium de Empleados Digitales con IA

<div align="center">
  <img src="public/logo.webp" alt="ExeSistemasWEB Logo" width="80" height="80" style="border-radius: 16px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,212,255,0.2);" />

  <h3>Estudio Boutique de Desarrollo de Sistemas Web Premium</h3>

[![Estado](https://img.shields.io/badge/Status-Production-00d4ff?style=for-the-badge&logo=vercel&logoColor=white)](https://exepaginasweb.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq_LLM-Streaming-FF6B6B?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![PayPal Hosted Buttons](https://img.shields.io/badge/PayPal-Hosted_Buttons-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

</div>

---

## 📖 Visión del Proyecto

> **No hacemos "páginas web". Construimos empleados digitales.**
>
> **ExeSistemasWEB** es una plataforma SPA full-stack, diseñada a medida para automatizar la operativa, el soporte y los cobros de negocios locales y profesionales independientes.
>
> Integra chat inteligente con streaming, pasarela de pagos PayPal con botones hosteados, panel de clientes segmentado por suscripción, y sistema de tickets automatizado con triggers en base de datos Postgres.

---

## ✨ Características Destacadas

- 🤖 **Asistente de IA Avanzado:** Chat en tiempo real impulsado por **Groq (Llama 3.3)** con streaming SSE palabra por palabra y memoria contextual.
- 🧊 **Experiencia 3D Inmersiva:** Componente `CoffeePortal3D` con `Three.js` + `React Three Fiber`, carga diferida y demo interactiva "Pixel Coffee" en `DemoZone`.
- 🎫 **Sistema de Tickets Automatizado:** Flujo completo de soporte con triggers server-side en Supabase. Cuando un cliente abre un ticket, las notificaciones se generan automáticamente en la base de datos.
- 💳 **PayPal Hosted Buttons:** Botones preconfigurados desde el dashboard de PayPal para suscripciones en USD (tres planes: Básico $20, Avanzado $40, Premium $100). Sin backend propio — PayPal maneja el cobro y redirect.
- 📊 **Dashboard Segmentado por Plan:** Panel de control dinámico según el nivel de suscripción (Básico, Avanzado, Premium) con módulos de tickets, facturación y estadísticas.
- 🔐 **Seguridad RLS + Popup OAuth:** Base de datos protegida con Row Level Security (RLS) en Postgres. Login con popup para compatibilidad con Brave y navegadores restrictivos.
- 🌗 **Tema Light/Cream + Dark Mode:** Default theme "Crema Premium" (`#FDF8F3`) con toggle a dark mode via `.dark` class y CSS variables.
- 📱 **PWA Ready:** `manifest.json` con modo standalone, íconos y configuración de service worker.

---

## 🛠️ Arquitectura

```
🌐 Cliente (Browser)
      │
      │ [CDN / Edge: Vercel Network]
      ├──────────────────────────────────────┐
      │                                      │
      ▼                                      ▼
┌─────────────────────┐          ┌────────────────────────┐
│   React 18 SPA      │          │  Serverless Functions   │
│   (Vite + TS)       │─────────▶│  /api/chat             │─────▶ Groq LLM (Streaming)
│                     │          │  /api/contact          │─────▶ Resend (Email)
│  ┌───────────────┐  │          │  /api/paypal-webhook   │─────▶ Supabase DB
│  │ Header/Hero   │  │          └────────────────────────┘
│  │ SocialProof   │  │          └────────────────────────┘
│  ├───────────────┤  │
│  │ Products      │  │          ┌────────────────────────┐
│  ├───────────────┤  │          │   Supabase Postgres    │
│  │ Features      │  │─────────▶│   ┌──────────────────┐ │
│  ├───────────────┤  │          │   │  clientes        │ │
│  │ DemoZone 3D   │  │          │   │  tickets         │ │  ◄── Trigger: Auto-Notify
│  ├───────────────┤  │          │   │  notificaciones  │ │
│  │ Pricing+Store │  │          │   │  suscripciones   │ │
│  ├───────────────┤  │          │   │  leads           │ │
│  │ Dashboard     │  │          │   │  planes          │ │
│  ├───────────────┤  │          │   │  pagos           │ │
│  │ Chat Widget   │  │          │   └──────────────────┘ │
│  └───────────────┘  │          └────────────────────────┘
└─────────────────────┘
```

---

## 🚀 Tech Stack

### Frontend

| Librería             | Versión      | Propósito                    |
| -------------------- | ------------ | ---------------------------- |
| React                | 18.3.1       | UI declarativa y reactiva    |
| TypeScript           | 5.7.3        | Tipado estricto              |
| Vite                 | 6.2.0        | Build ultra veloz + HMR      |
| TailwindCSS          | 3.4.17       | Sistema de diseño adaptativo |
| Framer Motion        | 12.39        | Micro-interacciones fluidas  |
| TanStack React Query | 5.100        | Caché y estado asíncrono     |
| React Router DOM     | 7.14         | Routing SPA                  |
| Three.js + R3F       | 0.173 / 8.17 | Renderizado 3D               |
| Lucide React         | 0.475        | Iconos                       |
| Zod                  | 4.4          | Validación de schemas        |
| React Hook Form      | 7.76         | Formularios                  |
| React Markdown       | 9.0          | Renderizado Markdown         |
| AI SDK               | 6.0          | Streaming de LLM             |

### Backend & Database

| Servicio                    | Propósito                                   |
| --------------------------- | ------------------------------------------- |
| Supabase (PostgreSQL 15)    | Auth (Google OAuth), DB, RLS, triggers      |
| Vercel Serverless Functions | Endpoints API (Node.js)                     |
| PayPal Hosted Buttons       | Botones preconfigurados en dashboard PayPal |
| Groq Cloud API              | Inferencia LLM ultra-baja latencia          |
| Resend                      | Emails transaccionales                      |

---

## 🎨 Sistema de Theme

- **Default:** Tema "Crema Premium" (`background: #FDF8F3`, `foreground: #2D2B2A`)
- **Dark mode:** Toggle via ícono sol/luna, persiste en `localStorage`
- **CSS Variables:** Todas las referencias de color via `var()` — `bg-background`, `text-foreground`, `border-border`, `bg-card`, `bg-muted`, `text-muted-foreground`, `text-primary-secondary`
- **Tailwind: `darkMode: "class"`** — se agrega/remueve clase `.dark` en `<html>`

---

## ⚙️ Variables de Entorno

```env
# Supabase
VITE_SUPABASE_URL=https://tu_proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_SITE_URL=https://exepaginasweb.com
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# IA (Groq)
GROQ_API_KEY=tu_groq_api_key
GROQ_MODEL=llama-3.1-70b-versatile

# PayPal (Hosted Buttons - configurados en dashboard de PayPal)
# No requiere secrets en backend. Los botones usan client-side SDK.
PAYPAL_CLIENT_ID=BA... (public, en SDK URL)

# Resend (Emails)
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=contacto@exepaginasweb.com
```

---

## 🏃 Primeros Pasos

### 1. Clonar e Instalar

```bash
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb
npm install
```

### 2. Variables de Entorno

Crear archivo `.env` en la raíz con las variables de arriba.

### 3. Levantar Servidores

```bash
# Backend API local (Express, puerto 3000)
npm run api

# Frontend Vite (puerto 5173)
npm run dev
```

### 4. Scripts Disponibles

| Script           | Acción                             |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Inicia Vite dev server             |
| `npm run api`    | Inicia API local en `:3000`        |
| `npm run build`  | Build producción con typecheck     |
| `npm run lint`   | ESLint con reglas de accesibilidad |
| `npm run format` | Prettier a todo el proyecto        |
| `npm run test`   | Ejecuta tests unitarios            |
| `npm run deploy` | Deploy a Vercel producción         |

### Supabase

```bash
npm run supabase:link    # Vincular proyecto
npm run supabase:push    # Aplicar migraciones
```

---

## 📁 Estructura del Proyecto

```
src/
├── App.tsx                # Landing page con lazy loading
├── main.tsx               # Entry point + routing
├── index.css              # CSS variables (light/dark) + utilidades
├── components/
│   ├── Audit/             # AutomationAudit (lead capture)
│   ├── Auth/              # LoginModal
│   ├── BookingDemo/       # BookingDemo (lead capture)
│   ├── CaseStudies/       # Casos de éxito + DashboardMock
│   ├── DemoZone/          # Demo interactiva 3D + UserManagement
│   ├── Effects/           # PremiumBackground + CoffeePortal3D
│   ├── FAQ/               # Preguntas frecuentes
│   ├── Features/          # Feature cards con íconos
│   ├── Hero/              # Hero principal con CTA
│   ├── Pricing/           # Planes + ROI Calculator
│   ├── Process/           # Proceso de trabajo
│   ├── Products/          # Productos destacados
│   ├── SocialProof/       # Testimonios y estadísticas
│   ├── TechStack/         # Tecnologías que usamos
│   ├── chat/              # BotWidget + ChatbaseWidget
│   ├── dashboard/         # AdminDashboard, ClientDashboard, PlanDashboardView
│   ├── landing/           # ContactSection
│   ├── layout/            # Header, Footer, ErrorBoundary, ThemeToggle
│   ├── store/             # StorePage + PaywallModal
│   └── shared/            # SalonBloomButton
├── core/
│   ├── auth/              # AuthSessionProvider, resolveAuth, roleConfig
│   ├── domain/            # Entidades, repositorios, availability, reservations, slots
│   ├── infra/supabase/    # Cliente Supabase
│   └── theme/             # ThemeContext (light/dark toggle)
├── hooks/                 # usePayment, useDashboard, useSupportTickets, etc.
├── infra/repositories/    # Implementaciones Supabase de repositorios
├── lib/                   # Cliente Supabase alternativo
└── pages/                 # Login, Dashboard, AuthCallback, NotFound, etc.

api/                       # Serverless Functions (Vercel)
├── chat.js                # Streaming chat con Groq
├── contact.js             # Email via Resend
└── paypal-webhook.js      # Webhook PayPal (legacy, para eventos post-pago)

supabase/migrations/       # 14 migraciones SQL
public/                    # Assets, logo, manifest, robots.txt
```

---

## 🧪 Tests

```
src/core/domain/availability/availabilityEngine.test.ts
src/core/domain/slots/slotGenerator.test.ts
src/core/domain/reservations/conflictDetector.test.ts
src/core/domain/reservations/reservationService.test.ts
```

Ejecutar con: `npm run test`

---

## 🗺️ Rutas

| Ruta             | Página                  |
| ---------------- | ----------------------- |
| `/`              | Landing (App.tsx)       |
| `/tienda`        | Store / Planes          |
| `/login`         | Login                   |
| `/dashboard`     | Dashboard de cliente    |
| `/auth/callback` | Callback OAuth Supabase |
| `/privacidad`    | Política de privacidad  |
| `/terminos`      | Términos de servicio    |
| `*`              | 404 NotFound            |

---

## 🔄 CI/CD

- **Plataforma:** Vercel (auto-deploy desde `master`)
- **Pre-deploy:** TypeScript typecheck + Vite build
- **Headers de seguridad:** HSTS, X-Content-Type-Options, CSP via `vercel.json`
- **Assets:** Cache inmutable (1 año), imágenes con `stale-while-revalidate`

---

## 📬 Contacto

**ExeDevCentral** — Estudio Boutique de Sistemas Web Premium

- 🌐 **Web:** [exepaginasweb.com](https://exepaginasweb.com)
- 📧 **Email:** [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com)
- 💬 **WhatsApp:** [+54 9 341 6874786](https://wa.me/5493416874786)
- 🐙 **GitHub:** [@ExeDevCentral](https://github.com/ExeDevCentral)

---

> _"El software de alta calidad no es un gasto, es el activo digital más rentable para automatizar los procesos de tu negocio."_
