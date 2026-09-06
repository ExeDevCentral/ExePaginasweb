# Security Policy

## Autenticacion

- **Proveedor:** Supabase Auth con flow PKCE (no implicit grant)
- **OAuth:** Google y Facebook via popup mode (compatible con Brave y navegadores restrictivos)
- **Sesion:** `persistSession: true`, `autoRefreshToken: true`; `queryClient.clear()` al cerrar sesion para evitar cache entre usuarios
- **Roles:** Resolucion via RPC `is_admin()` en Supabase, cacheada en cliente; errores de resolucion no degradan silenciosamente a `client`
- **Guard:** `proxy.ts` (`middleware`) protege `/dashboard/:path*`, `AuthGuard` y `AdminGuard` protegen rutas privadas; el preview/demo (`isLocalDashboardPreview`) solo se activa fuera de produccion
- **Redirecciones:** `sanitizeInternalPath()` evita open-redirect en login/callback; el origen del callback se valida contra configuracion

## Base de Datos

- **Row Level Security (RLS):** Habilitado en todas las tablas SaaS (tenants, work_groups, work_members, service_catalog, tenant_services, sla_contracts, invoices, audit_log)
- **Aislamiento multi-tenant:** Cada operacion filtra por `tenant_id` via RLS policies
- **Migraciones:** 28 archivos SQL versionados en `supabase/migrations/`
- **Triggers:** Auto-notificacion al crear tickets, auto-asignacion de miembros
- **RPCs privilegiadas:** `SECURITY DEFINER` con `search_path` fijo; se revoca `EXECUTE` de `PUBLIC`/`anon` (010_extra_rpcs, 026, 027/028); `create_workspace` exige `auth.uid() = p_dueno_id`; `create_invoice_from_payment` valida pertenencia del pago al tenant y es idempotente

## API Endpoints

- **CORS:** Solo permite origenes whitelisted (`exepaginasweb.com`, `www.exepaginasweb.com`, `NEXT_PUBLIC_SITE_URL`)
- **Rate Limiting:** Distribuido vía RPC `check_api_rate_limit` en Postgres (028 `durable_api_rate_limits`) para `/api/contact` (5/h), `/api/chat` (10/min), `/api/register-transfer` (10/h) y `/api/send-verification` (5/h); responde `429` con `Retry-After` y `503` si el RPC falla
- **Validacion de entrada:** Campos requeridos validados en cada endpoint con Zod / esquemas
- **Metodos:** Solo POST para contact y webhooks
- **register-transfer:** Requiere Bearer token valido, el email del token debe coincidir con la cuenta, e `Idempotency-Key` (16-128 chars) para reejecuciones seguras
- **send-verification:** Solo accesible con `VERIFICATION_API_KEY` interna (comparacion `timingSafeEqual`); devuelve `404` sin autorizacion y nunca filtra detalles internos
- **chat:** El historial previo se convierte a `role: 'user'` con prefijo "[Historial no confiable]" para evitar prompt injection

## Proteccion XSS

- **Escape HTML:** Todas las entradas de usuario pasan por `escapeHtml()` antes de insertar en templates de email
- **Sanitizacion:** Nombres, emails y mensajes sanitizados en `app/api/contact/route.ts` y `app/api/paypal-webhook/route.ts`; el cuerpo de emails entrantes se escapa (`stripHtml` + `escapeHtml`) antes de inyectarse en notificaciones

## Webhooks

- **PayPal:** Fail-closed: sin `PAYPAL_WEBHOOK_ID` o config de Supabase responde `503`; JSON invalido `400`; firma no verificada `403`; montos deben ser positivos finitos en USD. Reclamos duraderos con `webhook_events` (duplicados por `provider_event_id`, reapropiacion de `processing` stale tras 5 min)
- **Resend:** Verificacion de firma svix en `app/api/webhooks/resend/route.ts`; requiere `RESEND_API_KEY`; fallos de procesamiento marcan el webhook como fallido

## Headers de Seguridad (next.config.mjs)

| Header                      | Valor                                                                           |
| --------------------------- | ------------------------------------------------------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                                                                       |
| `X-Frame-Options`           | `DENY`                                                                          |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                                  |
| `Referrer-Policy`           | `origin-when-cross-origin`                                                      |
| `Permissions-Policy`        | camera=(), microphone=(), geolocation=()                                        |
| `Content-Security-Policy`   | `default-src 'self'`; `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`; dominios permitidos: Supabase, PayPal, Chatbase, Resend, Groq, Vercel Analytics; `unsafe-eval`/WS solo en dev |

## Variables de Entorno

- **Cliente (NEXT_PUBLIC\_):** Solo `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `NEXT_PUBLIC_ENABLE_VERCEL_TELEMETRY` — expuestas al browser intencionalmente por Next.js
- **Servidor:** `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY` — solo en Route Handlers / backend
- **Validacion:** `lib/supabase/client.ts`, `server.ts` y `admin.ts` verifican variables requeridas y **fallan explicitamente** (sin fallbacks de secretos); `isSupabaseAdminConfigured()` centraliza la deteccion de config

## Reportar Vulnerabilidades

Si encontras una vulnerabilidad, reportala a [Exemetal@hotmail.com](mailto:Exemetal@hotmail.com) con:

1. Descripcion del problema
2. Pasos para reproducir
3. Impacto potencial

Respuesta estimada: 48 horas. Si la vulnerabilidad es aceptada, se aplica fix y se documenta en el commit.