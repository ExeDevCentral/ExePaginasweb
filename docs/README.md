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
│   └── 0004-migracion-nextjs-app-router-ecosistema.md
│
├── agents/                   # Contexto e Instrucciones para Agentes de IA
│   ├── domain.md             # Pautas del modelo de dominio único
│   ├── issue-tracker.md      # Protocolo de tracking de issues en GitHub
│   └── triage-labels.md      # Sistema de etiquetas canónicas
│
├── context/                  # Modelo de Dominio y Vocabulario Ubicuo
│   └── domain-model.md       # Entidades, agregados y reglas de negocio
│
├── infra/                    # Infraestructura y Esquemas
│   └── schema.sql            # Esquema SQL consolidado de base de datos
│
├── env-setup/                # Guías de Configuración de Entorno
│   ├── flujo-suscripciones.md
│   ├── paypal-env.md
│   ├── paypal-env.local.md
│   ├── supabase-env.local.md
│   └── vercel-env-setup.md
│
└── archive/                  # Documentos Históricos y Registros Anteriores
    └── README.md
```

---

## 🏛️ Architecture Decision Records (ADRs)

Los ADRs documentan decisiones de diseño estructural de alto impacto tomadas a lo largo de la evolución de la plataforma:

1. **[ADR 0001: Stack Técnico Base](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/adr/0001-stack-tecnico-base.md)** — Selección inicial de TypeScript, React y TailwindCSS.
2. **[ADR 0002: Adopción de Supabase BaaS](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/adr/0002-adopcion-supabase-baas.md)** — Estrategia de persistencia con PostgreSQL, RLS y autenticación federada.
3. **[ADR 0003: Patrón Repositorio](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/adr/0003-patron-repositorio.md)** — Desacoplamiento de la lógica de dominio respecto a la capa de base de datos.
4. **[ADR 0004: Migración a Next.js App Router](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/adr/0004-migracion-nextjs-app-router-ecosistema.md)** — Transición hacia Next.js 16+ con Turbopack, Route Handlers y Server Components.

---

## 🧭 Guías de Configuración de Entorno

- **[Flujo de Suscripciones](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/flujo-suscripciones.md):** Ciclo de vida de facturas, pagos recurrentes y conciliación de planes.
- **[Variables de Supabase](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/supabase-env.local.md):** Configuración de keys públicas y privadas (`SERVICE_ROLE`).
- **[Integración con PayPal](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/paypal-env.md):** Configuración de credenciales de Sandbox y Production, y suscripción a Webhooks.
- **[Despliegue en Vercel](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/vercel-env-setup.md):** Parámetros de entorno, cabeceras CSP y optimización de Edge Network.

---

## 🤖 Protocolo para Agentes de Desarrollo

Para interactuar con el código respetando los estándares del repositorio, consulta:

- [Reglas de Dominio](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/agents/domain.md)
- [Gestión de Issues en GitHub](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/agents/issue-tracker.md)
- [Taxonomía de Etiquetas de Triaje](file:///C:/Users/exeme/Desktop/ExePaginasweb/docs/agents/triage-labels.md)
