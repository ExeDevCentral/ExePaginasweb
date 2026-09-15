/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send.js'
import { paymentConfirmation, paymentNotification } from '@/lib/email/templates.js'
import { catalogEntryById, PLAN_CATALOG } from '@/core/domain/planCatalog'

export const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com'

export type PayPalCaptureInfo = { id?: string; status?: string }

export type PayPalPurchaseUnit = {
  custom_id?: string
  description?: string
  amount?: { value?: string; currency_code?: string }
  payments?: { captures?: PayPalCaptureInfo[] }
}

export type PayPalCapturedOrder = {
  id?: string
  status?: string
  payer?: { email_address?: string; name?: { given_name?: string } }
  purchase_units?: PayPalPurchaseUnit[]
}

export type PayPalPlan = { id?: string; slug: string; nombre: string }

export type PayPalCaptureResult =
  | { ok: true; order: PayPalCapturedOrder }
  | { ok: false; alreadyCaptured: boolean; status?: number; error?: string }

export type ProcessPayPalResult =
  | {
      ok: true
      duplicate: boolean
      pagoId: string | null
      planSlug: string
      clientId: string | null
      tenantId: string | null
    }
  | { ok: false; error: string }

export type CreatePayPalOrderResult = { ok: true; orderId: string } | { ok: false; error: string }

export async function getPayPalAccessToken(): Promise<string | null> {
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

  const data = (await resp.json()) as { access_token?: string }
  if (!data.access_token) {
    console.error('[paypal] OAuth response missing access_token')
    return null
  }
  return data.access_token
}

export async function createPayPalOrder(params: {
  planSlug: string
  email: string
  tipoProyecto: string
}): Promise<CreatePayPalOrderResult> {
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

  const order = (await resp.json()) as { id?: string }
  if (!order?.id) return { ok: false, error: 'PayPal created order without id' }
  return { ok: true, orderId: order.id }
}

export async function capturePayPalOrder(
  orderId: string,
  token: string
): Promise<PayPalCaptureResult> {
  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (resp.ok) {
    const order = (await resp.json()) as PayPalCapturedOrder
    return { ok: true, order }
  }

  let body: { name?: string; message?: string } = {}
  try {
    body = (await resp.json()) as { name?: string; message?: string }
  } catch {
    body = {}
  }

  if (resp.status === 422 || body?.name === 'ORDER_ALREADY_CAPTURED') {
    return {
      ok: false,
      alreadyCaptured: true,
      status: resp.status,
      error: body?.message || 'Order already captured',
    }
  }

  console.error('[paypal] capture error:', resp.status, body?.message || (await resp.text()))
  return {
    ok: false,
    alreadyCaptured: false,
    status: resp.status,
    error: body?.message || 'Capture failed',
  }
}

export async function fetchPayPalOrder(
  orderId: string,
  token: string
): Promise<PayPalCapturedOrder | null> {
  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resp.ok) return null
  return (await resp.json()) as PayPalCapturedOrder
}

export async function getOrCreateCliente(email: string, fullName?: string): Promise<string | null> {
  if (!db) return null

  const { data: existentes } = await db.from('clientes').select('id').eq('email', email).limit(1)

  if (existentes?.[0]?.id) return existentes[0].id

  let id: string | null = null
  try {
    const { data: authUser } = await db.auth.admin.listUsers()
    const match = authUser?.users?.find((u) => u.email?.toLowerCase() === email?.toLowerCase())
    id = match?.id || null
  } catch (e: unknown) {
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

  return nuevo?.id || id
}

export async function getPlanBySlug(slug: string): Promise<PayPalPlan | null> {
  if (db) {
    const { data: planes } = await db
      .from('planes')
      .select('id, slug, nombre')
      .eq('slug', slug)
      .limit(1)
    if (planes?.[0]) return planes[0] as PayPalPlan
  }
  const entry = catalogEntryById(slug)
  return entry ? { slug: entry.id, nombre: entry.nombre } : null
}

export async function getPlanByAmountUSD(amount: string | undefined): Promise<PayPalPlan | null> {
  if (!amount) return null
  const precioUSD = Number(amount)
  if (!Number.isFinite(precioUSD) || precioUSD <= 0) return null

  const entry = PLAN_CATALOG.find((p) => p.precioUSD === precioUSD)
  if (!entry) return null
  return getPlanBySlug(entry.id)
}

export async function getOrCreateTenant(
  clienteId: string,
  email: string,
  plan: PayPalPlan | null
): Promise<string | null> {
  if (!db) return null

  const { data: existentes } = await db
    .from('tenants')
    .select('id')
    .eq('dueno_id', clienteId)
    .limit(1)

  if (existentes?.[0]?.id) return existentes[0].id

  const baseSlug = (email || 'cliente')
    .split('@')[0]!
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
      plan_id: plan?.id || null,
      settings: { source: 'paypal' },
    })
    .select('id')
    .single()

  if (tenantError) console.error('[paypal] Error creating tenant:', tenantError)
  return tenant?.id || null
}

export async function processPayPalCapture(
  captured: PayPalCapturedOrder
): Promise<ProcessPayPalResult> {
  if (!db || !isSupabaseAdminConfigured()) {
    return { ok: false, error: 'Database not configured' }
  }

  const purchaseUnit = captured.purchase_units?.[0]
  const customId = purchaseUnit?.custom_id || ''
  const [customPlanSlug, customEmail] = customId.split('|')
  const customTipo = customId.split('|')[2] || 'mantenimiento'

  const email = captured.payer?.email_address || customEmail || ''
  const amount = purchaseUnit?.amount?.value
  const currency = purchaseUnit?.amount?.currency_code

  if (
    !email ||
    !amount ||
    currency !== 'USD' ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    return { ok: false, error: 'PayPal payload is missing payment data' }
  }

  const clienteId = await getOrCreateCliente(email, captured.payer?.name?.given_name)
  if (!clienteId) return { ok: false, error: 'Customer could not be resolved' }

  const plan = (await getPlanBySlug(customPlanSlug || '')) || (await getPlanByAmountUSD(amount))
  if (!plan) return { ok: false, error: 'Unknown PayPal plan' }

  const orderId = captured.id
  const captureId = purchaseUnit?.payments?.captures?.[0]?.id
  const now = new Date().toISOString()

  if (orderId) {
    const { data: existing } = await db
      .from('pagos')
      .select('id')
      .eq('paypal_order_id', orderId)
      .limit(1)
    if (existing?.[0]?.id) {
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
  const pagoId = pagoInsertado?.id || null

  const { data: activas } = await db
    .from('suscripciones')
    .select('id, plan_slug, estado')
    .eq('cliente_id', clienteId)
    .limit(5)
  const yaSuscrito = activas?.some((s) => s.plan_slug === plan.slug && s.estado === 'activa')
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
      const payerName = captured.payer?.name?.given_name || ''

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
