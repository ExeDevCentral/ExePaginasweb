# 🧪 Suite de Pruebas Automatizadas — Vitest & Testing Library

Este directorio y la suite de pruebas del proyecto garantizan la integridad, seguridad y correcto funcionamiento de toda la lógica de negocio, pasarelas de pago, webhooks y componentes visuales de **ExeSistemasWEB**.

---

## 📊 Cobertura y Estructura de Tests

El arnés de pruebas cuenta con **17 suites de test** y más de **98 casos de prueba automatizados** ejecutados con `Vitest`.

```
tests/ y src/
├── Motores de Dominio (Domain Engines)
│   ├── financialEngine.test.ts          # Cálculos de facturación, cuotas e impuestos
│   ├── tenantConfigResolver.test.ts     # Resolución y cascada de configuración multi-tenant
│   ├── availabilityEngine.test.ts       # Disponibilidad de agenda y cálculo de bloques
│   ├── conflictDetector.test.ts         # Prevención y detección de solapamiento de turnos
│   ├── reservationService.test.ts       # Ciclo de vida de reservas y estados
│   └── slotGenerator.test.ts            # Generación de franjas horarias configurables
│
├── Infraestructura & Repositorios
│   ├── SupabaseTenantRepository.test.ts # Contratos de persistencia y mapeo de datos
│   ├── useTenant.test.ts                # React Query hooks y cache asíncrona
│   └── errorUtils.test.ts               # Sanitización y formateo de excepciones
│
├── Componentes de Interfaz de Usuario (UI)
│   ├── CheckoutModal.test.tsx           # Modales de pago (PayPal / Transferencias)
│   ├── InvoicesPanel.test.tsx           # Renderizado de facturas y estados de pago
│   └── resolvePlanTier.test.ts          # Clasificación y badge de planes SaaS
│
└── Backend, APIs & Webhooks
    ├── tests/api/audit/system-audit.test.js    # Auditoría integral: Chatbot, Contacto y Tickets
    ├── tests/api/webhooks/resend.test.js       # Verificación de firma Svix y eventos de email
    ├── tests/api/saas-clients-payments.test.js # Flujos de clientes y cobranzas
    ├── tests/e2e-units/dashboard-services-auth # Permisos y autenticación en Dashboard
    └── tests/e2e-units/responsive-mobile.test  # Navegación y soporte táctil mobile
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
