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

- **CORS:** Solo permite origenes whitelisted (`exepaginasweb.com`, `www.exepaginasweb.com`, `VITE_SITE_URL`)
- **Rate Limiting:** 5 requests por hora por IP en `/api/contact`
- **Validacion de entrada:** Campos requeridos validados en cada endpoint
- **Metodos:** Solo POST para contact y webhooks, GET rechazado con 405

## Proteccion XSS

- **Escape HTML:** Todas las entradas de usuario pasan por `escapeHtml()` antes de insertar en templates de email
- **Sanitizacion:** Nombres, emails y mensajes sanitizados en `api/contact.js` y `api/paypal-webhook.js`

## Webhooks

- **PayPal:** Validacion de `PAYPAL_WEBHOOK_ID` — si no esta configurado, el webhook retorna `false` en vez de procesar
- **Resend:** Verificacion de firma svix en `api/webhooks/resend.js`

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

- **Cliente (VITE\_):** Solo `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SITE_URL` — expuestas al browser intencionalmente
- **Servidor:** `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `GROQ_API_KEY` — solo en serverless functions
- **Validacion:** `client.ts` verifica que las variables VITE esten presentes; si estan vacias, usa fallback con placeholder y emite warning por consola

## Reportar Vulnerabilidades

Si encontras una vulnerabilidad, reportala a [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com) con:

1. Descripcion del problema
2. Pasos para reproducir
3. Impacto potencial

Respuesta estimada: 48 horas. Si la vulnerabilidad es aceptada, se aplica fix y se documenta en el commit.
