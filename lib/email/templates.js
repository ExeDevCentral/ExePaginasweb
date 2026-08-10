function escapeHtml(str) {
  if (typeof str !== 'string') return str ?? ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const BRAND = {
  name: 'ExeSistemasWEB',
  domain: 'https://exepaginasweb.com',
  logo: 'https://exepaginasweb.com/logo.webp',
  primary: '#00d4ff',
  secondary: '#ff00ff',
}

function baseLayout(body, title) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} - ${BRAND.name}</title>
  <style>${styles()}</style>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f">
    <tr><td align="center" style="padding:40px 16px">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr>
          <td style="text-align:center;padding-bottom:32px">
            <img src="${BRAND.logo}" alt="${BRAND.name}" width="48" height="48" style="border-radius:12px">
            <p style="margin:8px 0 0;font-size:13px;color:#888;letter-spacing:2px;text-transform:uppercase">${BRAND.name}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#12121a;border-radius:16px;border:1px solid #1e1e2e;padding:32px">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="text-align:center;padding:24px 0 0;font-size:12px;color:#555">
            <p>${BRAND.name} — Estudio Premium de Sistemas y Automatización</p>
            <p style="margin:4px 0">
              <a href="${BRAND.domain}" style="color:#00d4ff;text-decoration:none">exepaginasweb.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function styles() {
  return `
    .btn {
      display:inline-block;padding:14px 32px;border-radius:12px;
      font-weight:700;font-size:15px;text-decoration:none;
      background:linear-gradient(135deg,${BRAND.primary},${BRAND.secondary});
      color:#000;margin:16px 0;
    }
    h1 {color:#fff;font-size:24px;margin:0 0 16px}
    h2 {color:#fff;font-size:18px;margin:24px 0 8px}
    p {color:#aaa;font-size:14px;line-height:1.6;margin:0 0 12px}
    .label {color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 2px}
    .value {color:#fff;font-size:15px;font-weight:600;margin:0 0 12px}
    .badge {
      display:inline-block;padding:4px 12px;border-radius:20px;
      font-size:12px;font-weight:600;
    }
    .badge-green {background:#065f4620;color:#22c55e;border:1px solid #22c55e40}
    .badge-blue {background:#00d4ff10;color:#00d4ff;border:1px solid #00d4ff30}
    .divider {border:none;border-top:1px solid #1e1e2e;margin:24px 0}
  `
}

export function paymentConfirmation({ name, plan, amount, currency, orderId, dashboardUrl }) {
  const body = `
    <h1>✅ ¡Pago aprobado!</h1>
    <p>Hola <strong style="color:#fff">${escapeHtml(name)}</strong>, tu pago fue procesado correctamente.</p>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #1e1e2e">
      <div class="label">Plan</div>
      <div class="value">${escapeHtml(plan)}</div>
      <div class="label">Monto</div>
      <div class="value">${escapeHtml(currency)} ${escapeHtml(amount)}</div>
      <div class="label">Estado</div>
      <div class="badge badge-green">Aprobado</div>
      ${orderId ? `<br><br><div class="label">ID de orden</div><div class="value" style="font-family:monospace;font-size:13px">${escapeHtml(orderId)}</div>` : ''}
    </div>
    <p>Ya podés acceder a tu plan desde el panel de cliente.</p>
    <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Ir al Dashboard</a>
    <hr class="divider">
    <p style="font-size:13px">Si tenés alguna duda, respondé este correo o contactanos desde la web.</p>
  `
  return baseLayout(body, 'Pago aprobado')
}

export function paymentNotification({ name, email, plan, slug, amount, tipoProyecto, orderId }) {
  const body = `
    <h1>🚀 ¡Nueva venta!</h1>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #1e1e2e">
      <div class="label">Cliente</div>
      <div class="value">${escapeHtml(name || 'N/A')}</div>
      <div class="label">Email</div>
      <div class="value">${escapeHtml(email)}</div>
      <hr class="divider" style="margin:12px 0">
      <div class="label">Plan</div>
      <div class="value">${escapeHtml(plan)} <span class="badge badge-blue" style="font-size:11px">${escapeHtml(slug)}</span></div>
      <div class="label">Proyecto</div>
      <div class="value">${escapeHtml(tipoProyecto || 'mantenimiento')}</div>
      <div class="label">Monto</div>
      <div class="value" style="color:#22c55e">$${escapeHtml(amount)} USD</div>
      ${orderId ? `<br><div class="label">ID PayPal</div><div class="value" style="font-family:monospace;font-size:12px">${escapeHtml(orderId)}</div>` : ''}
    </div>
    <p>Los datos ya fueron guardados en Supabase y el plan está activo.</p>
  `
  return baseLayout(body, 'Nueva venta recibida')
}

export function contactNotification({ name, email, message, ticketId }) {
  const safeTicket = escapeHtml(ticketId || 'EXE-CNT-DIRECT')
  const body = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h1 style="margin:0;font-size:22px;color:#fff;">💬 Nuevo mensaje de contacto</h1>
      <span class="badge badge-blue" style="font-family:monospace;font-size:12px;">${safeTicket}</span>
    </div>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #00d4ff30">
      <div class="label">Remitente</div>
      <div class="value">${escapeHtml(name)}</div>
      <div class="label">Correo Electrónico</div>
      <div class="value"><a href="mailto:${escapeHtml(email)}" style="color:#00d4ff;text-decoration:none">${escapeHtml(email)}</a></div>
      <hr class="divider" style="margin:12px 0">
      <div class="label">Mensaje del Cliente</div>
      <div style="color:#e2e8f0;background:#0a0a0f;padding:16px;border-radius:10px;margin:8px 0 0;font-size:14px;line-height:1.6;border:1px solid #1e1e2e;">
        ${escapeHtml(message).replace(/\n/g, '<br>')}
      </div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="mailto:${escapeHtml(email)}?subject=Re:%20[${safeTicket}]%20Tu%20consulta%20en%20ExeSistemasWEB" class="btn">Responder al Cliente</a>
    </div>
  `
  return baseLayout(body, `[${safeTicket}] Nuevo contacto de ${name}`)
}

export function contactAutoReply({ name, message, ticketId, lang = 'es' }) {
  const isEn = String(lang).toLowerCase().startsWith('en')
  const safeName = escapeHtml(name || (isEn ? 'Valued Client' : 'Estimado/a'))
  const safeTicket = escapeHtml(ticketId || 'EXE-CNT-00000')

  const copy = isEn
    ? {
        subject: `Contact Confirmation [${safeTicket}]`,
        ticketHeader: `SUPPORT TICKET: ${safeTicket}`,
        heading: `Hello ${safeName}! We received your message ✨`,
        subheading: `Thank you for reaching out to <strong>${BRAND.name}</strong>. Your request has been successfully registered and our engineering and business development team is reviewing it.`,
        statusLabel: `Request Status`,
        statusValue: `Under Review`,
        slaLabel: `Estimated Response Time`,
        slaValue: `Less than 2 Hours`,
        summaryLabel: `Summary of your submitted message`,
        immediateQuestion: `Need an immediate response?`,
        whatsappButton: `💬 Chat on WhatsApp Direct`,
        whatsappText: `Hello!%20I%20have%20support%20ticket%20${safeTicket}%20and%20I%20would%20like%20to%20inquire...`,
        footnote: `💡 An assigned specialist for ticket <strong>${safeTicket}</strong> will reply directly to this email.`,
      }
    : {
        subject: `Confirmación de Contacto [${safeTicket}]`,
        ticketHeader: `TICKET DE ATENCIÓN: ${safeTicket}`,
        heading: `¡Hola ${safeName}! Recibimos tu mensaje ✨`,
        subheading: `Gracias por contactar a <strong>${BRAND.name}</strong>. Tu consulta ha sido registrada exitosamente y nuestro equipo técnico y comercial la está revisando.`,
        statusLabel: `Estado de la Petición`,
        statusValue: `En Revisión`,
        slaLabel: `Tiempo Estimado de Respuesta`,
        slaValue: `Menos de 2 Horas`,
        summaryLabel: `Resumen de tu mensaje enviado`,
        immediateQuestion: `¿Necesitás respuesta inmediata?`,
        whatsappButton: `💬 Chatear por WhatsApp Directo`,
        whatsappText: `¡Hola!%20Tengo%20el%20ticket%20${safeTicket}%20y%20quisiera%20consultar...`,
        footnote: `💡 Un especialista asignado a tu ticket <strong>${safeTicket}</strong> responderá directamente a este correo.`,
      }

  const body = `
    <div style="text-align:center;padding-bottom:12px;">
      <div class="badge badge-blue" style="font-family:monospace;font-size:12px;letter-spacing:1px;margin-bottom:12px;">${copy.ticketHeader}</div>
      <h1 style="font-size:26px;color:#fff;margin:8px 0;">${copy.heading}</h1>
      <p style="color:#94a3b8;font-size:15px;max-width:480px;margin:0 auto 20px;line-height:1.6;">
        ${copy.subheading}
      </p>
    </div>

    <div style="background:#0d0d14;border-radius:14px;padding:24px;margin:20px 0;border:1px solid #00d4ff30;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="label" style="color:#00d4ff;">${copy.statusLabel}</span>
        <span class="badge badge-green">${copy.statusValue}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <span class="label">${copy.slaLabel}</span>
        <span class="badge badge-blue">${copy.slaValue}</span>
      </div>

      <hr class="divider" style="margin:16px 0;">

      <div class="label" style="margin-bottom:8px;">${copy.summaryLabel}</div>
      <div style="color:#cbd5e1;background:#0a0a0f;padding:14px 16px;border-radius:10px;font-size:13px;line-height:1.5;border:1px solid #1e1e2e;font-style:italic;">
        "${escapeHtml(message).replace(/\n/g, '<br>')}"
      </div>
    </div>

    <div style="text-align:center;margin:28px 0 16px;">
      <p style="color:#fff;font-size:14px;font-weight:600;margin-bottom:12px;">${copy.immediateQuestion}</p>
      <a href="https://wa.me/5493416874786?text=${copy.whatsappText}" class="btn" style="background:linear-gradient(135deg,#22c55e,#00d4ff);color:#000;padding:14px 28px;font-size:14px;box-shadow:0 0 15px rgba(34,197,94,0.3);">
        ${copy.whatsappButton}
      </a>
    </div>

    <div style="background:#0d0d14;border-radius:10px;padding:16px;margin-top:24px;border:1px solid #1e1e2e;text-align:center;">
      <p style="font-size:12px;color:#64748b;margin:0;">
        ${copy.footnote}
      </p>
    </div>
  `
  return baseLayout(body, copy.subject)
}

export function aiDiagnosticAutoReply({
  name,
  message,
  ticketId,
  projectType,
  total,
  lang = 'es',
}) {
  const isEn = String(lang).toLowerCase().startsWith('en')
  const safeName = escapeHtml(name || (isEn ? 'Valued Client' : 'Estimado/a'))
  const safeTicket = escapeHtml(ticketId || 'EXE-AI-00000')

  const copy = isEn
    ? {
        subject: `🤖 AI Diagnostic Completed [${safeTicket}] - ExeSistemasWEB`,
        badge: `🤖 AI DIAGNOSTIC COMPLETED`,
        heading: `Hello ${safeName}! Your AI Diagnostic is Ready ✨`,
        subheading: `Thank you for completing the Intelligent AI Diagnostic. We have registered your contact details and stored your technical project specifications. An assigned senior engineer is reviewing your results to provide you with a personalized optimization strategy.`,
        statusLabel: `Diagnostic Status`,
        statusValue: `Completed — In Review`,
        slaLabel: `Personalized Follow-up`,
        slaValue: `Under 2 Hours`,
        summaryHeading: `Technical Summary of Your Project`,
        warmNote: `💡 <strong>Want to refine your diagnostic?</strong> We are ready to tune your architecture, add custom integrations, or adjust the budget to match your exact goals.`,
        whatsappButton: `💬 Review Diagnostic via Direct WhatsApp`,
        whatsappText: `Hello!%20I%20completed%20the%20AI%20Diagnostic%20${safeTicket}%20and%20I%20would%20like%20to%20review%20my%20project...`,
        footnote: `💡 A senior specialist assigned to ticket <strong>${safeTicket}</strong> will reach out directly to review and optimize your diagnostic.`,
      }
    : {
        subject: `🤖 Diagnóstico IA Finalizado [${safeTicket}] - ExeSistemasWEB`,
        badge: `🤖 DIAGNÓSTICO INTELIGENTE FINALIZADO`,
        heading: `¡Hola ${safeName}! Tu Diagnóstico IA está Listo ✨`,
        subheading: `Gracias por completar el Diagnóstico con Inteligencia Artificial. Ya registramos tu contacto y almacenamos la especificación técnica de tu proyecto. Un ingeniero senior está analizando las métricas para ofrecerte una estrategia de optimización personalizada.`,
        statusLabel: `Estado del Diagnóstico`,
        statusValue: `Finalizado — En Revisión`,
        slaLabel: `Devolución Personalizada`,
        slaValue: `Menos de 2 Horas`,
        summaryHeading: `Resumen Técnico del Diagnóstico`,
        warmNote: `💡 <strong>¿Querés mejorar o ajustar tu diagnóstico?</strong> Contamos con tu contacto y estamos listos para optimizar el alcance, agregar módulos o ajustar el presupuesto según las necesidades exactas de tu negocio.`,
        whatsappButton: `💬 Revisar Diagnóstico por WhatsApp Directo`,
        whatsappText: `¡Hola!%20Completé%20el%20Diagnóstico%20con%20IA%20${safeTicket}%20y%20quisiera%20revisar%20mi%20proyecto...`,
        footnote: `💡 Un especialista senior asignado a tu ticket <strong>${safeTicket}</strong> te contactará para profundizar en las mejoras de tu sistema.`,
      }

  const body = `
    <div style="text-align:center;padding-bottom:12px;">
      <div class="badge badge-blue" style="font-family:monospace;font-size:12px;letter-spacing:1px;margin-bottom:12px;background:linear-gradient(135deg,#00d4ff20,#ff00ff20);border:1px solid #00d4ff40;color:#00d4ff;padding:6px 16px;">
        ${copy.badge} — ${safeTicket}
      </div>
      <h1 style="font-size:26px;color:#fff;margin:8px 0 12px;">
        ${copy.heading}
      </h1>
      <p style="color:#94a3b8;font-size:15px;max-width:500px;margin:0 auto 20px;line-height:1.6;">
        ${copy.subheading}
      </p>
    </div>

    <div style="background:#0d0d14;border-radius:14px;padding:24px;margin:20px 0;border:1px solid #00d4ff40;box-shadow:0 8px 24px rgba(0,212,255,0.1);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="label" style="color:#00d4ff;">${copy.statusLabel}</span>
        <span class="badge badge-green">${copy.statusValue}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <span class="label">${copy.slaLabel}</span>
        <span class="badge badge-blue">${copy.slaValue}</span>
      </div>

      <hr class="divider" style="margin:16px 0;">

      <div class="label" style="margin-bottom:8px;color:#00d4ff;font-weight:600;">${copy.summaryHeading}</div>
      <div style="color:#cbd5e1;background:#0a0a0f;padding:16px;border-radius:10px;font-size:13px;line-height:1.6;border:1px solid #1e1e2e;">
        ${projectType ? `<p style="margin:0 0 6px;color:#fff;"><strong>Proyecto:</strong> ${escapeHtml(projectType)}</p>` : ''}
        ${total ? `<p style="margin:0 0 6px;color:#22c55e;"><strong>Estimación:</strong> ${escapeHtml(String(total))}</p>` : ''}
        <div style="margin-top:6px;font-style:italic;color:#94a3b8;">
          "${escapeHtml(message).replace(/\n/g, '<br>')}"
        </div>
      </div>

      <div style="background:#00d4ff10;border:1px solid #00d4ff30;border-radius:10px;padding:14px;margin-top:16px;color:#e2e8f0;font-size:13px;line-height:1.5;">
        ${copy.warmNote}
      </div>
    </div>

    <div style="text-align:center;margin:28px 0 16px;">
      <a href="https://wa.me/5493416874786?text=${copy.whatsappText}" class="btn" style="background:linear-gradient(135deg,#00d4ff,#ff00ff);color:#fff;padding:16px 32px;font-size:15px;box-shadow:0 0 25px rgba(0,212,255,0.4);border-radius:12px;">
        ${copy.whatsappButton}
      </a>
    </div>

    <div style="background:#0d0d14;border-radius:10px;padding:16px;margin-top:24px;border:1px solid #1e1e2e;text-align:center;">
      <p style="font-size:12px;color:#64748b;margin:0;">
        ${copy.footnote}
      </p>
    </div>
  `
  return baseLayout(body, copy.subject)
}

export function welcomeEmail({ name, email, dashboardUrl }) {
  const body = `
    <h1>🎉 Bienvenido a ${BRAND.name}</h1>
    <p>Hola <strong style="color:#fff">${escapeHtml(name || email)}</strong>,</p>
    <p>Tu cuenta fue creada exitosamente. Ya podés acceder al panel de cliente para gestionar tu plan, ver tus facturas y dar seguimiento a tus proyectos.</p>
    <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Ir al Dashboard</a>
    <hr class="divider">
    <p style="font-size:13px">Si tenés alguna duda, respondé este correo o contactanos desde la web.</p>
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
}) {
  const body = `
    <h1>📅 Aviso de Renovación Próxima</h1>
    <p>Hola, te informamos que tu servicio en <strong style="color:#fff">${escapeHtml(tenantName)}</strong> está programado para renovarse próximamente.</p>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #1e1e2e">
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
    <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Gestionar Servicios</a>
    <hr class="divider">
    <p style="font-size:13px">Si necesitas realizar cambios en tu suscripción o cancelar antes del cobro, podés gestionarlo desde tu panel.</p>
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
}) {
  const body = `
    <h1 style="color:#ff3366;">⚠️ Alerta de Incumplimiento de SLA</h1>
    <p>Se ha detectado un ticket fuera del tiempo límite establecido por el contrato SLA en <strong style="color:#fff">${escapeHtml(tenantName)}</strong>.</p>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #ff336640">
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
    <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn" style="background:linear-gradient(135deg,#ff3366,#ff00ff);">Ver Ticket en Panel</a>
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
}) {
  const body = `
    <h1>📄 Tu Factura Electrónica está lista</h1>
    <p>Hemos emitido el comprobante correspondiente a tus servicios en <strong style="color:#fff">${escapeHtml(tenantName)}</strong>.</p>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #1e1e2e">
      <div class="label">Número de Factura</div>
      <div class="value">${escapeHtml(invoiceNumber)} (Tipo ${escapeHtml(invoiceType)})</div>
      <div class="label">Monto Total</div>
      <div class="value" style="font-size:18px;color:#22c55e;">$ ${escapeHtml(String(amount))} ARS</div>
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
    <a href="${escapeHtml(dashboardUrl) || BRAND.domain + '/dashboard'}" class="btn">Ver Facturas</a>
  `
  return baseLayout(body, 'Factura Emitida')
}

export function emailVerification({ name, verificationUrl, token }) {
  const body = `
    <h1 style="color:#00d4ff;">🔒 Verificación de Cuenta</h1>
    <p>Hola <strong style="color:#fff">${escapeHtml(name || 'Cliente')}</strong>,</p>
    <p>Gracias por registrarte en <strong style="color:#fff">${BRAND.name}</strong>. Para activar tu cuenta y acceder a todos los servicios de tu panel, confirmá tu dirección de correo electrónico.</p>

    ${
      token
        ? `
      <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #00d4ff40;text-align:center;">
        <div class="label" style="color:#00d4ff;">Tu Código de Verificación</div>
        <div style="font-family:monospace;font-size:28px;font-weight:bold;letter-spacing:6px;color:#fff;margin:12px 0;">${escapeHtml(token)}</div>
        <p style="font-size:12px;color:#888;margin:0;">Válido por 24 horas</p>
      </div>
    `
        : ''
    }

    <div style="text-align:center;margin:28px 0;">
      <a href="${escapeHtml(verificationUrl) || BRAND.domain + '/dashboard'}" class="btn" style="padding:16px 36px;font-size:16px;box-shadow:0 0 20px rgba(0,212,255,0.3);">Confirmar Correo Electrónico</a>
    </div>

    <div style="background:#0d0d14;border-radius:12px;padding:16px;margin:20px 0;border:1px solid #1e1e2e;">
      <p style="font-size:12px;color:#888;margin:0;">💡 <strong>¿No creaste una cuenta?</strong> Si no realizaste esta solicitud, podés ignorar este correo de forma segura. Tu cuenta no será activada sin esta confirmación.</p>
    </div>

    <hr class="divider">
    <p style="font-size:12px;color:#666;text-align:center;">Por razones de seguridad, este enlace de verificación expirará automáticamente.</p>
  `
  return baseLayout(body, 'Confirma tu Correo Electrónico')
}

export function inboundEmailNotification({ fromEmail, subject, html, text }) {
  const safeSubject = escapeHtml(subject || 'Sin Asunto')
  const safeFrom = escapeHtml(fromEmail || 'Desconocido')
  const body = `
    <h1 style="color:#00d4ff;font-size:22px;margin-bottom:8px;">📩 Nuevo Mensaje Entrante</h1>
    <p style="color:#888;font-size:13px;margin-bottom:20px;">Has recibido una consulta directa en tu dominio <strong>exepaginasweb.com</strong>.</p>
    
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:16px 0;border:1px solid #1e1e2e;">
      <div class="label" style="color:#00d4ff;font-weight:600;">Remitente</div>
      <div class="value" style="color:#fff;font-size:15px;margin-bottom:12px;">${safeFrom}</div>
      
      <div class="label" style="color:#00d4ff;font-weight:600;">Asunto</div>
      <div class="value" style="color:#fff;font-size:15px;margin-bottom:12px;">${safeSubject}</div>
      
      <hr class="divider" style="margin:16px 0;border-top:1px solid #1e1e2e;">
      
      <div class="label" style="margin-bottom:8px;">Contenido del Mensaje</div>
      <div style="background:#0a0a0f;padding:16px;border-radius:8px;color:#d1d5db;font-size:14px;line-height:1.6;border:1px solid #1e1e2e;overflow-x:auto;">
        ${html || `<pre style="white-space:pre-wrap;font-family:inherit;margin:0;color:#d1d5db;">${escapeHtml(text || 'Sin contenido')}</pre>`}
      </div>
    </div>
    
    <div style="background:#0d0d14;border-radius:8px;padding:12px 16px;border:1px solid #00d4ff30;margin-top:20px;">
      <p style="font-size:12px;color:#94a3b8;margin:0;">
        💡 <strong>Respuesta directa:</strong> Al hacer clic en <em>"Responder"</em> en tu cliente de correo, le escribirás directamente a <strong>${safeFrom}</strong>.
      </p>
    </div>
  `
  return baseLayout(body, `[Email Entrante] ${safeSubject}`)
}

export { baseLayout, styles }
