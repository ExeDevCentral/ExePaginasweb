/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
type TemplateValue = string | number | null | undefined

type PaymentConfirmationInput = {
  name: TemplateValue
  plan: TemplateValue
  amount: TemplateValue
  currency: TemplateValue
  orderId?: TemplateValue
  dashboardUrl?: TemplateValue
}
type PaymentNotificationInput = {
  name?: TemplateValue
  email: TemplateValue
  plan: TemplateValue
  slug: TemplateValue
  amount: TemplateValue
  tipoProyecto?: TemplateValue
  orderId?: TemplateValue
}
type ContactInput = {
  name: TemplateValue
  email: TemplateValue
  message: TemplateValue
  ticketId?: TemplateValue
  phone?: TemplateValue
}
type AutoReplyInput = {
  name?: TemplateValue
  message: TemplateValue
  ticketId?: TemplateValue
  lang?: string
}
type DiagnosticInput = {
  name?: TemplateValue
  message: TemplateValue
  ticketId?: TemplateValue
  projectType?: TemplateValue
  total?: TemplateValue
  lang?: string
}
type WelcomeInput = { name?: TemplateValue; email?: TemplateValue; dashboardUrl?: TemplateValue }
type RenewalInput = {
  tenantName: TemplateValue
  serviceName: TemplateValue
  price: TemplateValue
  currency: TemplateValue
  renewalDate: TemplateValue
  dashboardUrl?: TemplateValue
}
type SlaInput = {
  tenantName: TemplateValue
  ticketId: TemplateValue
  subject: TemplateValue
  priority: TemplateValue
  breachTime: TemplateValue
  dashboardUrl?: TemplateValue
}
type InvoiceInput = {
  tenantName: TemplateValue
  invoiceNumber: TemplateValue
  invoiceType: TemplateValue
  amount: TemplateValue
  date: TemplateValue
  cae?: TemplateValue
  caeDueDate?: TemplateValue
  dashboardUrl?: TemplateValue
}
type VerificationInput = {
  name?: TemplateValue
  verificationUrl?: TemplateValue
  token?: TemplateValue
}
type InboundInput = {
  fromEmail?: TemplateValue
  toEmail?: TemplateValue
  subject?: TemplateValue
  html?: TemplateValue
  text?: TemplateValue
  ticketId?: TemplateValue
}
export type N8nAutomationEmailInput = {
  name?: TemplateValue
  email?: TemplateValue
  automationType?: TemplateValue
  details?: TemplateValue
  ticketId?: TemplateValue
  engineMode?: 'n8n_cloud' | 'serverless_free' | string
  lang?: string
}
export type N8nAdminNotificationInput = {
  name?: TemplateValue
  email?: TemplateValue
  phone?: TemplateValue
  automationType?: TemplateValue
  details?: TemplateValue
  ticketId?: TemplateValue
  dispatchedToN8n?: boolean
}

function escapeHtml(str: TemplateValue): string {
  if (typeof str !== 'string') return String(str ?? '')
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function stripHtml(str: TemplateValue): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extrae el correo limpio desde cadenas RFC-5322 como "Nombre Apellido <correo@dominio.com>".
 */
export function extractCleanEmail(raw: TemplateValue): string {
  if (typeof raw !== 'string') return ''
  const trimmed = raw.trim()
  const angleMatch = trimmed.match(/<([^<>@\s]+@[^<>@\s]+)>/)
  if (angleMatch?.[1]) return angleMatch[1].trim()
  const emailMatch = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return emailMatch ? emailMatch[0].trim() : trimmed
}

/**
 * Extrae un nombre legible desde una dirección RFC-5322 o el usuario local del email.
 */
export function extractDisplayName(raw: TemplateValue, fallback = 'Cliente'): string {
  if (typeof raw !== 'string' || !raw.trim()) return fallback
  const trimmed = raw.trim()
  const angleIdx = trimmed.indexOf('<')
  if (angleIdx > 0) {
    const namePart = trimmed
      .slice(0, angleIdx)
      .replace(/^["']|["']$/g, '')
      .trim()
    if (namePart) return namePart
  }
  const cleanEmail = extractCleanEmail(trimmed)
  if (cleanEmail.includes('@')) {
    return cleanEmail.split('@')[0] || fallback
  }
  return trimmed
}

const BRAND = {
  name: 'ExePaginasWeb',
  author: 'Exequiel Echevarría',
  role: 'Software & Web Architect',
  originYear: 2025,
  domain: 'https://exepaginasweb.com',
  logo: 'https://exepaginasweb.com/logo.webp',
  whatsapp: '5493416874786',
  whatsappDisplay: '+54 9 341 687-4786',
  primary: '#00d4ff',
  emerald: '#10b981',
  secondary: '#ff00ff',
}

function baseLayout(body: string, title: string, preheader?: string): string {
  const safePreheader = escapeHtml(
    preheader || `${title} — ${BRAND.name} · ${BRAND.author} (${BRAND.role})`
  )
  return `<!DOCTYPE html>
<html lang="es" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark light">
  <meta name="supported-color-schemes" content="dark light">
  <title>${escapeHtml(title)} - ${BRAND.name}</title>
  <style>${styles()}</style>
</head>
<body style="margin:0;padding:0;background-color:#05070d;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;">
  <!-- Preheader oculto para vista previa en bandeja de entrada -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#05070d;">
    ${safePreheader} &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#05070d;background-image:radial-gradient(circle at 50% 0%,rgba(0,212,255,0.08),transparent 65%);">
    <tr>
      <td align="center" style="padding:36px 14px 48px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Cabecera de Precisión 1px -->
          <tr>
            <td style="padding-bottom:18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#090e1a;border:1px solid rgba(148,163,184,0.16);border-radius:16px;padding:15px 20px;">
                <tr>
                  <td align="left" valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="padding-right:12px;">
                          <img src="${BRAND.logo}" alt="${BRAND.name}" width="40" height="40" style="display:block;border-radius:10px;border:1px solid rgba(0,212,255,0.35);background-color:#060a12;">
                        </td>
                        <td valign="middle">
                          <div style="font-size:15px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">${BRAND.name}</div>
                          <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:10px;color:#00d4ff;letter-spacing:1.2px;text-transform:uppercase;margin-top:2px;">
                            ${BRAND.author} · ${BRAND.role}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;padding:5px 10px;border-radius:999px;background-color:rgba(16,185,129,0.10);border:1px solid rgba(16,185,129,0.30);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:10px;font-weight:600;color:#34d399;letter-spacing:0.6px;">
                      ● DIRECTO 24/7
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenedor Principal con Haz Láser Superior de 1px -->
          <tr>
            <td style="background-color:#0a0f1d;border-radius:20px;border:1px solid rgba(148,163,184,0.16);overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.65);">
              <!-- Haz láser fino de 1px -->
              <div style="height:1px;width:100%;background:linear-gradient(90deg,#00d4ff 0%,#10b981 50%,#ec4899 100%);"></div>
              <div style="padding:32px 28px;">
                ${body}
              </div>
            </td>
          </tr>

          <!-- Footer Técnico con Autoría Directa y Canales -->
          <tr>
            <td style="padding:22px 12px 0;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#080c17;border:1px solid rgba(148,163,184,0.14);border-radius:14px;padding:16px;margin-bottom:14px;">
                <tr>
                  <td align="center" style="font-size:12px;color:#94a3b8;line-height:1.65;">
                    <strong style="color:#ffffff;font-weight:600;">${BRAND.author}</strong> — ${BRAND.role} · <strong style="color:#e2e8f0;font-weight:600;">${BRAND.name}</strong><br>
                    <a href="${BRAND.domain}" style="color:#00d4ff;text-decoration:none;font-weight:600;">exepaginasweb.com</a>
                    &nbsp;·&nbsp;
                    <a href="https://wa.me/${BRAND.whatsapp}" style="color:#34d399;text-decoration:none;font-weight:600;">WhatsApp ${BRAND.whatsappDisplay}</a>
                    &nbsp;·&nbsp;
                    <a href="${BRAND.domain}/cotizador" style="color:#cbd5e1;text-decoration:none;">Cotizador Online</a>
                    &nbsp;·&nbsp;
                    <a href="${BRAND.domain}/portafolio" style="color:#cbd5e1;text-decoration:none;">Portafolio</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:10px;color:#64748b;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;letter-spacing:0.6px;">
                © ${BRAND.originYear} ${BRAND.name} · 100% CÓDIGO PROPIO · SIN COMISIONES NI INTERMEDIARIOS
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function styles() {
  return `
    .btn {
      display:inline-block;padding:13px 28px;border-radius:12px;
      font-weight:700;font-size:14px;text-decoration:none;
      background:linear-gradient(135deg,${BRAND.primary},#10b981);
      color:#041019 !important;margin:10px 4px;letter-spacing:-0.01em;
      box-shadow:0 8px 24px rgba(0,212,255,0.20);
    }
    .btn-secondary {
      display:inline-block;padding:11px 20px;border-radius:12px;
      font-weight:600;font-size:12px;text-decoration:none;
      background-color:#0f172a;border:1px solid rgba(0,212,255,0.28);
      color:#38bdf8 !important;margin:6px 4px;
    }
    h1 {color:#ffffff;font-size:23px;font-weight:600;margin:0 0 12px;line-height:1.22;letter-spacing:-0.028em;}
    h2 {color:#ffffff;font-size:16px;font-weight:600;margin:20px 0 8px;letter-spacing:-0.02em;}
    p {color:#94a3b8;font-size:14px;line-height:1.65;margin:0 0 12px;}
    .label {
      color:#64748b;font-size:10px;text-transform:uppercase;
      letter-spacing:1.1px;font-weight:600;margin:0 0 3px;
      font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
    }
    .value {color:#f8fafc;font-size:14px;font-weight:600;margin:0 0 12px;font-variant-numeric:tabular-nums;}
    .badge {
      display:inline-block;padding:4px 11px;border-radius:999px;
      font-size:10px;font-weight:600;letter-spacing:0.5px;
      font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      font-variant-numeric:tabular-nums;
    }
    .badge-green {background-color:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.30);}
    .badge-blue {background-color:rgba(0,212,255,0.10);color:#00d4ff;border:1px solid rgba(0,212,255,0.28);}
    .badge-magenta {background-color:rgba(236,72,153,0.12);color:#f472b6;border:1px solid rgba(236,72,153,0.30);}
    .divider {border:none;border-top:1px solid rgba(148,163,184,0.14);margin:18px 0;}
    .hud-box {
      background-color:#070b14;border-radius:14px;padding:18px 20px;
      margin:16px 0;border:1px solid rgba(148,163,184,0.16);
    }
    .pipeline-step {
      display:inline-block;padding:6px 10px;border-radius:8px;
      background-color:#0c1424;border:1px solid rgba(148,163,184,0.16);
      font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
      font-size:10px;color:#cbd5e1;margin:3px 2px;
    }
  `
}

function renderPipelineTracker(isEn = false, activeStep = 2): string {
  const steps = isEn
    ? ['01. Received', '02. Architecture Audit', '03. Direct Reply by Exequiel']
    : ['01. Ingresado', '02. Análisis Técnico', '03. Respuesta de Exequiel']

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 8px;">
      <tr>
        ${steps
          .map((step, idx) => {
            const isDone = idx + 1 <= activeStep
            const bg = isDone ? 'rgba(16,185,129,0.10)' : '#070b14'
            const border = isDone ? 'rgba(16,185,129,0.32)' : 'rgba(148,163,184,0.16)'
            const color = isDone ? '#34d399' : '#64748b'
            const icon = isDone ? '✓ ' : '◎ '
            return `<td width="32%" align="center" style="background-color:${bg};border:1px solid ${border};border-radius:10px;padding:8px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:10px;font-weight:600;color:${color};">
              ${icon}${step}
            </td>`
          })
          .join('<td width="2%"></td>')}
      </tr>
    </table>
  `
}

export function paymentConfirmation({
  name,
  plan,
  amount,
  currency,
  orderId,
  dashboardUrl,
}: PaymentConfirmationInput): string {
  const body = `
    <div style="text-align:center;padding-bottom:8px;">
      <span class="badge badge-green">✓ TRANSACCIÓN VERIFICADA</span>
      <h1 style="margin-top:12px;">✅ ¡Pago aprobado!</h1>
      <p>Hola <strong style="color:#fff">${escapeHtml(name)}</strong>, tu pago fue procesado y verificado correctamente en ${BRAND.name}.</p>
    </div>
    <div class="hud-box" style="border-color:rgba(16,185,129,0.32);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" valign="top" style="padding-bottom:12px;">
            <div class="label">Plan / Servicio</div>
            <div class="value" style="margin:0;">${escapeHtml(plan)}</div>
          </td>
          <td width="50%" valign="top" style="padding-bottom:12px;">
            <div class="label">Monto Abonado</div>
            <div class="value" style="color:#34d399;margin:0;">${escapeHtml(currency)} ${escapeHtml(amount)}</div>
          </td>
        </tr>
        <tr>
          <td width="50%" valign="top">
            <div class="label">Estado</div>
            <span class="badge badge-green">Aprobado &amp; Activo</span>
          </td>
          <td width="50%" valign="top">
            ${
              orderId
                ? `<div class="label">ID de Orden</div><div class="value" style="font-family:monospace;font-size:12px;margin:0;color:#00d4ff;">${escapeHtml(orderId)}</div>`
                : ''
            }
          </td>
        </tr>
      </table>
    </div>
    <p style="text-align:center;">Ya podés acceder a tu plan, descargar comprobantes y gestionar tu proyecto desde tu panel de cliente.</p>
    <div style="text-align:center;margin:20px 0;">
      <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Ir al Dashboard de Cliente</a>
    </div>
    <hr class="divider">
    <p style="font-size:12px;text-align:center;margin:0;">Si tenés alguna duda, respondé directamente a este correo o escribime por WhatsApp.</p>
  `
  return baseLayout(
    body,
    'Pago aprobado',
    `Confirmación de pago por ${plan} (${currency} ${amount})`
  )
}

export function paymentNotification({
  name,
  email,
  plan,
  slug,
  amount,
  tipoProyecto,
  orderId,
}: PaymentNotificationInput): string {
  const safeEmail = escapeHtml(extractCleanEmail(email) || email)
  const body = `
    <span class="badge badge-green">💰 ALERTA COMERCIAL · PAGO CAPTURADO</span>
    <h1 style="margin-top:12px;">🚀 ¡Nueva venta!</h1>
    <div class="hud-box" style="border-color:rgba(16,185,129,0.35);">
      <div class="label">Cliente</div>
      <div class="value">${escapeHtml(name || 'N/A')}</div>
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${safeEmail}" style="color:#00d4ff;text-decoration:none;">${escapeHtml(email)}</a></div>
      <hr class="divider" style="margin:12px 0">
      <div class="label">Plan</div>
      <div class="value">${escapeHtml(plan)} <span class="badge badge-blue" style="font-size:11px">${escapeHtml(slug)}</span></div>
      <div class="label">Proyecto</div>
      <div class="value">${escapeHtml(tipoProyecto || 'mantenimiento')}</div>
      <div class="label">Monto</div>
      <div class="value" style="color:#34d399;font-size:18px;">$${escapeHtml(amount)} USD</div>
      ${orderId ? `<div class="label">ID PayPal</div><div class="value" style="font-family:monospace;font-size:12px;margin:0;">${escapeHtml(orderId)}</div>` : ''}
    </div>
    <p>Los datos ya fueron sincronizados en Supabase, Resend Audience y el conector n8n.</p>
  `
  return baseLayout(body, 'Nueva venta recibida')
}

export function contactNotification({
  name,
  email,
  message,
  ticketId,
  phone,
}: ContactInput): string {
  const safeTicket = escapeHtml(ticketId || 'EXE-CNT-DIRECT')
  const safeName = escapeHtml(name)
  const cleanEmail = extractCleanEmail(email)
  const safeEmail = escapeHtml(cleanEmail || email || 'No especificado')
  const rawPhone = phone ? String(phone).trim() : ''
  const cleanPhoneDigits = rawPhone ? rawPhone.replace(/[^0-9]/g, '') : ''
  const safePhone = rawPhone ? escapeHtml(rawPhone) : ''

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td align="left" valign="middle">
          <h1 style="margin:0;font-size:21px;color:#fff;">💬 Nuevo mensaje de contacto</h1>
        </td>
        <td align="right" valign="middle">
          <span class="badge badge-blue" style="font-family:monospace;font-size:12px;">${safeTicket}</span>
        </td>
      </tr>
    </table>

    <div class="hud-box" style="border-color:rgba(0,212,255,0.32);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" valign="top">
            <div class="label">Remitente</div>
            <div class="value">${safeName}</div>
          </td>
          <td width="33%" valign="top">
            <div class="label">WhatsApp / Teléfono</div>
            <div class="value">${
              cleanPhoneDigits
                ? `<a href="https://wa.me/${cleanPhoneDigits}" style="color:#10b981;font-weight:bold;text-decoration:none;">📱 ${safePhone}</a>`
                : '<span style="color:#64748b;">No especificado</span>'
            }</div>
          </td>
          <td width="34%" valign="top">
            <div class="label">Correo Electrónico</div>
            <div class="value">${
              cleanEmail
                ? `<a href="mailto:${safeEmail}" style="color:#00d4ff;text-decoration:none">${safeEmail}</a>`
                : '<span style="color:#64748b;">No especificado</span>'
            }</div>
          </td>
        </tr>
      </table>
      <hr class="divider" style="margin:12px 0">
      <div class="label">Mensaje del Cliente</div>
      <div style="color:#e2e8f0;background:#050811;padding:16px;border-radius:12px;margin:8px 0 0;font-size:14px;line-height:1.65;border:1px solid rgba(148,163,184,0.16);">
        ${escapeHtml(message).replace(/\n/g, '<br>')}
      </div>
    </div>

    <div style="text-align:center;margin-top:22px;">
      ${
        cleanPhoneDigits
          ? `<a href="https://wa.me/${cleanPhoneDigits}?text=Hola%20${encodeURIComponent(String(name ?? ''))},%20recibimos%20tu%20consulta%20[${safeTicket}]%20en%20ExePaginasWeb" class="btn">📱 Chatear por WhatsApp con ${safeName}</a><br>`
          : ''
      }
      ${
        cleanEmail
          ? `<a href="mailto:${safeEmail}?subject=Re:%20[${safeTicket}]%20Tu%20consulta%20en%20ExePaginasWeb" class="btn-secondary">Responder por Email</a>`
          : ''
      }
    </div>
  `
  return baseLayout(body, `[${safeTicket}] Nuevo contacto de ${safeName}`)
}

export function contactAutoReply({ name, message, ticketId, lang = 'es' }: AutoReplyInput): string {
  const isEn = String(lang).toLowerCase().startsWith('en')
  const safeName = escapeHtml(name || (isEn ? 'Valued Client' : 'Estimado/a'))
  const safeTicket = escapeHtml(ticketId || 'EXE-CNT-00000')

  const copy = isEn
    ? {
        subject: `Contact Confirmation [${safeTicket}]`,
        ticketHeader: `SUPPORT TICKET: ${safeTicket}`,
        heading: `Hello ${safeName}! We received your message ✨`,
        subheading: `Thank you for reaching out to <strong>${BRAND.name}</strong>. I am <strong>${BRAND.author}</strong> (${BRAND.role}) and I am personally reviewing your inquiry to give you a precise technical and commercial answer without intermediaries.`,
        statusLabel: `Request Status`,
        statusValue: `In Direct Review`,
        slaLabel: `Estimated Response Time`,
        slaValue: `Less than 2 Hours`,
        summaryLabel: `Summary of your submitted message`,
        replyBoxTitle: `How to continue this conversation`,
        replyBoxText: `You can <strong>reply directly to this email</strong> (your reply goes straight to my inbox under ticket <code>${safeTicket}</code>) or message me on WhatsApp below.`,
        immediateQuestion: `Need an immediate response or live quote?`,
        whatsappButton: `💬 Chat on WhatsApp Direct`,
        whatsappText: `Hello%20Exequiel!%20I%20have%20ticket%20${safeTicket}%20and%20I%20would%20like%20to%20inquire...`,
        secondaryCtaQuote: `Interactive Quote Calculator`,
        secondaryCtaPortfolio: `View Live Portfolio`,
        footnote: `💡 Personal attention by <strong>${BRAND.author}</strong> — 100% custom code, zero sales commissions.`,
      }
    : {
        subject: `Confirmación de Contacto [${safeTicket}]`,
        ticketHeader: `TICKET DIRECTO: ${safeTicket}`,
        heading: `¡Hola ${safeName}! Recibí tu consulta ✨`,
        subheading: `Gracias por escribir a <strong>${BRAND.name}</strong>. Soy <strong>${BRAND.author}</strong> (${BRAND.role}) y estoy revisando personalmente tu mensaje para darte una respuesta técnica y comercial exacta, sin agencias ni intermediarios.`,
        statusLabel: `Estado de la Consulta`,
        statusValue: `En Revisión Directa`,
        slaLabel: `Tiempo Estimado de Respuesta`,
        slaValue: `Menos de 2 Horas`,
        summaryLabel: `Resumen de tu mensaje recibido`,
        replyBoxTitle: `¿Querés agregar algún detalle por correo?`,
        replyBoxText: `Podés <strong>responder directamente a este mismo correo</strong> (tu respuesta ingresa de forma prioritaria a mi bandeja con el código <code>${safeTicket}</code>) o escribirme por WhatsApp con un clic.`,
        immediateQuestion: `¿Preferís avanzar ahora mismo por WhatsApp?`,
        whatsappButton: `💬 Hablar con Exequiel por WhatsApp`,
        whatsappText: `¡Hola%20Exequiel!%20Tengo%20el%20ticket%20${safeTicket}%20y%20quisiera%20avanzar%20con%20mi%20consulta...`,
        secondaryCtaQuote: `Abrir Cotizador Online`,
        secondaryCtaPortfolio: `Ver Sistemas en Vivo`,
        footnote: `💡 Atención directa de <strong>${BRAND.author}</strong> — 100% código propio, 0% comisiones por venta.`,
      }

  const body = `
    <div style="text-align:center;padding-bottom:10px;">
      <div class="badge badge-blue" style="font-family:monospace;font-size:11px;letter-spacing:0.8px;margin-bottom:12px;">${copy.ticketHeader}</div>
      <h1 style="font-size:24px;color:#fff;margin:6px 0 10px;">${copy.heading}</h1>
      <p style="color:#94a3b8;font-size:14px;max-width:500px;margin:0 auto 14px;line-height:1.65;">
        ${copy.subheading}
      </p>
    </div>

    ${renderPipelineTracker(isEn, 2)}

    <div class="hud-box" style="border-color:rgba(0,212,255,0.28);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
        <tr>
          <td align="left" valign="middle" style="padding-bottom:8px;">
            <span class="label" style="color:#00d4ff;">${copy.statusLabel}</span>
          </td>
          <td align="right" valign="middle" style="padding-bottom:8px;">
            <span class="badge badge-green">${copy.statusValue}</span>
          </td>
        </tr>
        <tr>
          <td align="left" valign="middle">
            <span class="label">${copy.slaLabel}</span>
          </td>
          <td align="right" valign="middle">
            <span class="badge badge-blue">${copy.slaValue}</span>
          </td>
        </tr>
      </table>

      <hr class="divider" style="margin:12px 0;">

      <div class="label" style="margin-bottom:8px;">${copy.summaryLabel}</div>
      <div style="color:#cbd5e1;background:#050811;padding:14px 16px;border-radius:10px;font-size:13px;line-height:1.6;border:1px solid rgba(148,163,184,0.16);font-style:italic;">
        "${escapeHtml(message).replace(/\n/g, '<br>')}"
      </div>

      <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.22);border-radius:10px;padding:12px 14px;margin-top:14px;color:#e2e8f0;font-size:12px;line-height:1.55;">
        <div style="font-weight:700;color:#00d4ff;margin-bottom:4px;">↩ ${copy.replyBoxTitle}</div>
        ${copy.replyBoxText}
      </div>
    </div>

    <div style="text-align:center;margin:22px 0 14px;">
      <p style="color:#fff;font-size:14px;font-weight:600;margin-bottom:10px;">${copy.immediateQuestion}</p>
      <a href="https://wa.me/${BRAND.whatsapp}?text=${copy.whatsappText}" class="btn">
        ${copy.whatsappButton}
      </a>
      <div style="margin-top:8px;">
        <a href="${BRAND.domain}/cotizador" class="btn-secondary">${copy.secondaryCtaQuote}</a>
        <a href="${BRAND.domain}/portafolio" class="btn-secondary">${copy.secondaryCtaPortfolio}</a>
      </div>
    </div>

    <div style="background:#070b14;border-radius:12px;padding:13px 16px;margin-top:18px;border:1px solid rgba(148,163,184,0.14);text-align:center;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        ${copy.footnote}
      </p>
    </div>
  `
  return baseLayout(body, copy.subject, copy.heading)
}

export function aiDiagnosticAutoReply({
  name,
  message,
  ticketId,
  projectType,
  total,
  lang = 'es',
}: DiagnosticInput): string {
  const isEn = String(lang).toLowerCase().startsWith('en')
  const safeName = escapeHtml(name || (isEn ? 'Valued Client' : 'Estimado/a'))
  const safeTicket = escapeHtml(ticketId || 'EXE-AI-00000')

  const copy = isEn
    ? {
        subject: `🤖 AI Diagnostic Completed [${safeTicket}] - ${BRAND.name}`,
        badge: `🤖 AI DIAGNOSTIC COMPLETED`,
        heading: `Hello ${safeName}! Your AI Diagnostic is Ready ✨`,
        subheading: `Thank you for completing the Intelligent AI Diagnostic on <strong>${BRAND.name}</strong>. I am <strong>${BRAND.author}</strong> (${BRAND.role}) and I have received your technical specifications to prepare a tailored architecture and rollout plan.`,
        statusLabel: `Diagnostic Status`,
        statusValue: `Completed — Direct Audit`,
        slaLabel: `Personalized Follow-up`,
        slaValue: `Under 2 Hours`,
        summaryHeading: `Technical Summary of Your Project`,
        warmNote: `💡 <strong>Want to refine your diagnostic?</strong> Reply directly to this email or message me on WhatsApp to adjust modules, integrations, or payment stages.`,
        whatsappButton: `💬 Review Diagnostic with Exequiel on WhatsApp`,
        whatsappText: `Hello%20Exequiel!%20I%20completed%20the%20AI%20Diagnostic%20${safeTicket}%20and%20I%20would%20like%20to%20review%20my%20project...`,
        footnote: `💡 Direct architectural review by <strong>${BRAND.author}</strong> for ticket <strong>${safeTicket}</strong>.`,
      }
    : {
        subject: `🤖 Diagnóstico IA Finalizado [${safeTicket}] - ${BRAND.name}`,
        badge: `🤖 DIAGNÓSTICO INTELIGENTE FINALIZADO`,
        heading: `¡Hola ${safeName}! Tu Diagnóstico IA está Listo ✨`,
        subheading: `Gracias por completar el Diagnóstico con Inteligencia Artificial en <strong>${BRAND.name}</strong>. Soy <strong>${BRAND.author}</strong> (${BRAND.role}) y ya recibí la especificación técnica de tu proyecto para prepararte una propuesta a medida.`,
        statusLabel: `Estado del Diagnóstico`,
        statusValue: `Finalizado — En Análisis Directo`,
        slaLabel: `Devolución Personalizada`,
        slaValue: `Menos de 2 Horas`,
        summaryHeading: `Resumen Técnico del Diagnóstico`,
        warmNote: `💡 <strong>¿Querés mejorar o ajustar tu diagnóstico?</strong> Podés responder directamente a este correo o escribirme por WhatsApp para afinar módulos, integraciones o presupuesto a medida.`,
        whatsappButton: `💬 Revisar Diagnóstico con Exequiel por WhatsApp`,
        whatsappText: `¡Hola%20Exequiel!%20Completé%20el%20Diagnóstico%20con%20IA%20${safeTicket}%20y%20quisiera%20revisar%20mi%20proyecto...`,
        footnote: `💡 Revisión de arquitectura directa por <strong>${BRAND.author}</strong> sobre el ticket <strong>${safeTicket}</strong>.`,
      }

  const body = `
    <div style="text-align:center;padding-bottom:10px;">
      <div class="badge badge-blue" style="font-family:monospace;font-size:11px;letter-spacing:0.8px;margin-bottom:12px;">
        ${copy.badge} — ${safeTicket}
      </div>
      <h1 style="font-size:24px;color:#fff;margin:8px 0 10px;">
        ${copy.heading}
      </h1>
      <p style="color:#94a3b8;font-size:14px;max-width:500px;margin:0 auto 14px;line-height:1.65;">
        ${copy.subheading}
      </p>
    </div>

    ${renderPipelineTracker(isEn, 2)}

    <div class="hud-box" style="border-color:rgba(0,212,255,0.32);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
        <tr>
          <td align="left" valign="middle" style="padding-bottom:8px;">
            <span class="label" style="color:#00d4ff;">${copy.statusLabel}</span>
          </td>
          <td align="right" valign="middle" style="padding-bottom:8px;">
            <span class="badge badge-green">${copy.statusValue}</span>
          </td>
        </tr>
        <tr>
          <td align="left" valign="middle">
            <span class="label">${copy.slaLabel}</span>
          </td>
          <td align="right" valign="middle">
            <span class="badge badge-blue">${copy.slaValue}</span>
          </td>
        </tr>
      </table>

      <hr class="divider" style="margin:12px 0;">

      <div class="label" style="margin-bottom:8px;color:#00d4ff;">${copy.summaryHeading}</div>
      <div style="color:#cbd5e1;background:#050811;padding:16px;border-radius:10px;font-size:13px;line-height:1.6;border:1px solid rgba(148,163,184,0.16);">
        ${projectType ? `<p style="margin:0 0 6px;color:#fff;"><strong>Proyecto:</strong> ${escapeHtml(projectType)}</p>` : ''}
        ${total ? `<p style="margin:0 0 6px;color:#34d399;"><strong>Estimación:</strong> ${escapeHtml(String(total))}</p>` : ''}
        <div style="margin-top:6px;font-style:italic;color:#94a3b8;">
          "${escapeHtml(message).replace(/\n/g, '<br>')}"
        </div>
      </div>

      <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.24);border-radius:10px;padding:13px 14px;margin-top:14px;color:#e2e8f0;font-size:12px;line-height:1.55;">
        ${copy.warmNote}
      </div>
    </div>

    <div style="text-align:center;margin:22px 0 14px;">
      <a href="https://wa.me/${BRAND.whatsapp}?text=${copy.whatsappText}" class="btn">
        ${copy.whatsappButton}
      </a>
    </div>

    <div style="background:#070b14;border-radius:12px;padding:13px 16px;margin-top:18px;border:1px solid rgba(148,163,184,0.14);text-align:center;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        ${copy.footnote}
      </p>
    </div>
  `
  return baseLayout(body, copy.subject, copy.heading)
}

export function n8nAutomationReceipt({
  name,
  automationType,
  details,
  ticketId,
  engineMode = 'n8n_cloud',
  lang = 'es',
}: N8nAutomationEmailInput): string {
  const isEn = String(lang).toLowerCase().startsWith('en')
  const safeName = escapeHtml(name || (isEn ? 'Client' : 'Cliente'))
  const safeTicket = escapeHtml(ticketId || 'EXE-N8N-LIVE')
  const safeType = escapeHtml(automationType || 'cotizacion_express')
  const safeDetails = escapeHtml(
    details ||
      (isEn
        ? 'Automated workflow triggered in real time.'
        : 'Flujo de automatización ejecutado en tiempo real.')
  )
  const modeLabel =
    engineMode === 'n8n_cloud' ? 'n8n Cloud + Resend' : 'Motor Serverless Resiliente + Resend'

  const typeLabelsEs: Record<string, { title: string; deliverable: string; refPrice: string }> = {
    cotizacion_express: {
      title: 'Cotización Express Interactiva',
      deliverable: 'Presupuesto base + Arquitectura 100% código propio',
      refPrice: 'Landing desde $450.000 ARS · E-Commerce desde $750.000 ARS (1 solo pago)',
    },
    auditoria_gratis: {
      title: 'Auditoría Técnica & UX Gratuita',
      deliverable: 'Diagnóstico de velocidad, conversión SEO y embudo de ventas',
      refPrice: '100% Bonificada ($0 ARS)',
    },
    demo_sistema: {
      title: 'Demo en Vivo de Sistema / Turnos 24/7',
      deliverable: 'Acceso guiado a panel SaaS, reservas con seña y alertas WhatsApp',
      refPrice: 'Implementación llave en mano sin comisiones por venta',
    },
    notificacion_directa: {
      title: 'Prioridad Directa con Exequiel Echevarría',
      deliverable: 'Alerta instantánea enviada al móvil de Exequiel',
      refPrice: 'Atención prioritaria < 15 min',
    },
  }

  const meta = typeLabelsEs[String(automationType)] || {
    title: String(safeType),
    deliverable: 'Flujo automatizado procesado en tiempo real',
    refPrice: '100% Código Propio · Sin mensualidades forzosas',
  }

  const body = `
    <div style="text-align:center;padding-bottom:10px;">
      <span class="badge badge-green">⚡ WORKFLOW EJECUTADO EN VIVO · ${safeTicket}</span>
      <h1 style="font-size:23px;color:#fff;margin:12px 0 8px;">
        ¡Hola ${safeName}! Tu automatización fue ejecutada ✨
      </h1>
      <p style="color:#94a3b8;font-size:14px;max-width:500px;margin:0 auto 12px;">
        Acabás de disparar un flujo real en <strong>${BRAND.name}</strong> diseñado por <strong>${BRAND.author}</strong>. Podés responder directamente a este correo o continuar por WhatsApp.
      </p>
    </div>

    ${renderPipelineTracker(isEn, 3)}

    <div class="hud-box" style="border-color:rgba(16,185,129,0.32);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" valign="top" style="padding-bottom:10px;">
            <div class="label" style="color:#34d399;">Ticket de Seguimiento</div>
            <div class="value" style="font-family:monospace;color:#00d4ff;margin:0;">${safeTicket}</div>
          </td>
          <td width="50%" valign="top" style="padding-bottom:10px;">
            <div class="label">Motor de Ejecución</div>
            <span class="badge badge-blue">${escapeHtml(modeLabel)}</span>
          </td>
        </tr>
      </table>

      <hr class="divider" style="margin:12px 0;">

      <div class="label">Flujo Disparado</div>
      <div class="value" style="color:#fff;">${escapeHtml(meta.title)}</div>

      <div class="label">Entregable / Acción</div>
      <div class="value" style="font-size:13px;color:#cbd5e1;">${escapeHtml(meta.deliverable)}</div>

      <div class="label">Referencia Comercial</div>
      <div class="value" style="font-size:13px;color:#34d399;">${escapeHtml(meta.refPrice)}</div>

      <div class="label">Detalle Registrado</div>
      <div style="color:#cbd5e1;background:#050811;padding:12px 14px;border-radius:10px;font-size:13px;border:1px solid rgba(148,163,184,0.16);margin-top:4px;">
        "${safeDetails}"
      </div>
    </div>

    <div style="text-align:center;margin:22px 0 12px;">
      <a href="https://wa.me/${BRAND.whatsapp}?text=Hola%20Exequiel!%20Acabo%20de%20probar%20la%20automatizaci%C3%B3n%20en%20vivo%20[${safeTicket}]%20(${encodeURIComponent(meta.title)})%20y%20quiero%20aplicarlo%20a%20mi%20proyecto." class="btn">
        💬 Continuar por WhatsApp con mi Ticket ${safeTicket}
      </a>
    </div>
  `
  return baseLayout(
    body,
    `⚡ Automatización [${safeTicket}] Ejecutada`,
    `Flujo ${meta.title} completado en tiempo real`
  )
}

/**
 * Plantilla segura (con escape HTML estricto) para notificar al administrador
 * sobre ejecuciones de automatizaciones n8n o motor serverless.
 */
export function n8nAdminNotification({
  name,
  email,
  phone,
  automationType,
  details,
  ticketId,
  dispatchedToN8n = false,
}: N8nAdminNotificationInput): string {
  const safeTicket = escapeHtml(ticketId || 'EXE-N8N-ADMIN')
  const safeName = escapeHtml(name || 'Cliente')
  const cleanEmail = extractCleanEmail(email)
  const safeEmail = escapeHtml(cleanEmail || email || '')
  const rawPhone = phone ? String(phone).trim() : ''
  const cleanPhoneDigits = rawPhone ? rawPhone.replace(/[^0-9]/g, '') : ''
  const safePhone = escapeHtml(rawPhone)
  const safeType = escapeHtml(automationType || 'cotizacion_express')
  const safeDetails = escapeHtml(details || 'Sin detalles adicionales')

  const body = `
    <span class="badge badge-blue">⚡ TRIGGER AUTOMATIZACIÓN · ${safeTicket}</span>
    <h1 style="margin-top:12px;">🚨 Nueva Solicitud de Automatización</h1>
    <div class="hud-box" style="border-color:rgba(0,212,255,0.32);">
      <div class="label">Ticket</div>
      <div class="value" style="font-family:monospace;color:#34d399;">${safeTicket}</div>

      <div class="label">Cliente</div>
      <div class="value">${safeName}</div>

      <div class="label">WhatsApp / Teléfono</div>
      <div class="value">${
        cleanPhoneDigits
          ? `<a href="https://wa.me/${cleanPhoneDigits}" style="color:#10b981;font-weight:700;text-decoration:none;">📱 ${safePhone} (Abrir WhatsApp)</a>`
          : '<span style="color:#64748b;">No especificado</span>'
      }</div>

      <div class="label">Correo Electrónico</div>
      <div class="value">${
        safeEmail
          ? `<a href="mailto:${safeEmail}" style="color:#00d4ff;text-decoration:none;">${safeEmail}</a>`
          : '<span style="color:#64748b;">No especificado</span>'
      }</div>

      <hr class="divider" style="margin:12px 0;">

      <div class="label">Flujo Solicitado</div>
      <div class="value">${safeType}</div>

      <div class="label">Detalles</div>
      <div style="color:#e2e8f0;background:#050811;padding:14px;border-radius:10px;font-size:13px;border:1px solid rgba(148,163,184,0.16);">
        ${safeDetails.replace(/\n/g, '<br>')}
      </div>
    </div>

    <div style="text-align:center;margin-top:18px;">
      ${
        cleanPhoneDigits
          ? `<a href="https://wa.me/${cleanPhoneDigits}?text=Hola%20${encodeURIComponent(String(name ?? ''))},%20te%20contacto%20de%20ExePaginasWeb%20por%20tu%20solicitud%20[${safeTicket}]" class="btn">📱 Chatear por WhatsApp con ${safeName}</a>`
          : ''
      }
      ${
        safeEmail
          ? `<a href="mailto:${safeEmail}?subject=Re:%20[${safeTicket}]%20Tu%20automatizaci%C3%B3n%20en%20ExePaginasWeb" class="btn-secondary">Responder por Email</a>`
          : ''
      }
    </div>
    <p style="font-size:11px;color:#64748b;text-align:center;margin-top:16px;">
      Estado n8n Cloud: ${dispatchedToN8n ? '✓ Despachado a n8n' : '⚡ Procesado por Motor Serverless Resiliente'}
    </p>
  `
  return baseLayout(body, `[${safeTicket}] Automatización: ${safeName}`)
}

export function welcomeEmail({ name, email, dashboardUrl }: WelcomeInput): string {
  const body = `
    <span class="badge badge-blue">🚀 CUENTA ACTIVADA</span>
    <h1 style="margin-top:12px;">🎉 Bienvenido a ${BRAND.name}</h1>
    <p>Hola <strong style="color:#fff">${escapeHtml(name || email)}</strong>,</p>
    <p>Tu cuenta fue creada exitosamente. Ya podés acceder al panel de cliente para gestionar tu plan, ver tus facturas y dar seguimiento en tiempo real a tus proyectos.</p>
    <div style="text-align:center;margin:22px 0;">
      <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Ir al Dashboard</a>
    </div>
    <hr class="divider">
    <p style="font-size:13px;text-align:center;">Si tenés alguna duda, respondé directamente a este correo o contactame desde la web.</p>
  `
  return baseLayout(body, 'Bienvenido')
}

export function renewalNotice({
  tenantName,
  serviceName,
  price,
  currency,
  renewalDate,
  dashboardUrl,
}: RenewalInput): string {
  const body = `
    <span class="badge badge-blue">📅 AVISO DE CICLO</span>
    <h1 style="margin-top:12px;">Aviso de Renovación Próxima</h1>
    <p>Hola, te informamos que tu servicio en <strong style="color:#fff">${escapeHtml(tenantName)}</strong> está programado para renovarse próximamente.</p>
    <div class="hud-box">
      <div class="label">Servicio</div>
      <div class="value">${escapeHtml(serviceName)}</div>
      <div class="label">Precio de Renovación</div>
      <div class="value">${escapeHtml(currency)} ${escapeHtml(String(price))}</div>
      <div class="label">Fecha de Renovación</div>
      <div class="value">${escapeHtml(renewalDate)}</div>
      <div class="label">Estado</div>
      <div class="badge badge-blue">Renovación Automática</div>
    </div>
    <p>El cargo se procesará de forma automática en tu método de pago registrado.</p>
    <div style="text-align:center;">
      <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Gestionar Servicios</a>
    </div>
    <hr class="divider">
    <p style="font-size:13px">Si necesitás realizar cambios en tu suscripción o cancelar antes del cobro, podés gestionarlo desde tu panel.</p>
  `
  return baseLayout(body, 'Aviso de Renovación')
}

export function slaBreachAlert({
  tenantName,
  ticketId,
  subject,
  priority,
  breachTime,
  dashboardUrl,
}: SlaInput): string {
  const body = `
    <h1 style="color:#ff3366;">⚠️ Alerta de Incumplimiento de SLA</h1>
    <p>Se ha detectado un ticket fuera del tiempo límite establecido por el contrato SLA en <strong style="color:#fff">${escapeHtml(tenantName)}</strong>.</p>
    <div class="hud-box" style="border-color:rgba(255,51,102,0.4);">
      <div class="label" style="color:#ff3366;">Ticket ID</div>
      <div class="value" style="font-family:monospace;font-size:13px;">${escapeHtml(ticketId)}</div>
      <div class="label">Asunto</div>
      <div class="value">${escapeHtml(subject)}</div>
      <div class="label">Prioridad</div>
      <div class="value"><span class="badge" style="background:#ff336620;color:#ff3366;border:1px solid #ff336640">${escapeHtml(priority)}</span></div>
      <div class="label">Fecha de Límite Superada</div>
      <div class="value">${escapeHtml(breachTime)}</div>
    </div>
    <p>Por favor, asigná y respondé el ticket de manera urgente para minimizar el impacto del incumplimiento.</p>
    <div style="text-align:center;">
      <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn" style="background:linear-gradient(135deg,#ff3366,#ff00ff);color:#fff !important;">Ver Ticket en Panel</a>
    </div>
  `
  return baseLayout(body, 'Incumplimiento de SLA')
}

export function invoiceReceipt({
  tenantName,
  invoiceNumber,
  invoiceType,
  amount,
  date,
  cae,
  caeDueDate,
  dashboardUrl,
}: InvoiceInput): string {
  const body = `
    <span class="badge badge-green">📄 COMPROBANTE FISCAL</span>
    <h1 style="margin-top:12px;">Tu Factura Electrónica está lista</h1>
    <p>Hemos emitido el comprobante correspondiente a tus servicios en <strong style="color:#fff">${escapeHtml(tenantName)}</strong>.</p>
    <div class="hud-box">
      <div class="label">Número de Factura</div>
      <div class="value">${escapeHtml(invoiceNumber)} (Tipo ${escapeHtml(invoiceType)})</div>
      <div class="label">Monto Total</div>
      <div class="value" style="font-size:18px;color:#34d399;">$ ${escapeHtml(String(amount))} ARS</div>
      <div class="label">Fecha de Emisión</div>
      <div class="value">${escapeHtml(date)}</div>
      ${
        cae
          ? `
        <hr class="divider" style="margin:12px 0">
        <div class="label">CAE (AFIP)</div>
        <div class="value" style="font-family:monospace;">${escapeHtml(cae)}</div>
        <div class="label">Vencimiento CAE</div>
        <div class="value">${escapeHtml(caeDueDate)}</div>
      `
          : ''
      }
    </div>
    <p>Podés descargar la factura completa en formato PDF ingresando al panel de facturación de tu tenant.</p>
    <div style="text-align:center;">
      <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Ver Facturas</a>
    </div>
  `
  return baseLayout(body, 'Factura Emitida')
}

export function emailVerification({ name, verificationUrl, token }: VerificationInput): string {
  const body = `
    <div style="text-align:center;">
      <span class="badge badge-blue">🔒 SEGURIDAD DE CUENTA</span>
      <h1 style="color:#00d4ff;margin-top:12px;">Verificación de Cuenta</h1>
    </div>
    <p>Hola <strong style="color:#fff">${escapeHtml(name || 'Cliente')}</strong>,</p>
    <p>Gracias por registrarte en <strong style="color:#fff">${BRAND.name}</strong>. Para activar tu cuenta y acceder a todos los servicios de tu panel, confirmá tu dirección de correo electrónico.</p>

    ${
      token
        ? `
      <div class="hud-box" style="border-color:rgba(0,212,255,0.35);text-align:center;">
        <div class="label" style="color:#00d4ff;">Tu Código de Verificación</div>
        <div style="font-family:monospace;font-size:28px;font-weight:bold;letter-spacing:6px;color:#fff;margin:12px 0;">${escapeHtml(token)}</div>
        <p style="font-size:12px;color:#888;margin:0;">Válido por 24 horas</p>
      </div>
    `
        : ''
    }

    <div style="text-align:center;margin:26px 0;">
      <a href="${escapeHtml(verificationUrl) || BRAND.domain + '/dashboard'}" class="btn" style="padding:15px 34px;font-size:15px;">Confirmar Correo Electrónico</a>
    </div>

    <div class="hud-box" style="padding:14px 16px;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">💡 <strong>¿No creaste una cuenta?</strong> Si no realizaste esta solicitud, podés ignorar este correo de forma segura. Tu cuenta no será activada sin esta confirmación.</p>
    </div>

    <hr class="divider">
    <p style="font-size:12px;color:#64748b;text-align:center;margin:0;">Por razones de seguridad, este enlace de verificación expirará automáticamente.</p>
  `
  return baseLayout(body, 'Confirma tu Correo Electrónico')
}

export function inboundEmailNotification({
  fromEmail,
  toEmail,
  subject,
  html,
  text,
  ticketId,
}: InboundInput): string {
  const safeSubject = escapeHtml(subject || 'Sin Asunto')
  const safeFromDisplay = escapeHtml(fromEmail || 'Desconocido')
  const cleanFromAddress = escapeHtml(extractCleanEmail(fromEmail) || fromEmail || 'Desconocido')
  const safeTo = escapeHtml(toEmail || 'Contacto@exepaginasweb.com')
  const isSales =
    safeTo.toLowerCase().includes('ventas') ||
    safeSubject.toLowerCase().includes('ventas') ||
    safeSubject.toLowerCase().includes('cotiz')
  const defaultTicket = isSales ? 'EXE-VNT-DIRECT' : 'EXE-CNT-DIRECT'
  const safeTicket = escapeHtml(ticketId || defaultTicket)
  const safeMessage = escapeHtml(text || stripHtml(html) || 'Sin contenido')
  const channelTag = isSales ? 'VENTAS & PROYECTOS' : 'CONTACTO & SOPORTE'
  const channelBadgeClass = isSales ? 'badge-magenta' : 'badge-blue'

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td align="left" valign="middle">
          <h1 style="margin:0;font-size:21px;color:#fff;">💬 Nuevo mensaje (${isSales ? 'Ventas' : 'Contacto'})</h1>
        </td>
        <td align="right" valign="middle">
          <span class="badge ${channelBadgeClass}" style="font-family:monospace;font-size:12px;">${safeTicket}</span>
        </td>
      </tr>
    </table>

    <div class="hud-box" style="border-color:${isSales ? 'rgba(236,72,153,0.32)' : 'rgba(0,212,255,0.32)'};">
      <div class="label">Canal Oficial</div>
      <div class="value" style="margin-bottom:14px;">
        <span class="badge ${channelBadgeClass}">${channelTag} · ${safeTo}</span>
      </div>

      <div class="label">Remitente</div>
      <div class="value">${safeFromDisplay}</div>

      <div class="label">Correo Electrónico</div>
      <div class="value"><a href="mailto:${cleanFromAddress}" style="color:#00d4ff;text-decoration:none">${cleanFromAddress}</a></div>

      <div class="label">Asunto</div>
      <div class="value">${safeSubject}</div>

      <hr class="divider" style="margin:14px 0">

      <div class="label">Mensaje del Cliente</div>
      <div style="color:#e2e8f0;background:#050811;padding:16px;border-radius:10px;margin:8px 0 0;font-size:14px;line-height:1.6;border:1px solid rgba(148,163,184,0.16);overflow-x:auto;">
        <div style="white-space:pre-wrap;font-family:inherit;">${safeMessage}</div>
      </div>
    </div>

    <div style="text-align:center;margin:22px 0 14px;">
      <a href="mailto:${cleanFromAddress}?subject=Re:%20[${safeTicket}]%20${safeSubject}" class="btn" style="background:linear-gradient(135deg,${isSales ? '#ec4899,#00d4ff' : '#00d4ff,#10b981'});color:#041019;">
        Responder al Cliente
      </a>
    </div>

    <div style="background:#070b14;border-radius:10px;padding:14px 18px;border:1px solid rgba(148,163,184,0.14);margin-top:18px;text-align:center;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        💡 <strong>Reenvío automático:</strong> Mensaje recibido originalmente en <strong>${safeTo}</strong> y reenviado a <strong>Exemetal@hotmail.com</strong>. Podés responder directamente desde tu correo.
      </p>
    </div>
  `
  return baseLayout(body, `[${safeTicket}] Nuevo mensaje de ${safeFromDisplay}`)
}

export { baseLayout, styles }
