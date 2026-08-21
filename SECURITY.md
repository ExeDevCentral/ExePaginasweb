# Security Policy

## Autenticacion

- **Proveedor:** Supabase Auth con flow PKCE (no implicit grant)
- **OAuth:** Google y Facebook via popup mode (compatible con Brave y navegadores restrictivos)
- **Sesion:** `persistSession: true`, `autoRefreshToken: true`
- **Roles:** Resolucion via RPC `is_admin()` en Supabase, cacheada en cliente
- **Guard:** `AuthGuard` y `AdminGuard` protegen rutas privadas del dashboard

## Base de Datos

- **Row Level Security (RLS):** Habilitado en todas las tablas SaaS (tenants, work_groups, work_members, service_catalog, tenant_services, sla_contracts, invoices, audit_log)
- **Aislamiento multi-tenant:** Cada operacion filtra por `tenant_id` via RLS policies
- **Migraciones:** 21 archivos SQL versionados en `supabase/migrations/`
- **Triggers:** Auto-notificacion al crear tickets, auto-asignacion de miembros

## API Endpoints

- **CORS:** Solo permite origenes whitelisted (`exepaginasweb.com`, `www.exepaginasweb.com`, `NEXT_PUBLIC_SITE_URL`)
- **Rate Limiting:** 5 requests por hora por IP en `/api/contact`
- **Validacion de entrada:** Campos requeridos validados en cada endpoint con Zod / esquemas
- **Metodos:** Solo POST para contact y webhooks

## Proteccion XSS

- **Escape HTML:** Todas las entradas de usuario pasan por `escapeHtml()` antes de insertar en templates de email
- **Sanitizacion:** Nombres, emails y mensajes sanitizados en `app/api/contact/route.ts` y `app/api/paypal-webhook/route.ts`

## Webhooks

- **PayPal:** Validacion de `PAYPAL_WEBHOOK_ID` con verificación de firma criptográfica
- **Resend:** Verificacion de firma svix en `app/api/webhooks/resend/route.ts`

## Headers de Seguridad (vercel.json)

| Header                      | Valor                                                                           |
| --------------------------- | ------------------------------------------------------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                                                                       |
| `X-Frame-Options`           | `DENY`                                                                          |
| `X-XSS-Protection`          | `1; mode=block`                                                                 |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                                  |
| `Referrer-Policy`           | `origin-when-cross-origin`                                                      |
| `Permissions-Policy`        | camera=(), microphone=(), geolocation=()                                        |
| `Content-Security-Policy`   | Dominios permitidos: Supabase, PayPal, Chatbase, Resend, Groq, Vercel Analytics |

## Variables de Entorno

- **Cliente (NEXT_PUBLIC\_):** Solo `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — expuestas al browser intencionalmente por Next.js
- **Servidor:** `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY` — solo en Route Handlers / backend
- **Validacion:** `lib/supabase/client.ts` y `admin.ts` verifican variables requeridas con tipado seguro y fallbacks controlados

## Reportar Vulnerabilidades

Si encontras una vulnerabilidad, reportala a [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com) con:

1. Descripcion del problema
2. Pasos para reproducir
3. Impacto potencial

Respuesta estimada: 48 horas. Si la vulnerabilidad es aceptada, se aplica fix y se documenta en el commit.
