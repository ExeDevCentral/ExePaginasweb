# 📚 Centro de Documentación Técnica — ExeSistemasWEB

Bienvenido al índice central de documentación de **ExeSistemasWEB**. Este directorio contiene especificaciones arquitectónicas, modelos de dominio, guías de configuración y registros de decisiones clave (ADR).

---

## 🗂️ Estructura de Documentación

```
docs/
├── adr/                      # Architecture Decision Records (Decisiones Fundacionales)
│   ├── 0001-stack-tecnico-base.md
│   ├── 0002-adopcion-supabase-baas.md
│   ├── 0003-patron-repositorio.md
│   ├── 0004-migracion-nextjs-app-router-ecosistema.md
│   ├── 0005-desacople-dashboard-hooks-de-supabase.md
│   └── 0006-onboarding-y-politica-contrasenas-fuera-de-componentes.md
│
├── agents/                   # Contexto e Instrucciones para Agentes de IA
│   ├── domain.md             # Pautas del modelo de dominio único
│   ├── issue-tracker.md      # Protocolo de tracking de issues en GitHub
│   └── triage-labels.md      # Sistema de etiquetas canónicas
│
├── context/                  # Modelo de Dominio y Vocabulario Ubicuo
│   ├── domain-model.md       # Entidades, agregados y reglas de negocio
│   └── schema.sql            # Esquema SQL consolidado de base de datos
│
├── flujo-suscripciones.md    # Ciclo de vida de facturas y pagos recurrentes
├── paypal-env.md             # Configuración de PayPal (Sandbox/Production)
├── paypal-env.local.md       # Variables locales de PayPal
├── supabase-env.local.md     # Variables locales de Supabase
├── vercel-env-setup.md       # Configuración de despliegue en Vercel
│
├── archive/                  # Documentos Históricos y Registros Anteriores
│   ├── README.md
│   └── README_FUTURO.md
```

---

## 🏛️ Architecture Decision Records (ADRs)

Los ADRs documentan decisiones de diseño estructural de alto impacto tomadas a lo largo de la evolución de la plataforma:

1. **[ADR 0001: Stack Técnico Base](./adr/0001-stack-tecnico-base.md)** — Selección inicial de TypeScript, React y TailwindCSS.
2. **[ADR 0002: Adopción de Supabase BaaS](./adr/0002-adopcion-supabase-baas.md)** — Estrategia de persistencia con PostgreSQL, RLS y autenticación federada.
3. **[ADR 0003: Patrón Repositorio](./adr/0003-patron-repositorio.md)** — Desacoplamiento de la lógica de dominio respecto a la capa de base de datos.
4. **[ADR 0004: Migración a Next.js App Router](./adr/0004-migracion-nextjs-app-router-ecosistema.md)** — Transición hacia Next.js 16+ con Turbopack, Route Handlers y Server Components.
5. **[ADR 0005: Desacople del Dashboard y Hooks](./adr/0005-desacople-dashboard-hooks-de-supabase.md)** — Desacoplamiento de useDashboard/useAdminDashboard de Supabase e inyección por parámetro.
6. **[ADR 0006: Onboarding y Política de Contraseñas](./adr/0006-onboarding-y-politica-contrasenas-fuera-de-componentes.md)** — Extracción de lógica de dominio fuera de componentes UI hacia servicios puros.

---

## 🧭 Guías de Configuración de Entorno

- **[Flujo de Suscripciones](./flujo-suscripciones.md):** Ciclo de vida de facturas, pagos recurrentes y conciliación de planes.
- **[Variables de Supabase](./supabase-env.local.md):** Configuración de keys públicas y privadas (`SERVICE_ROLE`).
- **[Integración con PayPal](./paypal-env.md):** Configuración de credenciales de Sandbox y Production, y suscripción a Webhooks.
- **[Despliegue en Vercel](./vercel-env-setup.md):** Parámetros de entorno, cabeceras CSP y optimización de Edge Network.

---

## 🤖 Protocolo para Agentes de Desarrollo

Para interactuar con el código respetando los estándares del repositorio, consulta:

- [Reglas de Dominio](./agents/domain.md)
- [Gestión de Issues en GitHub](./agents/issue-tracker.md)
- [Taxonomía de Etiquetas de Triaje](./agents/triage-labels.md)
