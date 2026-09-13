# 📊 ExeSistemasWEB — Informe de Análisis del Proyecto

**Fecha de Análisis:** 2025  
**Equipo:** ExeDevCentral — Software Engineering & Digital Acceleration Studio  
**Estado General:** ✅ Producción Ready | Enterprise SaaS B2B Multi-Tenant

---

## 1. 🎯 Resumen Ejecutivo

**ExeSistemasWEB** es una plataforma SaaS B2B boutique de nivel empresarial diseñada para automatizar operaciones en negocios locales y profesionales independientes. Opera como un sistema integrado de gestión que combina:

- **Reservas y turnos automatizadas**
- **Gestión de tickets con SLA**
- **Facturación secuencial y cobros recurrentes**
- **Dashboard multi-tenant con aislamiento de datos**
- **Inteligencia artificial integrada (LLM streaming)**
- **Experiencia visual premium (3D interactivo, Aurora, Parallax)**

### Cifras Clave
- **Lenguaje Principal:** TypeScript + React
- **Framework:** Next.js 16.3 (App Router)
- **Base de Datos:** PostgreSQL 15 (Supabase)
- **Suite de Tests:** 151 tests passing (Vitest)
- **Migraciones SQL:** 27 versiones
- **Endpoints API:** 8 route handlers especializados
- **Idiomas Soportados:** 7 (ES, EN, DE, FR, AR, PT-BR, ZH)
- **Despliegue:** Vercel (Edge Global Network)

---

## 2. 🏗️ Arquitectura General

```
CLIENTE (Browser/Mobile)
        ↓
  Vercel Edge Network
        ↓
┌─────────────────────────────────────┐
│  Next.js 16.3 App Router            │
├─────────────────────────────────────┤
│ • Landing Page (/)                  │
│ • Tienda (/tienda)                  │
│ • Cotizador (/cotizador)            │
│ • Login Aurora 3D (/login)          │
│ • Dashboard Multi-Tenant (/dashboard)│
│ • Public Routes (privacidad, terms) │
└─────────────────────┬───────────────┘
                      ↓
        ┌─────────────────────────────┐
        │  Serverless API Routes      │
        ├─────────────────────────────┤
        │ POST /api/chat              │
        │ POST /api/contact           │
        │ POST /api/paypal-webhook    │
        │ POST /api/register-transfer │
        │ POST /api/webhooks/resend   │
        │ POST /api/send-verification │
        │ GET /api/check-admin        │
        └─────────────────┬───────────┘
                          ↓
        ┌─────────────────────────────┐
        │  Supabase Cloud Platform    │
        ├─────────────────────────────┤
        │ • PostgreSQL 15 + RLS       │
        │ • Auth (OAuth + PKCE)       │
        │ • Realtime & Triggers       │
        │ • RPC Functions             │
        └─────────────────────────────┘
                          ↓
        ┌─────────────────────────────┐
        │  External Integrations      │
        ├─────────────────────────────┤
        │ • Groq Cloud (LLM Streaming)│
        │ • Resend (Email + Svix)     │
        │ • PayPal (Webhooks)         │
        │ • Google OAuth              │
        │ • Facebook OAuth            │
        └─────────────────────────────┘
```

---

## 3. 📦 Stack Tecnológico Detallado

### Frontend & UI
| Componente         | Librería/Versión    | Propósito                          |
|:------------------|:------------------|:--------------------------------|
| Framework          | Next.js 16.3       | App Router, SSR, Route Handlers |
| Componentes UI     | React 19.3         | Renderizado reactivo declarativo |
| Lenguaje           | TypeScript 5.7     | Tipado estricto E2E             |
| Estilos            | TailwindCSS 4.3    | Utility-first CSS + Dark Mode   |
| Animaciones        | Framer Motion 12.4 | Micro-interacciones fluidas     |
| 3D & Gráficos      | Three.js 0.185     | Escenas WebGL interactivas      |
| Tema & CSS         | GSAP 3.15 + Lenis  | Scroll suave y efectos avanzados|
| Iconos             | Lucide React 0.475 | 1000+ iconos SVG optimizados    |
| Notificaciones     | Sonner 2.0         | Toasters animados sincronizados |
| Internacionalización| i18next 26.4       | 7 idiomas con localización      |

### Backend & Base de Datos
| Componente      | Tecnología         | Propósito                     |
|:---------------|:------------------|:--------------------------|
| Backend        | Next.js Route Handlers | Serverless API endpoints |
| Database       | PostgreSQL 15 (Supabase) | Persistencia relacional |
| Autenticación  | Supabase Auth (PKCE) | OAuth + Email-MFA         |
| RLS            | Políticas Row-Level Security | Aislamiento multi-tenant |
| Triggers       | PL/pgSQL en PostgreSQL | Automatización de eventos |
| RPC Functions  | Custom Stored Procedures | Lógica empresarial en BD |

### Gestión de Estado & Datos
| Librería            | Versión | Propósito                  |
|:------------------|:-------|:----------------------|
| @tanstack/react-query | 5.102  | Caché asíncrona y revalidación |
| @tanstack/react-table | 8.21   | Tablas complejas interactivas |
| Zod                 | 4.5    | Validación de esquemas TypeScript |
| Supabase JS Client  | 2.115  | Cliente oficial Supabase |

### Testing & QA
| Herramienta     | Versión | Propósito                |
|:---------------|:-------|:---------------------|
| Vitest          | 5.0    | Suite de tests unitarios |
| Playwright      | 1.63   | Tests E2E & accesibilidad |
| @testing-library| Latest | Testing de componentes React |

### Herramientas de Desarrollo
| Herramienta    | Propósito                        |
|:-------------|:-------------------------------|
| ESLint       | Análisis estático y linting    |
| Prettier     | Formateo automático de código  |
| TypeScript Compiler | Verificación de tipos sin emitir |
| Husky + Lint Staged | Git hooks para calidad pre-commit |

### Integración de Terceros
| Servicio        | Propósito                           |
|:---------------|:--------------------------------|
| Groq Cloud      | LLM streaming para chatbot IA   |
| Resend API      | Emails transaccionales           |
| Svix            | Webhooks criptográficos validados |
| PayPal API      | Procesamiento de pagos y suscripciones |
| Vercel Analytics| Telemetría y Core Web Vitals    |
| PostHog (Optional)| Product analytics self-hosted  |

---

## 4. 📁 Estructura del Proyecto

```
ExePaginasweb/
│
├── app/                                # Next.js App Router (Páginas + API)
│   ├── api/                            # Route Handlers del Backend
│   │   ├── chat/                       # Streaming de LLM + creación de tickets
│   │   ├── contact/                    # Procesador de contactos + Resend
│   │   ├── paypal-webhook/             # Ingesta de webhooks de PayPal
│   │   ├── register-transfer/          # Registro de transferencias bancarias
│   │   ├── webhooks/resend/            # Receiver Svix para emails
│   │   ├── check-admin/                # Validación de roles vía RPC
│   │   └── send-verification/          # Envío de tokens de verificación
│   │
│   ├── auth/callback/                  # Receptor de callbacks OAuth
│   ├── cotizador/                      # Página de cotización interactiva
│   ├── dashboard/                      # Panel de control SaaS multi-tenant
│   ├── login/                          # Autenticación con Aurora 3D
│   ├── tienda/                         # Catálogo de planes y checkout
│   ├── portafolio/                     # Portfolio de proyectos
│   ├── demos/                          # Demostraciones de features
│   ├── privacidad/                     # Políticas de privacidad (RGPD)
│   ├── terminos/                       # Términos y condiciones
│   ├── soluciones/                     # Landing de soluciones verticales
│   ├── precios/                        # Página de precios y planes
│   ├── layout.tsx                      # Root layout con providers
│   ├── page.tsx                        # Landing page principal
│   ├── globals.css                     # Estilos globales
│   ├── providers.tsx                   # Context providers (Theme, i18n, Analytics)
│   └── robots.ts / sitemap.ts          # SEO
│
├── src/
│   ├── components/                     # Componentes UI Modulares
│   │   ├── Hero/                       # Hero principal, comparador, badges
│   │   ├── dashboard/                  # Vistas SaaS (Resumen, Servicios, Equipo, SLA, Facturas)
│   │   ├── store/                      # PlanCard 3D, CheckoutModal, TransferInstructions
│   │   ├── layout/                     # Header, Footer, LanguageSwitcher, ThemeToggle
│   │   ├── Effects/                    # Escenas 3D (Aurora, CoffeePortal, Parallax)
│   │   └── shared/                     # Botones, modales, toasters, spinners
│   │
│   ├── core/                           # Lógica de Dominio (Clean Architecture)
│   │   ├── domain/                     # Entidades, servicios, repositories (ports)
│   │   │   ├── auth/                   # Política de contraseñas y validaciones
│   │   │   ├── financial/              # Motor financiero, facturación, comisiones
│   │   │   ├── tenant/                 # Resolución de planes multi-tenant
│   │   │   ├── onboarding/             # Onboarding de workspaces
│   │   │   ├── availability/           # Cálculo dinámico de franjas horarias
│   │   │   ├── reservations/           # Detección de colisiones
│   │   │   └── repositories/           # Interfaces de repositorio (ports)
│   │   │
│   │   ├── infra/                      # Adapters de infraestructura
│   │   │   ├── repositories/           # Implementaciones Supabase + Fakes
│   │   │   └── supabase/               # Cliente Supabase configurado
│   │   │
│   │   ├── auth/                       # Contexto de sesión, guards, resolutor de roles
│   │   ├── i18n/                       # Diccionarios (7 idiomas) + configuración i18next
│   │   ├── theme/                      # ThemeContext, modo oscuro, paleta de colores
│   │   ├── analytics/                  # Integraciones de analítica (Vercel, PostHog)
│   │   └── utils/                      # Utilidades de dominio (errorUtils, validators)
│   │
│   ├── hooks/                          # Custom Hooks Reactivos
│   │   ├── useDashboard/               # Estado y lógica del dashboard
│   │   ├── useAdminDashboard/          # Funciones administrativas
│   │   ├── useTenant/                  # Resolución de tenant actual
│   │   ├── useAuth/                    # Contexto de autenticación
│   │   └── ...
│   │
│   └── types/                          # Tipos TypeScript globales
│
├── supabase/                           # Configuración de Base de Datos
│   ├── migrations/                     # 27 migraciones SQL versionadas
│   │   ├── 001_initial_schema.sql      # Tablas: tenants, auth, workgroups
│   │   ├── 002_sla_contracts.sql       # Contratos SLA
│   │   ├── ...
│   │   └── 027_final_indexes.sql       # Optimizaciones y índices
│   ├── seed.sql                        # Datos de prueba locales
│   └── config.toml                     # Configuración del entorno Supabase
│
├── tests/                              # Suite de Pruebas (Vitest)
│   ├── api/                            # Tests de Route Handlers, webhooks
│   ├── e2e-units/                      # Tests funcionales de Dashboard
│   └── domain/                         # Tests de lógica de negocio
│
├── docs/                               # Documentación Técnica
│   ├── adr/                            # Architecture Decision Records
│   ├── agents/                         # Context para agentes IA
│   └── context/                        # Modelo de dominio formal
│
├── scripts/                            # Scripts de automatización
│   └── setup.sh                        # Setup inicial del proyecto
│
├── web-automation-cli/                 # CLI autónoma para workflows
│
├── public/                             # Assets públicos (imágenes, fuentes)
│
├── email-logos/                        # Logos para templates de email
│
├── .github/                            # GitHub Actions y workflows CI/CD
├── .husky/                             # Git hooks pre-commit
├── .vscode/                            # Configuración de VS Code
│
├── package.json                        # Dependencias y scripts npm
├── tsconfig.json                       # Configuración TypeScript
├── next.config.mjs                     # Configuración Next.js
├── tailwind.config.js                  # Configuración TailwindCSS
├── vitest.config.ts                    # Configuración Vitest
├── playwright.config.ts                # Configuración Playwright E2E
│
├── .env.example                        # Template de variables de entorno
├── .gitignore                          # Archivos ignorados por Git
├── .prettierrc                         # Configuración Prettier
├── eslint.config.js                    # Configuración ESLint
│
└── README.md / CONTRIBUTING.md         # Documentación del proyecto

```

---

## 5. 🔌 Puntos de Integración Clave

### 1. Autenticación OAuth + PKCE
- **Proveedor:** Supabase Auth
- **Flujo:** Google OAuth + Facebook OAuth
- **Ubicación:** `/app/auth/callback/`
- **Sesión:** SSR via `@supabase/ssr`
- **Guard:** `AuthGuard` en `/dashboard` (páginas protegidas)

### 2. Streaming de IA (LLM)
- **Proveedor:** Groq Cloud (modelos: Llama 2 70B, Mixtral 8x7B)
- **Endpoint:** `POST /api/chat`
- **Respuesta:** Server-Sent Events (SSE) stream
- **Ticket:** Auto-generación de `EXE-CHT-*` con clasificación automática
- **Prompt Engineering:** Incluye contexto del dominio de negocio

### 3. Emails Transaccionales + Webhooks Criptográficos
- **Proveedor:** Resend + Svix
- **Templates:** 7 templates preconfigurados (bienvenida, notificación, factura, etc.)
- **Validación:** Firmas SHA-256 en webhook receiver
- **Endpoint:** `POST /api/webhooks/resend`

### 4. Pasarela de Pagos (PayPal)
- **Métodos:** Credit card, PayPal Wallet, Local payment methods
- **Webhook:** `POST /api/paypal-webhook` con validación de firma
- **Generación de Factura:** RPC `create_invoice_from_payment()`
- **Ciclo:** Pago → Webhook → Factura SaaS → Email de confirmación

### 5. Registro de Transferencias Bancarias
- **Endpoint:** `POST /api/register-transfer`
- **Validación:** Comprobante y datos bancarios
- **Lado:** En BD mediante trigger

### 6. Row Level Security (RLS) — Aislamiento Multi-Tenant
- **Modelo:** Cada tabla crítica tiene política RLS
- **Verificación:** `auth.uid()` y validación contra tabla `tenants`
- **Ejemplos:**
  ```sql
  -- Política en tabla 'invoices'
  CREATE POLICY "Usuarios solo ven sus facturas"
    ON invoices
    USING (tenant_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid()));
  ```

---

## 6. 🗄️ Modelo de Datos (DDD)

### Entidades Principales

#### Tenant (Raíz del Agregado)
```typescript
interface Tenant {
  id: UUID;
  slug: string;              // Subdominio único
  name: string;
  email: string;
  subscription_tier: "free" | "pro" | "enterprise";
  trial_expires_at?: Date;
  onboarded_at: Date;
  created_at: Date;
  updated_at: Date;
}
```

#### WorkGroup (Equipo de Trabajo)
```typescript
interface WorkGroup {
  id: UUID;
  tenant_id: UUID;
  name: string;
  description?: string;
  capacity: number;           // Máximo de miembros
  status: "active" | "archived";
  created_at: Date;
}
```

#### ServiceCatalog (Catálogo Global)
```typescript
interface ServiceCatalog {
  id: UUID;
  name: string;
  description: string;
  type: "plan" | "addon" | "professional" | "one_time";
  price_usd: number;
  billing_cycle: "monthly" | "annually" | "one_time";
  features: string[];
}
```

#### TenantService (Suscripción Activa)
```typescript
interface TenantService {
  id: UUID;
  tenant_id: UUID;
  service_id: UUID;
  status: "active" | "cancelled" | "suspended";
  started_at: Date;
  renewal_date: Date;
}
```

#### Invoice (Factura con Numeración Secuencial)
```typescript
interface Invoice {
  id: UUID;
  tenant_id: UUID;
  number: string;            // Ej: "FAC-001-2025"
  amount_usd: number;
  tax: number;
  total: number;
  status: "draft" | "issued" | "paid" | "overdue";
  issued_at: Date;
  due_date: Date;
}
```

#### SLAContract (Acuerdo de Nivel de Servicio)
```typescript
interface SLAContract {
  id: UUID;
  tenant_id: UUID;
  priority_level: "low" | "medium" | "high" | "critical";
  response_time_minutes: number;
  resolution_time_minutes: number;
  uptime_guarantee: number;  // Porcentaje (99.5)
}
```

#### Ticket (Solicitud de Soporte)
```typescript
interface Ticket {
  id: UUID;
  tenant_id: UUID;
  number: string;            // Ej: "EXE-CHT-0001"
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  assigned_to?: UUID;        // WorkMember ID
  created_at: Date;
  resolved_at?: Date;
}
```

#### AuditLog (Trazabilidad)
```typescript
interface AuditLog {
  id: UUID;
  tenant_id: UUID;
  actor_id: UUID;
  action: string;            // Ej: "invoice_created"
  resource_type: string;     // Ej: "Invoice"
  resource_id: UUID;
  changes: Record<string, any>;
  timestamp: Date;
}
```

---

## 7. 🔐 Seguridad

### Medidas Implementadas

✅ **Autenticación:**
- OAuth 2.0 + PKCE (Supabase)
- MFA opcional por email
- Sesiones SSR con refresh token rotation

✅ **Autorización:**
- Row Level Security (RLS) en todas las tablas SaaS
- Resolución de roles mediante RPC `is_admin()`
- Guards en rutas protegidas (`/dashboard`)

✅ **API Security:**
- Rate limiting en endpoints públicos (`/api/contact`, `/api/chat`)
- Validación de entrada con Zod
- Sanitización HTML (XSS prevention)

✅ **Validación de Webhooks:**
- Firmas Svix (SHA-256) para Resend
- Validación de webhooks PayPal por certificado
- Timestamp validation (replay attack prevention)

✅ **Content Security Policy (CSP):**
- Headers HTTP estrictos
- HSTS, X-Frame-Options DENY, Referrer-Policy
- Script-src limitada a dominios trusted

✅ **Datos Sensibles:**
- API keys en variables de entorno (`.env.local` no commiteado)
- Secrets en Vercel Environment
- Supabase Service Role nunca expuesto al cliente

---

## 8. 📊 Métricas de Calidad

### Testing
- **Vitest:** 151 tests passing
- **Cobertura:** Dominio (auth, financial, tenant, onboarding, availability, reservations)
- **Playqwright:** Tests E2E para dashboard y responsive mobile

### Performance (Lighthouse)
- **LCP (Largest Contentful Paint):** < 1.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **Performance Score:** 99+
- **SEO Score:** 100

### Code Quality
- **ESLint:** Max warnings policy (50)
- **TypeScript:** Strict mode habilitado
- **Prettier:** Formato automático en commits

### CI/CD
- **Pipeline:** GitHub Actions (`.github/workflows/verify.yml`)
- **Verificaciones:** TypeScript compilation, ESLint, Tests, Build

---

## 9. 🚀 Stack de Despliegue

| Componente          | Servicio/Plataforma | Detalles                      |
|:------------------|:------------------|:--------------------------|
| **Frontend + API** | Vercel            | Edge network global, SSR, Serverless |
| **Base de Datos**  | Supabase          | PostgreSQL 15 managed cloud |
| **Auth Provider**  | Supabase Auth     | OAuth + PKCE                |
| **Email**          | Resend            | SMTP + API transactional    |
| **LLM**            | Groq Cloud        | API streaming               |
| **Pagos**          | PayPal            | Webhooks + Checkout SDK    |
| **Webhooks**       | Svix              | Webhook relay + signing    |
| **Analytics**      | Vercel/PostHog    | Real-time metrics + product analytics |

---

## 10. 🎯 Endpoints API Backend

### Públicos (Rate Limited)

| Método | Endpoint                    | Descripción                            | Auth      |
|:------|:--------------------------|:-------------------------------------|:---------|
| `POST`| `/api/chat`               | Streaming LLM + creación de ticket   | Pública  |
| `POST`| `/api/contact`            | Formulario de contacto + email       | Pública  |
| `POST`| `/api/register-transfer`  | Registro de transferencia bancaria  | Pública  |

### Webhooks (Signature Validation)

| Método | Endpoint                    | Descripción                         | Validación |
|:------|:--------------------------|:----------------------------------|:-----------|
| `POST`| `/api/webhooks/resend`    | Eventos de Resend + Svix          | Firma SHA-256 |
| `POST`| `/api/paypal-webhook`     | Eventos de pago PayPal            | Firma PayPal  |

### Autenticados (Sesión Supabase)

| Método | Endpoint                    | Descripción                    | Auth          |
|:------|:--------------------------|:------------------------------|:-------------|
| `GET` | `/api/check-admin`        | Validación de rol admin       | Sesión +RPC |
| `POST`| `/api/send-verification`  | Envío de token de verificación | JWT interno |

---

## 11. ⚙️ Configuración de Entorno

### Variables Críticas (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# LLM
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=xxx

# Email
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@exepaginasweb.com
RESEND_WEBHOOK_SIGNING_SECRET=whsec_xxx

# Pagos
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_ENABLED=false
NEXT_PUBLIC_POSTHOG_KEY=xxx
NEXT_PUBLIC_POSTHOG_HOST=xxx
```

---

## 12. 📈 Estado y Roadmap

### ✅ Completado

- [x] Landing page con Hero 3D interactivo
- [x] Autenticación OAuth (Google, Facebook)
- [x] Dashboard multi-tenant con tabs
- [x] Sistema de tickets con auto-assign
- [x] Catalogo de servicios y planes
- [x] Contratos SLA con umbrales
- [x] Facturación con numeración secuencial
- [x] Audit log inmutable
- [x] RLS en todas las tablas
- [x] Login Aurora Borealis + Three.js 3D
- [x] Store page con PlanCard 3D tilt
- [x] Email templates (7 transaccionales)
- [x] PayPal webhook + facturación automática
- [x] Vitest (151 tests)
- [x] i18n (7 idiomas)
- [x] Seguridad XSS, CORS, rate limiting

### 🔄 En Progreso

- [ ] Integración con Supabase real (Vercel envs)
- [ ] Aplicación de migraciones 018-020 en producción
- [ ] Notificaciones push
- [ ] Reportes y analytics por tenant

### 📋 Pendiente

- [ ] Renovaciones automáticas
- [ ] Integración WhatsApp Business API
- [ ] App móvil (React Native o PWA)
- [ ] Tests E2E completos
- [ ] Soporte multitenancy con subdominio dinámico
- [ ] Escalabilidad de IA (modelo local + cloud)

---

## 13. 💡 Recomendaciones

### Corto Plazo (1-2 semanas)
1. Migrar variables a Vercel Environment
2. Ejecutar migraciones SQL pendientes
3. Validar webhooks PayPal en sandbox
4. Completar suite de tests E2E

### Mediano Plazo (1-2 meses)
1. Implementar renovaciones automáticas
2. Agregar notificaciones push (Web + Mobile)
3. Dashboards de analytics por tenant
4. Optimización de imágenes (next/image)

### Largo Plazo (3-6 meses)
1. App móvil nativa (React Native)
2. Escalabilidad global (Multi-region)
3. Integración WhatsApp Business
4. Marketplace de extensiones

---

## 14. 🔗 Referencias Rápidas

| Recurso                | URL/Ubicación                 |
|:---------------------|:---------------------------|
| GitHub Repositorio   | https://github.com/ExeDevCentral/ExePaginasweb |
| Sitio Web Oficial    | https://exepaginasweb.com |
| Email de Contacto    | Contacto@exepaginasweb.com |
| WhatsApp            | +54 9 341 6874786 |
| Documentación Técnica | `/docs/` (ADR, context, agents) |
| Migraciones SQL      | `/supabase/migrations/` |
| Tests                | `/tests/` (151 tests Vitest) |

---

<div align="center">

**🚀 ExeSistemasWEB — Enterprise SaaS Platform**

Construido por **ExeDevCentral** con precisión técnica, seguridad de nivel empresarial y experiencia visual boutique.

© 2025 — Todos los derechos reservados

</div>
