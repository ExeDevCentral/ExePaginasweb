# Contexto del Proyecto: ExeSistemasWEB

## 1. Identidad y Proposito

Somos un estudio boutique de desarrollo de sistemas web premium enfocado en negocios locales.
Nuestra mision no es simplemente hacer paginas web, sino construir **sistemas de software** que resuelven cuellos de botella operativos:

- Automatizacion de reservas y turnos.
- Gestion de inventario y E-commerce.
- Optimizacion de procesos internos.
- Soporte automatizado con SLA.
- Facturacion y cobros recurrentes.

El objetivo final es permitir que el cliente escale sus ingresos sin sumar horas de gestion manual.

## 2. Tech Stack Core

- **Framework de UI:** React 18+
- **Lenguaje:** TypeScript (Tipado estricto para asegurar la escalabilidad)
- **Tooling:** Vite (Builds extremadamente rapidos)
- **Estilos:** Tailwind CSS + Variables CSS personalizadas (Estetica Enterprise, Glassmorphism, Dark Mode)
- **Animaciones:** Framer Motion (Micro-interacciones fluidas, efectos Spotlight)
- **Toasts:** Sileo (notificaciones animadas sincronizadas con el tema)
- **Despliegue e Infraestructura:** Vercel (Edge network para tiempos de carga en milisegundos)
- **Backend:** Supabase (PostgreSQL 15, Auth, RLS, RPC functions, triggers)

## 3. Arquitectura SaaS Multi-Tenant

El sistema opera como un **SaaS B2B Multi-Tenant**. Cada cliente (negocio) tiene su propio entorno aislado dentro de la misma infraestructura, garantizado mediante Supabase Row Level Security (RLS).

### Entidades Principales

| Entidad           | Descripcion                                           |
| ----------------- | ----------------------------------------------------- |
| `Tenant`          | Negocio/cliente. Raiz del aislamiento de datos        |
| `WorkGroup`       | Equipo de trabajo dentro de un tenant                 |
| `WorkMember`      | Miembro asignado a un work group con rol              |
| `ServiceCatalog`  | Catalogo de servicios disponibles (plan, addon, etc.) |
| `TenantService`   | Suscripcion de un tenant a un servicio del catalogo   |
| `SLAContract`     | Acuerdo de nivel de servicio con umbrales             |
| `Invoice`         | Factura generada con numeracion secuencial            |
| `RenewalSchedule` | Renovaciones programadas de suscripciones             |
| `AuditLog`        | Registro de acciones administrativas con trazabilidad |
| `Ticket`          | Tickets de soporte con prioridad y estado             |

### Tablas de Soporte

| Tabla            | Descripcion                        |
| ---------------- | ---------------------------------- |
| `clientes`       | Perfil por email                   |
| `planes`         | Catalogo de planes                 |
| `suscripciones`  | Que plan tiene activo cada cliente |
| `pagos`          | Historial de cobros                |
| `notificaciones` | Alertas generadas por triggers     |
| `leads`          | Leads capturados desde formularios |
| `webhook_events` | Eventos de webhooks procesados     |

## 4. Principios de Ingenieria

1. **Calidad Visual y Tecnica (Boutique):** Las interfaces deben sentirse responsivas, vivas y profesionales.
2. **Rendimiento (Lighthouse 99+):** Carga perezosa (`React.lazy`), imagenes optimizadas, sin dependencias bloqueantes masivas.
3. **Mantenibilidad:** El codigo debe ser modular, legible y estar estructurado para facilitar la colaboracion.
4. **Documentacion Activa:** Toda decision arquitectonica mayor debe generar un registro en `docs/adr/`.
5. **Seguridad por Defecto:** RLS en todas las tablas, validacion de entradas, rate limiting, CORS restrictivo.

## 5. Sistema de Permisos

- **Admin:** El dueño del tenant. Configura servicios, horarios, empleados, work groups.
- **Client:** El cliente final que agenda turnos desde la web publica.
- **Work Member:** Miembro de un work group que atiende tickets y reservas.
- **Resolucion:** Via RPC `is_admin()` en Supabase, cacheada en cliente con `useAuthRole`.

## 6. Estado Actual

### Completado

- Landing page con Hero 3D interactivo
- Autenticacion Google/Facebook (Supabase PKCE)
- Dashboard multi-tenant con tabs (Resumen, Servicios, Equipo, SLA, Facturas)
- Dashboard i18n (hardcoded strings → t())
- Sistema de tickets con triggers y auto-assign (RPC auto_assign_ticket)
- Work groups y asignacion de miembros
- Catalogo de servicios (plan, addon, professional, one_time)
- Contratos SLA con umbrales por prioridad
- Sistema de facturacion con numeracion secuencial
- Audit log para trazabilidad
- 21 migraciones SQL
- RLS en todas las tablas SaaS
- Seguridad: XSS fixes, CORS validation, rate limiting, webhook validation, AuthGuard en /dashboard
- Store page redesign: PlanCard (3D tilt + glow + particles), PlanGrid, CheckoutModal, TransferInstructions
- Login aurora borealis (canvas + fbm noise + 120 interactive particles) + Three.js 3D scene (5 floating geometrias + 200 particles3D)
- Email templates (7 templates transaccionales via Resend)
- PayPal webhook genera facturas SaaS via create_invoice_from_payment RPC
- Vitest configurado (26 tests passing)

### Pendiente

- Conexion a Supabase real (env vars en Vercel)
- Aplicar migraciones 018-020 en produccion
- Flujos de renovacion automatica
- Notificaciones push
- Reportes y analytics por tenant
- Integracion WhatsApp Business API
- App movil (React Native o PWA avanzada)
- Tests de integracion end-to-end
