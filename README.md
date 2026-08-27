<div align="center">
  <img src="public/logo.webp" alt="ExeSistemasWEB Logo" width="90" height="90" style="border-radius: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(6,182,212,0.3);" />

# ⚡ ExeSistemasWEB — Enterprise SaaS Multi-Tenant Platform

  <p align="center">
    <strong>Plataforma SaaS B2B de ingeniería web boutique diseñada para automatizar reservas, soporte con SLA, facturación secuencial y cobros recurrentes de negocios locales y profesionales independientes.</strong>
  </p>

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19_/_18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_Postgres_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-98_Passed_Tests-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev)
[![Speed Insights](https://img.shields.io/badge/Core_Web_Vitals-RES_94+-00f2fe?style=for-the-badge&logo=vercel&logoColor=black)](https://exepaginasweb.com)
[![License](https://img.shields.io/badge/License-Proprietary-FF5722?style=for-the-badge)](LICENSE)

</div>

---

## 🧭 Visión y Propósito del Sistema

> _"No hacemos páginas web estáticas. Construimos sistemas de software integrados que eliminan cuellos de botella operativos y multiplican la rentabilidad de negocios reales."_

**ExeSistemasWEB** opera como una solución SaaS integral con aislamiento de datos a nivel de base de datos (Row Level Security en PostgreSQL). Cada cliente (**tenant**) dispone de su propio entorno administrativo para gestionar:

1. **Work Groups & Equipos:** Distribución de carga laboral y asignación inteligente de tareas/tickets.
2. **Catálogo de Servicios & Addons:** Gestión de planes recurrentes, paquetes profesionales y servicios on-demand.
3. **Contratos SLA:** Monitoreo estricto de tiempos de respuesta y resolución por nivel de prioridad.
4. **Facturación & Cobros:** Generación automática de comprobantes secuenciales, conciliación bancaria y webhooks de PayPal.
5. **Telemetría & Auditoría:** Registro inmutable de actividad administrativa (`audit_log`) y métricas de rendimiento en tiempo real.

---

## 🏛️ Arquitectura del Sistema

```
                            [ USUARIO / BROWSER ]
                                      │
                         [ Vercel Edge Global Network ]
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
                        │ • 21 SQL Migrations       │
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

## ⚡ Características Principales

### 💎 Frontend & Experiencia de Usuario (UI/UX)

- **Hero Interactivo Ultra-Rápido:** Renderizado inmediato optimizado para Largest Contentful Paint (LCP < 1.5s), efecto 3D Parallax por mouse y comparador en tiempo real.
- **Login Aurora Borealis + 3D:** Canvas interactivo con ruido fraccional browniano (`fbm noise`), partículas reactivas y escena Three.js con geometrías flotantes de refracción vítrea.
- **Store 3D Tilt Cards:** Tarjetas interactivas con física de inclinación 3D, reflejo dinámico al cursor, partículas de brillo y flujo de checkout directo con validación de transferencias bancarias y PayPal.
- **Cotizador en Vivo:** Algoritmo dinámico de cálculo de presupuestos instantáneos según volumen de páginas, usuarios e integraciones requeridas.
- **Internacionalización (i18n):** Traducción y formateo localizado en **7 idiomas** (Español, Inglés, Alemán, Francés, Árabe, Portugués de Brasil, Chino Simplificado).
- **Sistema de Temas Dual:** Modo Crema Editorial (`#FDF8F3`) y Modo Dark Cyberpunk Absoluto (`#030712`), con sincronización automática en Toasters (`Sonner` y `Sileo`).

### 🛡️ Seguridad y Resiliencia Empresarial

- **Row Level Security (RLS) Estricto:** Políticas granulares en todas las tablas (`tenants`, `work_groups`, `invoices`, `tickets`, `sla_contracts`, `audit_log`).
- **Webhooks Criptográficos (Svix):** Validación de firmas SHA-256 en endpoints de Resend y verificación de credenciales en PayPal IPN.
- **Content Security Policy (CSP) Endurecida:** Cabeceras HTTP seguras, HSTS, X-Frame-Options DENY, prevención de clickjacking y protección anti-XSS.
- **Rate Limiting & Anti-Abuse:** Control estricto de peticiones en rutas públicas de contacto y chat IA.

---

## 📁 Estructura del Proyecto

```
ExePaginasweb/
├── app/                          # Next.js App Router (Páginas y API Routes)
│   ├── api/                      # Route Handlers del Backend
│   │   ├── chat/                 # Motor LLM de streaming con captura de tickets EXE-CHT
│   │   ├── check-admin/          # Validación de roles administrativos vía RPC
│   │   ├── contact/              # Procesador de contactos con tickets EXE-CNT y Resend
│   │   ├── paypal-webhook/       # Ingesta de webhooks de PayPal y creación de facturas
│   │   ├── register-transfer/    # Registro de pagos por transferencia bancaria
│   │   ├── send-verification/    # Envío de códigos de seguridad por email
│   │   └── webhooks/resend/      # Receiver Svix para telemetría de emails
│   ├── auth/callback/            # Receptor de callbacks OAuth de Supabase
│   ├── cotizador/                # Página interactiva de cotización de software
│   ├── dashboard/                # Panel de control SaaS Multi-Tenant
│   ├── login/                    # Pantalla de autenticación con Aurora y Three.js
│   ├── privacidad/               # Políticas de privacidad conformes a RGPD
│   ├── terminos/                 # Términos y condiciones del servicio
│   ├── tienda/                   # Catálogo de planes y pasarela de suscripción
│   ├── layout.tsx                # Root layout con providers (Theme, i18n, Analytics)
│   └── page.tsx                  # Landing page principal
│
├── src/
│   ├── components/               # Componentes UI Modulares
│   │   ├── Hero/                 # Hero principal, comparador y badges
│   │   ├── dashboard/            # Tablas administrativas (Clientes, Pagos, SLA, Workgroups)
│   │   ├── store/                # PlanCard 3D, CheckoutModal, TransferInstructions
│   │   ├── layout/               # Header, Footer, LanguageSwitcher, ThemeToggle
│   │   ├── Effects/              # Escenas 3D (Three.js), Canvas Aurora, CoffeePortal
│   │   └── shared/               # Botones magnéticos, modales, toasters
│   ├── core/                     # Lógica de Dominio y Capa de Infraestructura
│   │   ├── domain/               # Motores de negocio (financialEngine, availability, reservations)
│   │   ├── infra/                # Clientes y repositorios de persistencia (Supabase)
│   │   ├── auth/                 # Contexto de sesión, guards y resolutor de roles
│   │   └── i18n/                 # Diccionarios de idiomas y configuración i18next
│   └── hooks/                    # Custom Hooks reactivos (useTenant, useInvoices, etc.)
│
├── supabase/                     # Configuración de Base de Datos
│   ├── migrations/               # 21 migraciones SQL versionadas
│   ├── seed.sql                  # Datos semilla para pruebas locales
│   └── config.toml               # Configuración del entorno Supabase
│
├── tests/                        # Suite de Pruebas Automatizadas (Vitest)
│   ├── api/                      # Tests de integración de Route Handlers y Webhooks
│   └── src/                      # Pruebas unitarias de motores de dominio y componentes
│
├── docs/                         # Documentación Técnica y Arquitectónica
│   ├── adr/                      # Architecture Decision Records (0001 a 0004)
│   ├── agents/                   # Guías de triaje y domain context para agentes IA
│   └── context/                  # Modelo de dominio formal y ubiquitous language
│
└── web-automation-cli/           # CLI autónoma para automatización de workflows
```

---

## 🛠️ Tech Stack Detallado

| Capa / Módulo            | Tecnologías y Librerías                      | Propósito                                                |
| :----------------------- | :------------------------------------------- | :------------------------------------------------------- |
| **Framework Base**       | `Next.js 16.3.1 (App Router, Turbopack)`     | SSR, ISR, Server Components y Edge Routing               |
| **Librería UI**          | `React 18.3.1 / React 19 Compat`             | Renderizado reactivo y gestión declarativa               |
| **Lenguaje**             | `TypeScript 5.7.3`                           | Tipado estricto de extremo a extremo                     |
| **Estilos & CSS**        | `TailwindCSS 3.4.17 + PostCSS + CSS Vars`    | Tokens de diseño adaptativos y paleta dual               |
| **Animaciones**          | `Framer Motion 12.39 + GSAP 3.15 + Lenis`    | Micro-animaciones a 60fps y scroll suave                 |
| **Gráficos 3D**          | `Three.js 0.173`                             | Renderizado WebGL y geometrías interactivas              |
| **Base de Datos & Auth** | `Supabase (PostgreSQL 15, Auth PKCE, RLS)`   | Persistencia relacional, seguridad y sesiones            |
| **Manejo de Estado**     | `@tanstack/react-query 5.100`                | Caché asíncrona, revalidación y sincronización           |
| **Formularios & Zod**    | `React Hook Form 7.76 + Zod 4.4`             | Validación de esquemas y tipado de inputs                |
| **Testing**              | `Vitest 4.1.6 + Testing Library`             | Suite de pruebas unitarias y de integración (98 tests)   |
| **Emails & Webhooks**    | `Resend API + Svix 1.96`                     | Envío de correos transaccionales con firma criptográfica |
| **Pasarela de Pago**     | `PayPal SDK + Webhooks`                      | Cobro y conciliación de suscripciones                    |
| **Monitoreo**            | `@vercel/analytics + @vercel/speed-insights` | Telemetría en tiempo real y Core Web Vitals              |

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

# Inteligencia Artificial
GROQ_API_KEY=gsk_tu_clave_de_groq
GEMINI_API_KEY=tu_clave_de_gemini

# Resend (Emails)
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

La aplicación estará disponible en `http://localhost:3000`.

---

## 🧪 Comandos y Scripts Disponibles

```bash
# Servidor de desarrollo con Turbopack
npm run dev

# Compilación de producción con validación de TypeScript
npm run build

# Iniciar servidor en modo producción local
npm run start

# Ejecutar la suite completa de tests (98 tests)
npm test

# Ejecutar tests en modo watch interactivo
npm run test:watch

# Análisis estático con ESLint
npm run lint

# Formateo automático de código con Prettier
npm run format

# Sincronización con base de datos de Supabase
npm run supabase:push
```

---

## 📊 Matriz de Tests y Calidad de Software

La plataforma cuenta con un arnés de testing automatizado mediante **Vitest**, asegurando cero regresiones en lógica crítica:

```
✓ tests/api/audit/system-audit.test.js     # Auditoría de Chatbot, Contacto y Webhooks
✓ tests/api/webhooks/resend.test.js       # Validación de firmas Svix y eventos Resend
✓ src/core/domain/financial/              # Motor financiero y cálculo de comisiones
✓ src/core/domain/tenant/                 # Resolución de planes y cuotas multi-tenant
✓ src/core/domain/reservations/           # Detección de colisiones de agenda
✓ src/core/domain/availability/           # Cálculo dinámico de franjas horarias
✓ src/components/store/CheckoutModal.test # Flujos de pago y validación UI
```

---

## 🌐 Endpoints de la API Backend

| Método | Endpoint                 | Descripción                                                    | Autenticación          |
| :----- | :----------------------- | :------------------------------------------------------------- | :--------------------- |
| `POST` | `/api/chat`              | Chatbot IA con streaming y emisión de ticket `EXE-CHT`         | Pública / Rate Limited |
| `POST` | `/api/contact`           | Recepción de consultas, email a admin y confirmación a cliente | Pública / Sanitizada   |
| `POST` | `/api/webhooks/resend`   | Ingesta de eventos Svix (entregas, rebotes, clics)             | Firma Svix Requerida   |
| `POST` | `/api/paypal-webhook`    | Procesamiento de cobros y facturación vía RPC                  | Firma PayPal           |
| `POST` | `/api/register-transfer` | Registro de comprobantes de transferencia bancaria             | Pública / Validada     |
| `GET`  | `/api/check-admin`       | Verificación de privilegios de administración                  | Sesión Supabase        |
| `POST` | `/api/send-verification` | Envío de tokens de verificación por correo                     | Token interno          |

---

## 🤝 Contacto Comercial y Desarrollo Boutique

**ExeDevCentral — Software Engineering & Digital Acceleration Studio**

- 🌐 **Sitio Web Oficial:** [exepaginasweb.com](https://exepaginasweb.com)
- 📧 **Email Directo:** [Contacto@exepaginasweb.com](mailto:Contacto@exepaginasweb.com) / [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com)
- 📱 **WhatsApp:** [+54 9 341 6874786](https://wa.me/5493416874786)
- 💻 **GitHub:** [@ExeDevCentral](https://github.com/ExeDevCentral)

---

<div align="center">
  <sub>Construido con precisión técnica y estándares enterprise por ExeDevCentral. Todos los derechos reservados.</sub>
</div>
