# Flujo: Suscripcion, Pago y Facturacion SaaS

## Resumen del Flujo

### 1. Registro y Autenticacion

1. El cliente entra con **Google** o **Facebook** via Supabase Auth (flow PKCE, popup mode).
2. Se almacena en `auth.users` y se vincula con la tabla `clientes`.
3. El rol se resuelve via RPC `is_admin()` y se cachea en el cliente.

### 2. Suscripcion a Servicio

1. En **/tienda** elige un servicio del catalogo (`service_catalog`).
2. Se crea un registro en `tenant_services` con estado `activo`.
3. Se genera un `sla_contract` asociado al tenant con los umbrales correspondientes.
4. Se programa un `renewal_schedule` para la proxima renovacion.

### 3. Facturacion

1. Cuando se genera un pago, se crea un `invoice` con numeracion secuencial via RPC `generate_invoice_number()`.
2. La factura se asocia al `tenant_id` y al `tenant_service_id`.
3. El estado de la factura cambia: `pendiente` -> `pagada` / `vencida` / `cancelada`.
4. Las renovaciones programadas se procesan via RPC `process_pending_renewals()`.

### 4. Webhook PayPal (Legacy)

1. PayPal envia un webhook (`CHECKOUT.ORDER.APPROVED`) a `/api/paypal-webhook`.
2. El webhook valida el `PAYPAL_WEBHOOK_ID`.
3. Captura el pago via API de PayPal.
4. Registra el pago en la tabla `pagos`.
5. Crea/actualiza la suscripcion en `suscripciones`.
6. Envia email de confirmacion via Resend.

## Tablas Clave

| Tabla               | Que guarda                                             |
| ------------------- | ------------------------------------------------------ |
| `service_catalog`   | Catalogo de servicios disponibles (slug, precio, tipo) |
| `tenant_services`   | Que servicio tiene activo cada tenant                  |
| `sla_contracts`     | Acuerdos de nivel de servicio por tenant               |
| `invoices`          | Facturas con numeracion secuencial                     |
| `invoice_sequences` | Contador de facturacion por tenant                     |
| `renewal_schedule`  | Renovaciones programadas de suscripciones              |
| `audit_log`         | Registro de acciones administrativas                   |
| `clientes`          | Perfil por email                                       |
| `planes`            | Catalogo de planes legacy                              |
| `suscripciones`     | Suscripciones legacy                                   |
| `pagos`             | Historial de cobros                                    |

## Tipos de Servicio

| Tipo           | Ejemplo                   | Renovacion     |
| -------------- | ------------------------- | -------------- |
| `plan`         | Plan Basico $20/mes       | Mensual        |
| `addon`        | Chat IA adicional         | Mensual        |
| `professional` | Consultoria personalizada | Trimestral     |
| `one_time`     | Configuracion inicial     | Sin renovacion |

## RPC Functions

| Funcion                         | Proposito                                      |
| ------------------------------- | ---------------------------------------------- |
| `generate_invoice_number()`     | Genera numero secuencial de factura por tenant |
| `create_invoice_from_payment()` | Crea factura desde un pago completado          |
| `check_sla_breaches()`          | Detecta contratos SLA vencidos                 |
| `auto_assign_ticket()`          | Asigna automaticamente un ticket a un miembro  |
| `process_pending_renewals()`    | Procesa renovaciones vencidas                  |
| `get_tenant_stats()`            | Estadisticas agregadas del tenant              |
| `is_admin()`                    | Verifica si el usuario es admin                |
| `log_audit()`                   | Registra accion en audit_log                   |

## Variables de Entorno

| Variable                    | Donde se usa                     |
| --------------------------- | -------------------------------- |
| `PAYPAL_CLIENT_ID`          | Backend (webhook)                |
| `PAYPAL_CLIENT_SECRET`      | Backend (webhook)                |
| `PAYPAL_WEBHOOK_ID`         | Backend (validacion de webhooks) |
| `PAYPAL_API_BASE`           | Backend (sandbox o produccion)   |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook y RPC functions          |
| `RESEND_API_KEY`            | Envio de correo de confirmacion  |

## Endpoints API

| Endpoint               | Metodo | Proposito                                    |
| ---------------------- | ------ | -------------------------------------------- |
| `/api/paypal-webhook`  | POST   | Recibe notificaciones de PayPal para captura |
| `/api/contact`         | POST   | Formulario de contacto -> Resend email       |
| `/api/chat`            | POST   | Chat IA streaming con Groq                   |
| `/api/check-admin`     | GET    | Verifica rol de admin                        |
| `/api/test-paypal`     | GET    | Test de conexion con PayPal                  |
| `/api/webhooks/resend` | POST   | Webhook de Resend (svix signature)           |
