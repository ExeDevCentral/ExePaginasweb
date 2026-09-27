# Plantillas Oficiales para Resend Templates

Estas plantillas están listas para ser cargadas en tu panel de Resend (https://resend.com/emails/templates):

### 1. `01-contact-auto-reply.html`
- **Name:** `contact-auto-reply`
- **Subject:** `✨ Recibimos tu consulta [Ticket: {{{ticketId}}}] - ExeSistemasWEB`
- **Variables:** `name`, `ticketId`, `message`

### 2. `02-contact-admin-notification.html`
- **Name:** `contact-admin-notification`
- **Subject:** `[{{{ticketId}}}] Nuevo contacto de {{{name}}}`
- **Variables:** `name`, `email`, `ticketId`, `message`

### 3. `03-ai-diagnostic.html`
- **Name:** `ai-diagnostic`
- **Subject:** `🤖 Tu Diagnóstico IA está listo [Ticket: {{{ticketId}}}] - ExeSistemasWEB`
- **Variables:** `name`, `ticketId`, `message`

### 4. `04-payment-confirmation.html`
- **Name:** `payment-confirmation`
- **Subject:** `Pago aprobado - {{{plan}}}`
- **Variables:** `name`, `plan`, `amount`, `orderId`

### 5. `05-email-verification.html`
- **Name:** `email-verification`
- **Subject:** `🔒 Confirma tu cuenta de correo electrónico — ExeSistemasWEB`
- **Variables:** `name`, `verificationUrl`
