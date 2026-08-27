# 🗄️ Supabase Database & Backend Architecture

Este directorio contiene toda la infraestructura de base de datos relacional PostgreSQL 15, políticas de seguridad por fila (RLS), procedimientos almacenados (RPC) y migraciones de **ExeSistemasWEB**.

---

## 🏗️ Modelo de Aislamiento Multi-Tenant

La base de datos implementa un esquema SaaS Multi-Tenant robusto donde los datos de cada cliente (**Tenant**) están estrictamente aislados mediante **Row Level Security (RLS)** a nivel de base de datos.

```
                              ┌────────────────┐
                              │  auth.users    │
                              └───────┬────────┘
                                      │
                                      ▼
                              ┌────────────────┐
                              │    clientes    │
                              └───────┬────────┘
                                      │ (1:N)
                                      ▼
                              ┌────────────────┐
                              │    tenants     │
                              └───────┬────────┘
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   work_groups    │        │  tenant_services │        │   sla_contracts  │
└─────────┬────────┘        └──────────────────┘        └──────────────────┘
          │ (1:N)                     │ (1:N)                     │
          ▼                           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   work_members   │        │     invoices     │        │     tickets      │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

---

## 📜 Migraciones SQL Versionadas (`supabase/migrations/`)

El ciclo de vida del esquema de datos está gobernado por migraciones incrementales:

| Migración                               | Módulo / Propósito                                                                                        |
| :-------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `000_clientes.sql`                      | Tabla central de perfiles de clientes vinculada a `auth.users`.                                           |
| `001_pagos.sql`                         | Registro histórico de cobros y transacciones.                                                             |
| `002_clientes_rls.sql`                  | Políticas RLS iniciales para aislamiento de perfiles.                                                     |
| `003_planes_subscriptions.sql`          | Catálogo de planes SaaS y asignación de suscripciones activas.                                            |
| `004_tickets.sql`                       | Sistema base de tickets de soporte con estados y prioridades.                                             |
| `005_infra_booking.sql`                 | Infraestructura de reservas, slots y disponibilidad de turnos.                                            |
| `006_rpc_subscription.sql`              | Procedimientos almacenados para actualización transaccional de suscripciones.                             |
| `007_fix_auth_trigger.sql`              | Trigger automático de aprovisionamiento de perfil en `auth.users` insert.                                 |
| `008_payment_integration.sql`           | Columnas y campos para pasarelas de pago (PayPal, transferencias).                                        |
| `009_orders_api.sql`                    | Soporte de órdenes y pedidos e-commerce.                                                                  |
| `010_admin_policies.sql`                | Políticas de acceso privilegiado para administradores del sistema.                                        |
| `011_fix_tickets_and_notifications.sql` | Triggers de notificación en cambios de estado de tickets.                                                 |
| `012_add_missing_ticket_columns.sql`    | Extensión de metadatos y tracking de tickets.                                                             |
| `013_leads.sql`                         | Captura y almacenamiento de prospectos de formularios.                                                    |
| `014_admin_roles.sql`                   | Función RPC `is_admin()` para resolución eficiente de permisos.                                           |
| `015_fix_tickets_policy.sql`            | Corrección de permisos de lectura y escritura en soporte.                                                 |
| `016_webhook_events.sql`                | Tabla de auditoría e idempotencia para webhooks de PayPal y Resend.                                       |
| `017_lead_rate_limit.sql`               | Control de tasa de peticiones y mitigación de spam en formularios.                                        |
| `018_saas_core.sql`                     | Definición de entidades Multi-Tenant: `tenants`, `work_groups`, `sla_contracts`, `invoices`, `audit_log`. |
| `019_saas_rls.sql`                      | Políticas RLS completas para el ecosistema Multi-Tenant.                                                  |
| `020_saas_functions.sql`                | RPCs avanzadas: `auto_assign_ticket`, `create_invoice_from_payment`.                                      |
| `021_fix_rls_recursion.sql`             | Optimización de subconsultas RLS para eliminar recursión infinita.                                        |
| `022_create_workspace_rpc.sql`          | RPC transaccional para aprovisionar un Workspace/Tenant completo en un paso.                              |
| `023_fix_rpc_use_full_name.sql`         | Normalización de campos de nombre en auth metadata.                                                       |
| `024_add_clientes_updated_at.sql`       | Trigger de actualización de timestamps (`updated_at`).                                                    |
| `025_fix_rpc_work_groups_normalize.sql` | Normalización y tipado de respuestas JSON en work groups.                                                 |
| `026_fix_rls_circular_recursion.sql`    | Refactorización final de directivas de seguridad para máxima velocidad.                                   |

---

## ⚙️ Procedimientos Almacenados Clave (RPC)

1. **`is_admin()`**
   - Determina en tiempo constante si el usuario autenticado posee rol de administrador global o de tenant.
2. **`auto_assign_ticket(p_ticket_id, p_tenant_id)`**
   - Evalúa la carga actual de los Work Groups del tenant y asigna el ticket al grupo con menor número de casos activos.
3. **`create_invoice_from_payment(p_payment_data)`**
   - Ejecutado de forma segura por el webhook de PayPal para emitir facturas secuenciales y actualizar el estado de suscripción.
4. **`create_workspace(p_name, p_plan_id)`**
   - Aprovisiona atómicamente el Tenant, el Work Group por defecto (`General`), el contrato SLA y la suscripción inicial.

---

## 🛠️ Comandos de Supabase CLI

```bash
# Iniciar entorno local de Supabase (Docker)
supabase start

# Enlazar proyecto remoto en Supabase Cloud
npm run supabase:link

# Aplicar migraciones pendientes a la base de datos remota
npm run supabase:push

# Desplegar Edge Functions si aplica
npm run supabase:deploy
```

---

## 🔒 Buenas Prácticas de Seguridad en PostgreSQL

- **RLS Siempre Activo:** Ninguna tabla pública queda sin directiva `ENABLE ROW LEVEL SECURITY`.
- **Search Path Seguro:** Todas las funciones `SECURITY DEFINER` declaran explícitamente `SET search_path = public`.
- **Foreign Keys Indexadas:** Todas las relaciones foráneas cuentan con índices `B-Tree` para evitar table scans lentos.
