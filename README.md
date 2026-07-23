# ExeSistemasWEB — Plataforma SaaS Multi-Tenant

<div align="center">
  <img src="public/logo.webp" alt="ExeSistemasWEB Logo" width="80" height="80" style="border-radius: 16px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,212,255,0.2);" />

  <h3>SaaS B2B para automatizar reservas, soporte y cobros de negocios locales</h3>

[![Estado](https://img.shields.io/badge/Status-Production-00d4ff?style=for-the-badge&logo=vercel&logoColor=white)](https://exepaginasweb.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com)
[![Sileo](https://img.shields.io/badge/Sileo-Toasts-FF6B6B?style=for-the-badge&logoColor=white)](https://github.com/user/sileo)
[![PayPal](https://img.shields.io/badge/PayPal-Integration-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.com)

</div>

---

## Vision del Proyecto

> **No hacemos paginas web. Construimos sistemas de software que resuelven problemas operativos.**
>
> **ExeSistemasWEB** es una plataforma SaaS B2B multi-tenant, disenada para automatizar la operativa, el soporte y los cobros de negocios locales y profesionales independientes.
>
> Cada cliente (tenant) tiene su propio entorno aislado con work groups, catalogo de servicios, contratos SLA, facturacion y panel de administracion completo.

---

## Caracteristicas Destacadas

- **Work Groups:** Equipos de trabajo por tenant con roles y asignacion de miembros a tickets y reservas.
- **Catalogo de Servicios:** Planes, addons, servicios profesionales y one-time con precios y intervalos configurables.
- **Contratos SLA:** Acuerdos de nivel de servicio con umbrales de resolucion por prioridad.
- **Sistema de Facturacion:** Generacion automatica de facturas secuenciales, renovaciones programadas y tracking de pagos.
- **Audit Log:** Registro completo de acciones administrativas con trazabilidad.
- **Dashboard Multi-Tenant:** Panel con tabs de Resumen, Servicios, Equipo, SLA y Facturas.
- **Autenticacion OAuth:** Google y Facebook via Supabase Auth con flow PKCE y popup mode.
- **Hero 3D Interactivo:** Efecto parallax por mouse con capas de profundidad y hotspot markers.
- **Store Redesign:** PlanCard con 3D tilt, mouse-tracking glow, floating particles, shimmer sweep CTA.
- **Login Aurora + 3D:** Canvas aurora borealis con fbm noise, Three.js escena con geometria cristalina flotante, 200 partículas3D, mouse-reactive lighting.
- **Toasts Sincronizados:** Sistema de notificaciones que respeta el tema dark/light de la app.
- **Email Templates:** 7 templates transaccionales (contacto, pagos, facturas) via Resend.
- **Auto-Assign Tickets:** RPC que asigna automaticamente tickets al work group con menor carga.
- **Seguridad RLS:** Row Level Security en todas las tablas SaaS, validacion CORS, rate limiting, proteccion XSS, AuthGuard en rutas protegidas.

---

## Arquitectura

```
 Cliente (Browser)
       |
       | [CDN / Edge: Vercel Network]
       +--------------------------------------+
       |                                      |
       v                                      v
 +---------------------+          +------------------------+
 |   React 18 SPA      |          |  Serverless Functions   |
 |   (Vite + TS)       +--------->+  /api/chat             +---> Groq LLM (Streaming)
 |                     |          |  /api/contact          +---> Resend (Email)
 |  +---------------+  |          |  /api/paypal-webhook   +---> Supabase DB
 |  | Header/Hero   |  |          +------------------------+
 |  | ServiceCards  |  |
 |  +---------------+  |          +------------------------+
 |  | Dashboard     |  |          |   Supabase Postgres    |
 |  | (Tabs: Res,   |  +--------->+   +------------------+ |
 |  |  Serv, Team,  |  |          |   | tenants          | |
 |  |  SLA, Bills)  |  |          |   | work_groups      | |
 |  +---------------+  |          |   | work_members     | |
 |  | Landing       |  |          |   | service_catalog  | |
 |  | Features      |  |          |   | tenant_services  | |
 |  | Pricing       |  |          |   | sla_contracts    | |
 |  | Contact       |  |          |   | invoices         | |
 |  +---------------+  |          |   | audit_log        | |
 +---------------------+          |   | tickets          | |
                                  |   | notificaciones   | |
                                  |   | clientes         | |
                                  |   | suscripciones    | |
                                  |   | pagos            | |
                                  |   +------------------+ |
                                  +------------------------+
```

---

## Tech Stack

### Frontend

| Libreria             | Version | Proposito                    |
| -------------------- | ------- | ---------------------------- |
| React                | 18.3    | UI declarativa y reactiva    |
| TypeScript           | 5.7     | Tipado estricto              |
| Vite                 | 6.2     | Build ultra veloz + HMR      |
| TailwindCSS          | 3.4     | Sistema de diseño adaptativo |
| Framer Motion        | 12.x    | Micro-interacciones fluidas  |
| Three.js             | 0.173   | Escenas 3D y geometria       |
| @react-three/fiber   | 8.17    | React renderer para Three.js |
| @react-three/drei    | 9.121   | Helpers y materiales R3F     |
| TanStack React Query | 5.x     | Cache y estado asincrono     |
| React Router DOM     | 7.x     | Routing SPA                  |
| Lucide React         | 0.475   | Iconos                       |
| Sileo                | latest  | Toasts animados              |

### Backend y Database

| Servicio                    | Proposito                                   |
| --------------------------- | ------------------------------------------- |
| Supabase (PostgreSQL 15)    | Auth (Google OAuth), DB, RLS, triggers, RPC |
| Vercel Serverless Functions | Endpoints API (Node.js)                     |
| PayPal                      | Webhooks + cobros SaaS                      |
| Groq Cloud API              | Chat IA streaming (demo)                    |
| Resend                      | Emails transaccionales                      |

### SaaS Core

| Modulo                | Archivos | Descripcion                                   |
| --------------------- | -------- | --------------------------------------------- |
| Domain Entities       | 14       | Tenant, WorkGroup, WorkMember, Invoice, etc.  |
| Repository Interfaces | 9        | Contratos para persistencia                   |
| Supabase Repositories | 13       | Implementaciones con Supabase                 |
| React Query Hooks     | 15       | useTenant, useWorkGroups, useInvoices, etc.   |
| UI Panels             | 4        | WorkGroups, Services, SLA, Invoices           |
| Email Templates       | 7        | contactNotification, paymentConfirmation, etc |
| SQL Migrations        | 21       | Schema, RLS policies, RPC functions           |

---

## Sistema de Theme

- **Default:** Tema Crema Premium (`background: #FDF8F3`, `foreground: #2D2B2A`)
- **Dark mode:** Toggle via icono sol/luna, persiste en `localStorage`
- **CSS Variables:** Todas las referencias de color via `var()` — `bg-background`, `text-foreground`, `border-border`, `bg-card`, `bg-muted`
- **Tailwind: `darkMode: "class"`** — se agrega/remueve clase `.dark` en `<html>`
- **Sileo Toaster:** Sincronizado automaticamente con el tema via `ThemedToaster`

---

## Variables de Entorno

```env
# Supabase (requerido para que la app funcione)
VITE_SUPABASE_URL=https://tu_proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
VITE_SITE_URL=https://exepaginasweb.com
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# IA (Groq) - solo para chat demo
GROQ_API_KEY=tu_groq_api_key

# PayPal
VITE_PAYPAL_CLIENT_ID=tu_client_id_frontend
PAYPAL_CLIENT_ID=tu_client_id_backend
PAYPAL_CLIENT_SECRET=tu_client_secret
PAYPAL_WEBHOOK_ID=tu_webhook_id
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

# Resend (Emails)
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=contacto@exepaginasweb.com
```

---

## Primeros Pasos

### 1. Clonar e Instalar

```bash
git clone https://github.com/ExeDevCentral/ExePaginasweb.git
cd ExePaginasweb
npm install
```

### 2. Variables de Entorno

Crear archivo `.env` en la raiz con las variables de arriba. Sin `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` la app no conecta a Supabase.

### 3. Aplicar Migraciones

```bash
npm run supabase:link    # Vincular proyecto
npm run supabase:push    # Aplicar migraciones (21 archivos SQL)
```

### 4. Levantar Servidores

```bash
# Backend API local (Express, puerto 3000)
npm run api

# Frontend Vite (puerto 5173)
npm run dev
```

### 5. Scripts Disponibles

| Script            | Accion                             |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Inicia Vite dev server             |
| `npm run api`     | Inicia API local en `:3000`        |
| `npm run build`   | Build produccion con typecheck     |
| `npm run lint`    | ESLint con reglas de accesibilidad |
| `npm run format`  | Prettier a todo el proyecto        |
| `npm run test`    | Ejecuta tests unitarios            |
| `npm run deploy`  | Deploy a Vercel produccion         |
| `npm run preview` | Preview del build local            |

---

## Estructura del Proyecto

```
src/
  App.tsx                   # Landing page con lazy loading
  main.tsx                  # Entry point + routing + Toaster
  index.css                 # CSS variables (light/dark) + utilidades
  components/
    Hero/                   # Hero.tsx, Hero3DImage, ServiceSelector, BookingModal
    dashboard/              # AdminDashboard, ClientDashboard, PlanDashboardView,
                            # OnboardingWizard, ServicePulseHub, SupportTicketPanel
    workgroups/             # WorkGroupsPanel
    services/               # ServicesPanel
    sla/                    # SLADashboard
    invoices/               # InvoicesPanel
    DemoZone/               # Demo interactiva + AuthModal + authService
    Effects/                # CoffeePortal3D, PremiumBackground, LoginBackground (canvas aurora + Three.js 3D), LoginScene
    BookingDemo/            # BookingDemo (lead capture)
    CaseStudies/            # Casos de exito + DashboardMock
    Features/               # Feature cards con iconos
    Pricing/                # Planes + ROI Calculator
    Products/               # Productos destacados
    Process/                # Proceso de trabajo
    FAQ/                    # Preguntas frecuentes
    SocialProof/            # Testimonios y estadisticas
    TechStack/              # Tecnologias que usamos
    chat/                   # ChatbaseWidget
    landing/                # ContactSection
    layout/                 # Header, Footer, ErrorBoundary, ThemeToggle, LanguageSwitcher
    store/                  # StorePage, PlanCard (3D tilt), PlanGrid, CheckoutModal, TransferInstructions, PaywallModal
    shared/                 # SalonBloomButton, ThemedToaster
    Audit/                  # AutomationAudit (lead capture)
  core/
    auth/                   # AuthSessionProvider, userAuth, AuthGuard, siteUrl, roleConfig
    domain/
      entities/             # 14 entidades (Tenant, WorkGroup, Invoice, SLAContract, etc.)
      repositories/         # 9 interfaces (ITenantRepo, IWorkGroupRepo, etc.)
      availability/         # availabilityEngine + tests
      reservations/         # conflictDetector, reservationService + tests
      slots/                # slotGenerator + tests
    infra/
      supabase/             # client.ts
      repositories/         # 13 implementaciones Supabase + 1 test
      memory/               # InMemoryReservationRepository (testing)
    i18n/                   # config + 7 locales (es, en, de, fr, ar, pt-BR, zh-CN)
    theme/                  # ThemeContext (light/dark toggle)
  hooks/                    # 15 hooks (useTenant, useWorkGroups, useInvoices, useSLA, etc.)
  pages/                    # Login (aurora + 3D scene), Dashboard, AuthCallback, NotFound, PrivacyPolicy, TermsOfService

api/                        # Serverless Functions (Vercel)
  chat.js                   # Streaming chat con Groq
  contact.js                # Email via Resend (contactNotification template)
  paypal-webhook.js         # Webhook PayPal → genera facturas SaaS via RPC, envia paymentConfirmation
  check-admin.js            # Admin role check
  test-paypal.js            # PayPal test endpoint
  webhooks/resend.js        # Resend webhook receiver
  lib/email/                # send.js + templates.js (7 templates transaccionales)

supabase/migrations/        # 21 migraciones SQL (000-020)
```

---

## Tests

```
src/core/domain/availability/availabilityEngine.test.ts
src/core/domain/slots/slotGenerator.test.ts
src/core/domain/reservations/conflictDetector.test.ts
src/core/domain/reservations/reservationService.test.ts
src/core/infra/repositories/SupabaseTenantRepository.test.ts
src/hooks/useTenant.test.ts
```

Ejecutar con: `npm run test` (vitest)

---

## Rutas

| Ruta             | Pagina                  |
| ---------------- | ----------------------- |
| `/`              | Landing (App.tsx)       |
| `/tienda`        | Store / Planes          |
| `/login`         | Login                   |
| `/dashboard`     | Dashboard multi-tenant  |
| `/auth/callback` | Callback OAuth Supabase |
| `/privacidad`    | Politica de privacidad  |
| `/terminos`      | Terminos de servicio    |
| `*`              | 404 NotFound            |

---

## CI/CD

- **Plataforma:** Vercel (auto-deploy desde `main`)
- **Pre-deploy:** TypeScript typecheck + Vite build
- **Headers de seguridad:** HSTS, X-Content-Type-Options, CSP, X-Frame-Options DENY via `vercel.json`
- **Assets:** Cache inmutable (1 ano), imagenes con `stale-while-revalidate`
- **Branch:** `main` (no `master`)

---

## Roadmap

### Completado

- [x] Landing page con Hero 3D interactivo
- [x] Autenticacion Google/Facebook (Supabase PKCE)
- [x] Dashboard multi-tenant con tabs
- [x] Sistema de tickets con triggers y auto-assign
- [x] Work groups y asignacion de miembros
- [x] Catalogo de servicios (plan, addon, professional, one_time)
- [x] Contratos SLA con umbrales por prioridad
- [x] Sistema de facturacion con numeracion secuencial
- [x] Audit log para trazabilidad
- [x] Migraciones SQL (21 archivos)
- [x] RLS en todas las tablas SaaS
- [x] Seguridad: XSS fixes, CORS validation, rate limiting, AuthGuard
- [x] Store page redesign: 3D tilt cards, premium visuals, component decomposition
- [x] Login aurora borealis (canvas + fbm noise) + Three.js 3D scene
- [x] Email templates (7 templates transaccionales via Resend)
- [x] PayPal webhook genera facturas SaaS via RPC
- [x] Dashboard i18n (hardcoded strings → t())

### Por Implementar

- [ ] Conectar frontend a Supabase real (configurar env vars en Vercel)
- [ ] Aplicar migraciones 018-020 en produccion
- [ ] Flujos de renovacion automatica de suscripciones
- [ ] Notificaciones push para tickets y SLA breaches
- [ ] Reportes y analytics por tenant
- [ ] Integracion WhatsApp Business API
- [ ] App movil (React Native o PWA avanzada)
- [ ] Tests de integracion end-to-end

---

## Contacto

**ExeDevCentral** — Estudio Boutique de Sistemas Web Premium

- **Web:** [exepaginasweb.com](https://exepaginasweb.com)
- **Email:** [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com)
- **WhatsApp:** [+54 9 341 6874786](https://wa.me/5493416874786)
- **GitHub:** [@ExeDevCentral](https://github.com/ExeDevCentral)

---

> _"El software de alta calidad no es un gasto, es el activo digital mas rentable para automatizar los procesos de tu negocio."_
