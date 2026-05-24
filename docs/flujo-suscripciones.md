# Flujo: quién pagó qué plan y qué panel ve

## Resumen

1. El cliente entra con **Google** → email en `auth.users` y fila en `clientes`.
2. En **/tienda** elige un abono → Mercado Pago recibe `planId` (`mantenimiento-basico`, etc.).
3. Al aprobar el pago, el **webhook** escribe en Supabase:
   - `pagos` (monto, `plan_slug`, `plan_nombre`, email del pagador)
   - `suscripciones` (cliente + plan activo; las anteriores pasan a `cancelada`)
4. En **/dashboard**, el login es el mismo email → se lee la suscripción activa → `resolvePlanTier()` elige el panel (básico / avanzado / premium).

## Tablas clave

| Tabla | Qué guarda |
|-------|------------|
| `clientes` | Perfil por email (mismo que Google) |
| `planes` | Catálogo: `slug` + nombre (3 abonos) |
| `suscripciones` | Qué plan tiene activo cada cliente |
| `pagos` | Historial de cobros + `plan_slug` |

## Importante: mismo email

El webhook identifica al cliente por el **email del pagador en Mercado Pago**. Debe ser el mismo con el que inició sesión en Google; si no, el pago queda en otro `cliente` y el panel no muestra el plan.

## Migración en Supabase

Ejecutar en SQL Editor (en orden):

- `supabase/migrations/002_clientes_rls.sql`
- `supabase/migrations/003_planes_subscriptions.sql`

Variables en Vercel para el webhook: `SUPABASE_SERVICE_ROLE_KEY`, `MERCADOPAGO_ACCESS_TOKEN`.

## Vista previa sin pago

`/dashboard?tier=basico` | `avanzado` | `premium` — solo para probar diseño.

## Tickets de soporte (Supabase)

Migración: `supabase/migrations/004_tickets.sql`

- Tabla `tickets`: asunto, mensaje, categoría, prioridad (según plan), estado.
- Tabla `notificaciones`: aviso in-app al crear ticket (“Pulse del servicio”).
- Botón **Abrir ticket** en el panel → modal → guarda en Supabase con RLS por email.

Prioridad automática: Básico = baja, Avanzado = normal, Premium = alta.
