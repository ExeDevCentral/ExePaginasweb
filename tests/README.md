# 🧪 Suite de Pruebas Automatizadas — Vitest & Testing Library

Este directorio y la suite de pruebas del proyecto garantizan la integridad, seguridad y correcto funcionamiento de toda la lógica de negocio, pasarelas de pago, webhooks y componentes visuales de **ExeSistemasWEB**.

---

## 📊 Cobertura y Estructura de Tests

El arnés de pruebas cuenta con **27 suites de test** y **151 casos de prueba** ejecutados con `Vitest`.

```
tests/ y src/
├── Backend, APIs & Webhooks
│   ├── api/audit/system-audit.test.js         # Auditoría integral: Chatbot, Contacto y Tickets
│   ├── api/webhooks/resend.test.js            # Verificación de firma Svix y eventos de email
│   ├── api/saas-clients-payments.test.js      # Flujos de clientes y cobranzas
│   ├── e2e-units/dashboard-services-auth.test.ts # Permisos y autenticación en Dashboard
│   └── e2e-units/responsive-mobile.test.ts       # Navegación y soporte táctil mobile
│
├── Motores de Dominio (Domain Engines)
│   ├── financialEngine.test.ts                # Cálculos de facturación, cuotas e impuestos
│   ├── computeAdminStats.test.ts              # Estadísticas administrativas (función pura)
│   ├── tenantConfigResolver.test.ts           # Resolución y cascada de configuración multi-tenant
│   ├── availabilityEngine.test.ts             # Disponibilidad de agenda y cálculo de bloques
│   ├── conflictDetector.test.ts               # Prevención y detección de solapamiento de turnos
│   ├── reservationService.test.ts             # Ciclo de vida de reservas y estados
│   └── slotGenerator.test.ts                  # Generación de franjas horarias configurables
│
├── Política y Autenticación
│   └── passwordPolicy.test.ts                 # Validación de contraseñas (longitud, mayúsculas, etc.)
│
├── Onboarding de Workspaces
│   ├── workspaceOnboarding.test.ts            # Funciones puras (slug, trial, validación)
│   └── WorkspaceOnboardingService.test.ts     # Servicio con ITenantRepository inyectado
│
├── Infraestructura & Repositorios
│   ├── SupabaseTenantRepository.test.ts       # Contratos de persistencia (CRUD + create_workspace)
│   ├── SupabaseClientePagoRepository.test.ts  # Pagos de clientes (adapters Supabase)
│   ├── SupabaseAuthRepository.test.ts         # Perfiles y cambio de contraseña
│   └── useTenant.test.ts                      # React Query hooks y caché asíncrona
│
├── Hooks del Dashboard
│   ├── useDashboard.test.ts                   # useDashboard (IClienteRepository, ISubscriptionRepository)
│   └── useAdminDashboard.test.ts              # useAdminDashboard (IAdminDashboardRepository, computeAdminStats)
│
├── Componentes de Interfaz (UI)
│   ├── DashboardView.test.ts                   # Registry de tabs y navegación del dashboard
│   ├── CheckoutModal.test.tsx                 # Modales de pago (PayPal / Transferencias)
│   ├── InvoicesPanel.test.tsx                 # Renderizado de facturas y estados de pago
│   └── resolvePlanTier.test.ts                # Clasificación y badge de planes SaaS
│
└── Utilidades
    └── errorUtils.test.ts                     # Sanitización y formateo de excepciones
```

---

## 🚀 Ejecución de Pruebas

```bash
# Ejecutar toda la suite de pruebas una sola vez (modo CI)
npm test

# Ejecutar pruebas en modo observador interactivo (Watch Mode)
npm run test:watch

# Filtrar ejecución por nombre de archivo específico
npx vitest run system-audit
npx vitest run financialEngine
```

---

## 🔒 Pruebas Críticas de Seguridad y Webhooks

### 1. Verificación de Firma Criptográfica Svix (`tests/api/webhooks/resend.test.js`)

- Valida que cualquier webhook entrante sin firma o con firma manipulada sea rechazado inmediatamente con código HTTP `400` / `401`.
- Simula eventos reales de Resend: `email.delivered`, `email.bounced`, `email.complained`, `email.opened`, `email.clicked`, `email.received`.

### 2. Auditoría de Chatbot y Contacto (`tests/api/audit/system-audit.test.js`)

- Comprueba la generación de identificadores únicos de ticket con formato de trazabilidad (`EXE-CHT-XXXXX` y `EXE-CNT-XXXXX`).
- Verifica el comportamiento bilingüe del procesador de contacto (respuestas automáticas en Español o Inglés según el idioma del cliente).
