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

export function contactNotification({ name, email, message }) {
  const body = `
    <h1>💬 Nuevo mensaje de contacto</h1>
    <div style="background:#0d0d14;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #1e1e2e">
      <div class="label">Nombre</div>
      <div class="value">${escapeHtml(name)}</div>
      <div class="label">Email</div>
      <div class="value">${escapeHtml(email)}</div>
      <hr class="divider" style="margin:12px 0">
      <div class="label">Mensaje</div>
      <p style="color:#ccc;background:#0a0a0f;padding:12px;border-radius:8px;margin:4px 0 0;font-size:14px;line-height:1.5">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    </div>
  `
  return baseLayout(body, 'Nuevo contacto')
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

export { baseLayout, styles }
