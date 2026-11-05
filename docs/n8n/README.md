# Integración n8n & ExePaginasWeb (Modo Gratis & Resiliencia Total)

Este documento detalla la integración bidireccional entre **ExePaginasWeb** y tu instancia de **n8n Cloud** (`https://exedevcentral.app.n8n.cloud`) con captura obligatoria de canales de contacto (WhatsApp/Teléfono y Email), protección contra desactivación de webhooks y motor de respaldo 100% gratuito.

---

## 1. Conector de Automatización y Captura de Contacto

El conector en [`lib/server/n8n.ts`](../../lib/server/n8n.ts) y los endpoints del sistema aseguran que **ningún lead quede incomunicado**:
1. **Captura Obligatoria de Canal:** En el botón de chat (menú de automatizaciones n8n y asistente IA), formulario de contacto y cotizador interactivo, el cliente debe ingresar su **WhatsApp / Teléfono** y/o su **Email**.
2. **Generación Automática de Enlace de WhatsApp (`whatsapp_direct_link`):** Tanto n8n como los correos de alerta al Administrador (`Exemetal@hotmail.com`) generan un enlace directo de 1 clic:
   `https://wa.me/{numero_cliente}?text=Hola...` permitiendo abrir la conversación con el cliente de inmediato.
3. **Persistencia en Base de Datos (Supabase):** Cada solicitud se guarda en la tabla `leads` con su ticket correspondiente (`EXE-N8N-...`, `EXE-CNT-...` o `EXE-CHT-...`) junto a su teléfono y correo en `metadata`.
4. **Auto-Activación vía API n8n:** Si el webhook devuelve `404` (workflow desactivado tras inactividad o edición), consulta automáticamente la API de n8n y vuelve a activar el workflow sin que tengas que entrar al panel.
5. **Motor Serverless de Respaldo (100% Gratis):** Si la instancia de n8n está apagada, pausada o sin ejecuciones, el servidor Next.js procesa la automatización localmente, despacha el recibo interactivo por Resend y notifica al administrador en `Exemetal@hotmail.com` con el botón de WhatsApp directo al cliente.
6. **Keep-Alive Ping (`ping.keepalive`):** Permite mantener la instancia activa evitando que se suspenda por desuso.

### Eventos Despachados Automáticamente:
1. `automation.trigger`: Disparador en vivo desde el **Botón de Chat** (cotización express, auditoría gratis, demo o alerta de ingeniería) con nombre, teléfono/WhatsApp, email y requerimiento.
2. `lead.contact`: Formulario de contacto enviado (nombre, teléfono/WhatsApp, email, ticket `EXE-CNT-...`, mensaje, idioma).
3. `lead.chat`: Captura automática de teléfono y/o email en la conversación con el chatbot de IA ExeBot (ticket `EXE-CHT-...`).
4. `payment.captured`: Confirmación de pago online con PayPal.
5. `transfer.registered`: Registro de comprobante de transferencia bancaria.
6. `ping.keepalive`: Verificación de salud y mantenimiento activo.

### Variables de Entorno:
En `.env.local` y en **Vercel Project Settings > Environment Variables**:
```bash
N8N_WEBHOOK_URL=https://exedevcentral.app.n8n.cloud/webhook/exepaginasweb-leads
N8N_WEBHOOK_SECRET=tu_secreto_seguro_opcional
N8N_API_KEY=tu_n8n_api_key_para_auto_activacion
ADMIN_EMAIL=Exemetal@hotmail.com
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
