# Paypal — Variables de Entorno

Agregar en Vercel (Environment Variables):

| Key                     | Value                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| `PAYPAL_CLIENT_ID`      | Client ID de PayPal Developer Dashboard                                          |
| `PAYPAL_CLIENT_SECRET`  | Secret de PayPal Developer Dashboard                                             |
| `PAYPAL_WEBHOOK_ID`     | Webhook ID de PayPal Developer Dashboard                                         |
| `VITE_PAYPAL_CLIENT_ID` | Mismo valor que `PAYPAL_CLIENT_ID`                                               |
| `PAYPAL_API_BASE`       | `https://api-m.sandbox.paypal.com` (sandbox) o `https://api-m.paypal.com` (live) |

Webhook URL: `https://exepaginasweb.com/api/paypal-webhook`

## Sandbox vs Live

- **Sandbox**: `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`
- **Live**: `PAYPAL_API_BASE=https://api-m.paypal.com`

Las credenciales sandbox son para pruebas. Para producción, usar las credenciales live de PayPal Developer Dashboard.
