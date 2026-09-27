/**
 * Script para exportar las plantillas del proyecto a archivos HTML listos
 * para importar o copiar/pegar en el panel de Resend (Pestaña "Templates").
 *
 * Ejecución: node scripts/export-resend-templates.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  contactAutoReply,
  contactNotification,
  aiDiagnosticAutoReply,
  paymentConfirmation,
  emailVerification,
} from '../lib/email/templates.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../resend-templates')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

// 1. Contact Auto Reply (Cliente)
const contactAutoReplyHtml = contactAutoReply({
  name: '{{{name}}}',
  message: '{{{message}}}',
  ticketId: '{{{ticketId}}}',
  lang: 'es',
})
fs.writeFileSync(path.join(outDir, '01-contact-auto-reply.html'), contactAutoReplyHtml, 'utf8')

// 2. Contact Notification (Admin)
const contactAdminHtml = contactNotification({
  name: '{{{name}}}',
  email: '{{{email}}}',
  message: '{{{message}}}',
  ticketId: '{{{ticketId}}}',
})
fs.writeFileSync(path.join(outDir, '02-contact-admin-notification.html'), contactAdminHtml, 'utf8')

// 3. AI Diagnostic Auto Reply (Cliente)
const aiDiagHtml = aiDiagnosticAutoReply({
  name: '{{{name}}}',
  message: '{{{message}}}',
  ticketId: '{{{ticketId}}}',
  lang: 'es',
})
fs.writeFileSync(path.join(outDir, '03-ai-diagnostic.html'), aiDiagHtml, 'utf8')

// 4. Payment Confirmation (Cliente)
const paymentHtml = paymentConfirmation({
  name: '{{{name}}}',
  plan: '{{{plan}}}',
  amount: '{{{amount}}}',
  currency: 'USD',
  orderId: '{{{orderId}}}',
  dashboardUrl: 'https://exepaginasweb.com/dashboard',
})
fs.writeFileSync(path.join(outDir, '04-payment-confirmation.html'), paymentHtml, 'utf8')

// 5. Email Verification
const verificationHtml = emailVerification({
  name: '{{{name}}}',
  verificationUrl: '{{{verificationUrl}}}',
  token: '{{{token}}}',
})
fs.writeFileSync(path.join(outDir, '05-email-verification.html'), verificationHtml, 'utf8')

// Generar README instructivo para el usuario
const readmeContent = `# Plantillas Oficiales para Resend Templates

Estas plantillas están listas para ser cargadas en tu panel de Resend (https://resend.com/emails/templates):

### 1. \`01-contact-auto-reply.html\`
- **Name:** \`contact-auto-reply\`
- **Subject:** \`✨ Recibimos tu consulta [Ticket: {{{ticketId}}}] - ExeSistemasWEB\`
- **Variables:** \`name\`, \`ticketId\`, \`message\`

### 2. \`02-contact-admin-notification.html\`
- **Name:** \`contact-admin-notification\`
- **Subject:** \`[{{{ticketId}}}] Nuevo contacto de {{{name}}}\`
- **Variables:** \`name\`, \`email\`, \`ticketId\`, \`message\`

### 3. \`03-ai-diagnostic.html\`
- **Name:** \`ai-diagnostic\`
- **Subject:** \`🤖 Tu Diagnóstico IA está listo [Ticket: {{{ticketId}}}] - ExeSistemasWEB\`
- **Variables:** \`name\`, \`ticketId\`, \`message\`

### 4. \`04-payment-confirmation.html\`
- **Name:** \`payment-confirmation\`
- **Subject:** \`Pago aprobado - {{{plan}}}\`
- **Variables:** \`name\`, \`plan\`, \`amount\`, \`orderId\`

### 5. \`05-email-verification.html\`
- **Name:** \`email-verification\`
- **Subject:** \`🔒 Confirma tu cuenta de correo electrónico — ExeSistemasWEB\`
- **Variables:** \`name\`, \`verificationUrl\`
`
fs.writeFileSync(path.join(outDir, 'README.md'), readmeContent, 'utf8')

console.log('✅ Plantillas exportadas exitosamente a:', outDir)
