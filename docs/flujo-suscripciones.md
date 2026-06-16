# Flujo: Suscripción y Pago con PayPal

## Resumen del flujo

1. El cliente entra con **Google** o correo electrónico → se almacena en `auth.users` y se vincula con la tabla `clientes`.
2. En **/tienda** elige un abono → se abre un modal con el botón de **PayPal Hosted Buttons** o el botón nativo de PayPal.
3. El cliente completa el proceso de pago seguro a través de la interfaz de PayPal.
4. Una vez completado, el cliente es redirigido a `/dashboard?payment=paypal_ok`.
5. PayPal envía un **webhook** (`CHECKOUT.ORDER.APPROVED`) a `/api/paypal-webhook`.
6. El webhook de PayPal:
   - Valida el token de acceso de PayPal.
   - Captura el pago utilizando la API de PayPal (`POST /v2/checkout/orders/{id}/capture`).
   - Obtiene el correo electrónico del pagador y el `custom_id` (que contiene el slug del plan, el email original y el tipo de proyecto).
   - Busca o crea un registro para el cliente en Supabase.
   - Registra el pago en la tabla `pagos` con `provider: 'paypal'`.
   - Crea/actualiza la suscripción en la tabla `suscripciones`.
   - Envía un correo electrónico de confirmación de pago a través de **Resend**.

## Tablas clave

| Tabla           | Qué guarda                                            |
| --------------- | ----------------------------------------------------- |
| `clientes`      | Perfil por email (mismo que Google/registro)          |
| `planes`        | Catálogo: `slug` + nombre (3 abonos)                  |
| `suscripciones` | Qué plan tiene activo cada cliente                    |
| `pagos`         | Historial de cobros + `plan_slug` + `paypal_order_id` |

## Variables de entorno

| Variable                    | Dónde se usa                                    |
| --------------------------- | ----------------------------------------------- |
| `PAYPAL_CLIENT_ID`          | Backend (`api/create-paypal-order.js`, webhook) |
| `PAYPAL_CLIENT_SECRET`      | Backend (`api/create-paypal-order.js`, webhook) |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook (`api/paypal-webhook.js`)               |
| `RESEND_API_KEY`            | Envío de correo de confirmación                 |

## Endpoints API

| Endpoint                   | Método | Propósito                                    |
| -------------------------- | ------ | -------------------------------------------- |
| `/api/create-paypal-order` | POST   | Inicia la orden de PayPal                    |
| `/api/paypal-webhook`      | POST   | Recibe notificaciones de PayPal para captura |
