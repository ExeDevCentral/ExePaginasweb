function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import { sendEmail, syncContactToAudience, ADMIN_EMAIL } from '../email/send.js'
import { paymentConfirmation, paymentNotification } from '@/lib/email/templates.js'
import { catalogEntryById, PLAN_CATALOG } from '@/core/domain/planCatalog'

export const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const resp = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!resp.ok) {
    console.error('[paypal] OAuth token request failed:', resp.status, await resp.text())
    return null
  }

  const data = await resp.json()
  if (!data.access_token) {
    console.error('[paypal] OAuth response missing access_token')
    return null
  }
  return data.access_token
}

export async function createPayPalOrder(params) {
  const token = await getPayPalAccessToken()
  if (!token) return { ok: false, error: 'PayPal credentials are not configured' }

  const plan = catalogEntryById(params.planSlug)
  if (!plan) return { ok: false, error: `Unknown plan: ${params.planSlug}` }

  const customId = `${params.planSlug}|${params.email}|${params.tipoProyecto}`
  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.planSlug,
          description: `${plan.nombre} — Abono mensual`,
          custom_id: customId,
          amount: { currency_code: 'USD', value: plan.precioUSD.toFixed(2) },
        },
      ],
      application_context: {
        brand_name: 'ExeSistemasWEB',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    }),
  })

  if (!resp.ok) {
    console.error('[paypal] create order error:', resp.status, await resp.text())
    return { ok: false, error: 'Failed to create PayPal order' }
  }

  const order = await resp.json()
  if (!_optionalChain([order, 'optionalAccess', (_) => _.id]))
    return { ok: false, error: 'PayPal created order without id' }
  return { ok: true, orderId: order.id }
}

export async function capturePayPalOrder(orderId, token) {
  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (resp.ok) {
    const order = await resp.json()
    return { ok: true, order }
  }

  let body = {}
  try {
    body = await resp.json()
  } catch (e2) {
    body = {}
  }

  if (
    resp.status === 422 ||
    _optionalChain([body, 'optionalAccess', (_2) => _2.name]) === 'ORDER_ALREADY_CAPTURED'
  ) {
    return {
      ok: false,
      alreadyCaptured: true,
      status: resp.status,
      error:
        _optionalChain([body, 'optionalAccess', (_3) => _3.message]) || 'Order already captured',
    }
  }

  console.error(
    '[paypal] capture error:',
    resp.status,
    _optionalChain([body, 'optionalAccess', (_4) => _4.message]) || (await resp.text())
  )
  return {
    ok: false,
    alreadyCaptured: false,
    status: resp.status,
    error: _optionalChain([body, 'optionalAccess', (_5) => _5.message]) || 'Capture failed',
  }
}

export async function fetchPayPalOrder(orderId, token) {
  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resp.ok) return null
  return await resp.json()
}

export async function getOrCreateCliente(email, fullName) {
  if (!db) return null

  const { data: existentes } = await db.from('clientes').select('id').eq('email', email).limit(1)

  if (
    _optionalChain([existentes, 'optionalAccess', (_6) => _6[0], 'optionalAccess', (_7) => _7.id])
  )
    return existentes[0].id

  let id = null
  try {
    const { data: authUser } = await db.auth.admin.listUsers()
    const match = _optionalChain([
      authUser,
      'optionalAccess',
      (_8) => _8.users,
      'optionalAccess',
      (_9) => _9.find,
      'call',
      (_10) =>
        _10(
          (u) =>
            _optionalChain([
              u,
              'access',
              (_11) => _11.email,
              'optionalAccess',
              (_12) => _12.toLowerCase,
              'call',
              (_13) => _13(),
            ]) ===
            _optionalChain([
              email,
              'optionalAccess',
              (_14) => _14.toLowerCase,
              'call',
              (_15) => _15(),
            ])
        ),
    ])
    id = _optionalChain([match, 'optionalAccess', (_16) => _16.id]) || null
  } catch (e) {
    console.warn(
      '[paypal] No se pudo buscar en auth.users:',
      e instanceof Error ? e.message : 'Unknown auth error'
    )
  }

  if (!id) return null

  const { data: nuevo } = await db
    .from('clientes')
    .insert({ id, email, full_name: fullName || null })
    .select('id')
    .single()

  return _optionalChain([nuevo, 'optionalAccess', (_17) => _17.id]) || id
}

export async function getPlanBySlug(slug) {
  if (db) {
    const { data: planes } = await db
      .from('planes')
      .select('id, slug, nombre')
      .eq('slug', slug)
      .limit(1)
    if (_optionalChain([planes, 'optionalAccess', (_18) => _18[0]])) return planes[0]
  }
  const entry = catalogEntryById(slug)
  return entry ? { slug: entry.id, nombre: entry.nombre } : null
}

export async function getPlanByAmountUSD(amount) {
  if (!amount) return null
  const precioUSD = Number(amount)
  if (!Number.isFinite(precioUSD) || precioUSD <= 0) return null

  const entry = PLAN_CATALOG.find((p) => p.precioUSD === precioUSD)
  if (!entry) return null
  return getPlanBySlug(entry.id)
}

export async function getOrCreateTenant(clienteId, email, plan) {
  if (!db) return null

  const { data: existentes } = await db
    .from('tenants')
    .select('id')
    .eq('dueno_id', clienteId)
    .limit(1)

  if (
    _optionalChain([
      existentes,
      'optionalAccess',
      (_19) => _19[0],
      'optionalAccess',
      (_20) => _20.id,
    ])
  )
    return existentes[0].id

  const baseSlug = (email || 'cliente')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
  const slug = `${baseSlug}-${clienteId.slice(0, 8)}`

  const { data: tenant, error: tenantError } = await db
    .from('tenants')
    .insert({
      slug,
      nombre: baseSlug || 'Mi Empresa',
      dueno_id: clienteId,
      estado: 'activo',
      plan_id: _optionalChain([plan, 'optionalAccess', (_21) => _21.id]) || null,
      settings: { source: 'paypal' },
    })
    .select('id')
    .single()

  if (tenantError) console.error('[paypal] Error creating tenant:', tenantError)
  return _optionalChain([tenant, 'optionalAccess', (_22) => _22.id]) || null
}

export async function processPayPalCapture(captured) {
  if (!db || !isSupabaseAdminConfigured()) {
    return { ok: false, error: 'Database not configured' }
  }

  const purchaseUnit = _optionalChain([
    captured,
    'access',
    (_23) => _23.purchase_units,
    'optionalAccess',
    (_24) => _24[0],
  ])
  const customId = _optionalChain([purchaseUnit, 'optionalAccess', (_25) => _25.custom_id]) || ''
  const [customPlanSlug, customEmail] = customId.split('|')
  const customTipo = customId.split('|')[2] || 'mantenimiento'

  const email =
    _optionalChain([
      captured,
      'access',
      (_26) => _26.payer,
      'optionalAccess',
      (_27) => _27.email_address,
    ]) ||
    customEmail ||
    ''
  const amount = _optionalChain([
    purchaseUnit,
    'optionalAccess',
    (_28) => _28.amount,
    'optionalAccess',
    (_29) => _29.value,
  ])
  const currency = _optionalChain([
    purchaseUnit,
    'optionalAccess',
    (_30) => _30.amount,
    'optionalAccess',
    (_31) => _31.currency_code,
  ])

  if (
    !email ||
    !amount ||
    currency !== 'USD' ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    return { ok: false, error: 'PayPal payload is missing payment data' }
  }

  const clienteId = await getOrCreateCliente(
    email,
    _optionalChain([
      captured,
      'access',
      (_32) => _32.payer,
      'optionalAccess',
      (_33) => _33.name,
      'optionalAccess',
      (_34) => _34.given_name,
    ])
  )
  if (!clienteId) return { ok: false, error: 'Customer could not be resolved' }

  const plan = (await getPlanBySlug(customPlanSlug || '')) || (await getPlanByAmountUSD(amount))
  if (!plan) return { ok: false, error: 'Unknown PayPal plan' }

  const orderId = captured.id
  const captureId = _optionalChain([
    purchaseUnit,
    'optionalAccess',
    (_35) => _35.payments,
    'optionalAccess',
    (_36) => _36.captures,
    'optionalAccess',
    (_37) => _37[0],
    'optionalAccess',
    (_38) => _38.id,
  ])
  const now = new Date().toISOString()

  if (orderId) {
    const { data: existing } = await db
      .from('pagos')
      .select('id')
      .eq('paypal_order_id', orderId)
      .limit(1)
    if (
      _optionalChain([
        existing,
        'optionalAccess',
        (_39) => _39[0],
        'optionalAccess',
        (_40) => _40.id,
      ])
    ) {
      return {
        ok: true,
        duplicate: true,
        pagoId: existing[0].id,
        planSlug: plan.slug,
        clientId: clienteId,
        tenantId: null,
      }
    }
  }

  const { data: pagoInsertado, error: pagoError } = await db
    .from('pagos')
    .insert({
      cliente_id: clienteId,
      monto: parseFloat(amount),
      moneda: 'USD',
      estado: 'aprobado',
      fecha_aprobacion: now,
      plan_nombre: plan.nombre,
      plan_slug: plan.slug,
      tipo_proyecto: customTipo,
      provider: 'paypal',
      paypal_order_id: orderId || null,
      paypal_capture_id: captureId || null,
    })
    .select('id')
    .single()

  if (pagoError) {
    if (pagoError.code === '23505') {
      return {
        ok: true,
        duplicate: true,
        pagoId: null,
        planSlug: plan.slug,
        clientId: clienteId,
        tenantId: null,
      }
    }
    console.error('[paypal] Error inserting pago:', pagoError)
    return { ok: false, error: 'Failed to record payment' }
  }
  const pagoId = _optionalChain([pagoInsertado, 'optionalAccess', (_41) => _41.id]) || null

  const { data: activas } = await db
    .from('suscripciones')
    .select('id, plan_slug, estado')
    .eq('cliente_id', clienteId)
    .limit(5)
  const yaSuscrito = _optionalChain([
    activas,
    'optionalAccess',
    (_42) => _42.some,
    'call',
    (_43) => _43((s) => s.plan_slug === plan.slug && s.estado === 'activa'),
  ])
  if (!yaSuscrito) {
    const { error: subError } = await db.from('suscripciones').insert({
      cliente_id: clienteId,
      plan_slug: plan.slug,
      estado: 'activa',
      fecha_inicio: now,
    })
    if (subError) console.error('[paypal] Error inserting suscripcion:', subError)
  }

  const tenantId = await getOrCreateTenant(clienteId, email, plan)
  if (tenantId && pagoId) {
    try {
      const { data: invoiceResult, error: invoiceError } = await db.rpc(
        'create_invoice_from_payment',
        { p_pago_id: pagoId, p_tenant_id: tenantId }
      )
      if (invoiceError) console.error('[paypal] RPC error:', invoiceError)
      if (invoiceResult) console.log('[paypal] Invoice created:', invoiceResult)
    } catch (invoiceErr) {
      console.error('[paypal] Error creating invoice via RPC:', invoiceErr)
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://exepaginasweb.com'}/dashboard`
      const payerName =
        _optionalChain([
          captured,
          'access',
          (_44) => _44.payer,
          'optionalAccess',
          (_45) => _45.name,
          'optionalAccess',
          (_46) => _46.given_name,
        ]) || ''

      // Sincronizar comprador con la audiencia de clientes en Resend
      void syncContactToAudience({
        email,
        firstName: payerName || 'Cliente',
      }).catch((err) => {
        console.warn('[paypal] Error sincronizando cliente con Resend Audience:', err)
      })

      await sendEmail({
        to: [email],
        subject: `Pago aprobado - ${plan.nombre}`,
        html: paymentConfirmation({
          name: payerName,
          plan: plan.nombre,
          amount,
          currency: 'USD',
          orderId: orderId || '',
          dashboardUrl,
        }),
        tags: [
          { name: 'category', value: 'payment_approved_client' },
          { name: 'plan', value: plan.slug },
          { name: 'order_id', value: orderId || '' },
        ],
      })

      await sendEmail({
        to: [ADMIN_EMAIL],
        subject: `Nueva venta! ${payerName || 'Un cliente'} compro ${plan.nombre}`,
        html: paymentNotification({
          name: payerName,
          email,
          plan: plan.nombre,
          slug: plan.slug,
          amount,
          tipoProyecto: customTipo,
          orderId: orderId || '',
        }),
        tags: [
          { name: 'category', value: 'payment_approved_admin' },
          { name: 'plan', value: plan.slug },
          { name: 'order_id', value: orderId || '' },
        ],
      })
    } catch (e) {
      console.error('[paypal] Email error:', e)
    }
  }

  return {
    ok: true,
    duplicate: false,
    pagoId,
    planSlug: plan.slug,
    clientId: clienteId,
    tenantId,
  }
}
