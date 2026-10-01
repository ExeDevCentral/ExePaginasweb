# Integración n8n & ExePaginasWeb

Este documento detalla la integración bidireccional entre **ExePaginasWeb** y tu instancia de **n8n Cloud** (`https://exedevcentral.app.n8n.cloud`).

---

## 1. Conector de Automatización Webhook (Web -> n8n)

El proyecto cuenta con un conector asíncrono y resiliente en [`lib/server/n8n.ts`](../../lib/server/n8n.ts) que despacha automáticamente eventos comerciales y operativos a tu n8n sin bloquear la interfaz ni retrasar al usuario.

### Eventos Despachados Automáticamente:
1. `lead.contact`: Formulario de contacto enviado (nombre, email, ticket `EXE-CNT-...`, mensaje, idioma).
2. `lead.chat`: Captura de email en el chatbot de IA (ticket `EXE-CHT-...`, email, idioma).
3. `payment.captured`: Confirmación de pago online con PayPal.
4. `transfer.registered`: Registro de comprobante de transferencia bancaria.

### Variables de Entorno Requeridas:
En `.env.local` y en **Vercel Project Settings > Environment Variables**:
```bash
N8N_WEBHOOK_URL=https://exedevcentral.app.n8n.cloud/webhook/exepaginasweb-leads
N8N_WEBHOOK_SECRET=tu_secreto_seguro_opcional
```

---

## 2. Plantilla de Workflow Lista para Importar en n8n

En este directorio se incluye [`n8n-leads-workflow.json`](./n8n-leads-workflow.json).

### Pasos para Activar en n8n:
1. Entrá a tu panel de n8n: [https://exedevcentral.app.n8n.cloud](https://exedevcentral.app.n8n.cloud)
2. En el menú superior izquierdo, hacé clic en **Workflows** > **Add workflow**.
3. Abrí el menú contextual de tres puntos `...` (arriba a la derecha) y seleccioná **Import from File...** (o abrí el archivo `.json` y pegalo en el lienzo).
4. El workflow incluye:
   - **Nodo Webhook** configurado en el endpoint `/webhook/exepaginasweb-leads`.
   - **Switch Clasificador** de eventos (`lead.contact`, `lead.chat`, `payment.captured`).
   - Nodos de formateo de datos listos para conectar a **Telegram**, **WhatsApp**, **Google Sheets** o **Notion**.
5. Activá el switch superior a **Active**.

---

## 3. Servidor MCP de n8n (AI Agent <-> n8n)

Tu instancia expone el servidor MCP en:
```
https://exedevcentral.app.n8n.cloud/mcp-server/http
```

El servidor MCP permite que el asistente de IA pueda inspeccionar, crear y ejecutar workflows directamente desde la consola o el editor.

### Para autenticarlo con tu API Key:
1. En tu n8n, dirigite a **Settings** > **n8n API** y creá una nueva API Key.
2. Agregá la cabecera en [`.agents/mcp_config.json`](../../.agents/mcp_config.json):
```json
{
  "mcpServers": {
    "n8n": {
      "httpUrl": "https://exedevcentral.app.n8n.cloud/mcp-server/http",
      "serverUrl": "https://exedevcentral.app.n8n.cloud/mcp-server/http",
      "headers": {
        "Authorization": "Bearer TU_API_KEY_AQUI"
      }
    }
  }
}
```
3. O mediante la CLI de Gemini:
```bash
gemini mcp add --transport http -H "Authorization: Bearer TU_API_KEY_AQUI" n8n https://exedevcentral.app.n8n.cloud/mcp-server/http
```
