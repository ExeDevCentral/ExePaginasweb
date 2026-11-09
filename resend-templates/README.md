# Plantillas Oficiales para Resend Templates (ExePaginasWeb)

Estas plantillas están listas para ser cargadas en tu panel de Resend (https://resend.com/emails/templates):

### 1. `01-contact-auto-reply.html`
- **Name:** `contact-auto-reply`
- **Subject:** `✨ Recibimos tu mensaje [Ticket: {{{ticketId}}}] - ExePaginasWeb`
- **Variables:** `name`, `ticketId`, `message`

### 2. `02-contact-admin-notification.html`
- **Name:** `contact-admin-notification`
- **Subject:** `[{{{ticketId}}}] Nuevo contacto de {{{name}}}`
- **Variables:** `name`, `email`, `ticketId`, `message`

### 3. `03-ai-diagnostic.html`
- **Name:** `ai-diagnostic`
- **Subject:** `🤖 Tu Diagnóstico IA está listo [Ticket: {{{ticketId}}}] - ExePaginasWeb`
- **Variables:** `name`, `ticketId`, `message`

### 4. `04-payment-confirmation.html`
- **Name:** `payment-confirmation`
- **Subject:** `Pago aprobado - {{{plan}}}`
- **Variables:** `name`, `plan`, `amount`, `orderId`

### 5. `05-email-verification.html`
- **Name:** `email-verification`
- **Subject:** `🔒 Confirma tu cuenta de correo electrónico — ExePaginasWeb`
- **Variables:** `name`, `verificationUrl`

### 6. `06-n8n-automation-live.html`
- **Name:** `n8n-automation-live`
- **Subject:** `⚡ Automatización Ejecutada [Ticket: {{{ticketId}}}] - ExePaginasWeb`
- **Variables:** `name`, `email`, `automationType`, `details`, `ticketId`

### 7. `07-n8n-admin-notification.html`
- **Name:** `n8n-admin-notification`
- **Subject:** `[{{{ticketId}}}] 🚨 Nueva solicitud de automatización: {{{name}}}`
- **Variables:** `name`, `email`, `phone`, `automationType`, `details`, `ticketId`
