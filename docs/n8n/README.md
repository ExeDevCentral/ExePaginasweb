# Integración n8n & ExePaginasWeb (Modo Gratis & Resiliencia Total)

Este documento detalla la integración bidireccional entre **ExePaginasWeb** y tu instancia de **n8n Cloud** (`https://exedevcentral.app.n8n.cloud`) con protección contra desactivación de webhooks y motor de respaldo 100% gratuito.

---

## 1. Conector de Automatización y Auto-Sanador Webhook

El conector en [`lib/server/n8n.ts`](../../lib/server/n8n.ts) cuenta con:
1. **Auto-Activación vía API n8n:** Si el webhook devuelve `404` (workflow desactivado tras inactividad o edición), consulta automáticamente la API de n8n y vuelve a activar el workflow sin que tengas que entrar al panel.
2. **Motor Serverless de Respaldo (100% Gratis):** Si la instancia de n8n está apagada, pausada o sin ejecuciones, el servidor Next.js procesa la automatización localmente, despacha el recibo interactivo por Resend y notifica al administrador en `Exemetal@hotmail.com`.
3. **Keep-Alive Ping (`ping.keepalive`):** Permite mantener la instancia activa evitando que se suspenda por desuso.

### Eventos Despachados Automáticamente:
1. `lead.contact`: Formulario de contacto enviado (nombre, email, ticket `EXE-CNT-...`, mensaje, idioma).
2. `lead.chat`: Captura de email en el chatbot de IA (ticket `EXE-CHT-...`, email, idioma).
3. `payment.captured`: Confirmación de pago online con PayPal.
4. `transfer.registered`: Registro de comprobante de transferencia bancaria.
5. `automation.trigger`: Disparador en vivo de cotización express, auditoría o demo.
6. `ping.keepalive`: Verificación de salud y mantenimiento activo.

### Variables de Entorno:
En `.env.local` y en **Vercel Project Settings > Environment Variables**:
```bash
N8N_WEBHOOK_URL=https://exedevcentral.app.n8n.cloud/webhook/exepaginasweb-leads
N8N_WEBHOOK_SECRET=tu_secreto_seguro_opcional
N8N_API_KEY=tu_n8n_api_key_para_auto_activacion
```

---

## 2. Comando de Auto-Sanación y Diagnóstico (1-Click)

Para verificar y reactivar cualquier webhook deshabilitado (tanto en Resend como en n8n) sin entrar a las plataformas web:

```bash
npm run webhooks:heal
```

O haciendo una petición GET a cualquiera de los endpoints de la API:
- `GET /api/automation/n8n`: Realiza un keep-alive ping a n8n y verifica Resend.
- `GET /api/webhooks/resend`: Auto-reactiva webhooks deshabilitados vía la API de Resend.

---

## 3. Plantilla de Workflow Lista para Importar

En este directorio se incluye [`n8n-leads-workflow.json`](./n8n-leads-workflow.json) actualizado y compatible con la última versión de n8n.

### Pasos para Activar en n8n:
1. Entrá a tu panel: [https://exedevcentral.app.n8n.cloud](https://exedevcentral.app.n8n.cloud)
2. En **Workflows** > **Add workflow** > menú `...` > **Import from File...**.
3. Seleccioná `docs/n8n/n8n-leads-workflow.json`.
4. Activá el switch superior a **Active**.
