function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
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
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { isValidUUID } from '@/core/utils/uuid'

export const AiToolOutputSchemas = {
  getServices: z.object({
    ok: z.literal(true),
    data: z.array(
      z.object({
        id: z.string(),
        slug: z.string(),
        nombre: z.string(),
        descripcion: z.string().nullable(),
        tipo: z.string(),
        precio_base: z.number(),
        moneda: z.string(),
        intervalo: z.string(),
      })
    ),
  }),
  getPlans: z.object({
    ok: z.literal(true),
    data: z.array(
      z.object({
        id: z.string(),
        slug: z.string(),
        nombre: z.string(),
        precio: z.number(),
        moneda: z.string(),
      })
    ),
  }),
}

export async function getActiveServices() {
  const { data, error } = await supabaseAdmin
    .from('service_catalog')
    .select('id, slug, nombre, descripcion, tipo, precio_base, moneda, intervalo')
    .eq('activo', true)
    .order('tipo', { ascending: true })
    .order('nombre', { ascending: true })
    .limit(50)

  if (error) throw new Error(`Error consultando servicios: ${error.message}`)
  return { ok: true, data: _nullishCoalesce(data, () => []) }
}

export async function getActivePlans() {
  const { data, error } = await supabaseAdmin
    .from('planes')
    .select('id, slug, nombre, precio, moneda')
    .eq('activo', true)
    .order('precio', { ascending: true })
    .limit(20)

  if (error) throw new Error(`Error consultando planes: ${error.message}`)
  return { ok: true, data: _nullishCoalesce(data, () => []) }
}

export async function getClientStatus(userContext) {
  const clienteId = _nullishCoalesce(userContext.clienteId, () => userContext.userId)
  if (!clienteId || !isValidUUID(clienteId)) {
    return { ok: true, authenticated: false, reason: 'sin_sesion' }
  }

  const [clienteRes, subRes] = await Promise.allSettled([
    supabaseAdmin.from('clientes').select('id, full_name, email').eq('id', clienteId).maybeSingle(),
    supabaseAdmin
      .from('suscripciones')
      .select('id, plan_slug, estado')
      .eq('cliente_id', clienteId)
      .eq('estado', 'activa')
      .order('fecha_inicio', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const cliente = clienteRes.status === 'fulfilled' ? clienteRes.value.data : null
  const sub = subRes.status === 'fulfilled' ? subRes.value.data : null

  return {
    ok: true,
    authenticated: Boolean(cliente),
    clientName: _nullishCoalesce(
      _optionalChain([cliente, 'optionalAccess', (_) => _.full_name]),
      () => null
    ),
    clientEmail: _nullishCoalesce(
      _optionalChain([cliente, 'optionalAccess', (_2) => _2.email]),
      () => null
    ),
    subscription: _nullishCoalesce(sub, () => null),
  }
}

export async function getClientInvoices(userContext, limit) {
  const clienteId = _nullishCoalesce(userContext.clienteId, () => userContext.userId)
  if (!clienteId || !isValidUUID(clienteId)) {
    return { ok: true, data: [] }
  }

  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select('id, numero, estado, concepto, total, moneda, fecha_emision')
    .eq('cliente_id', clienteId)
    .order('fecha_emision', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error consultando facturas: ${error.message}`)
  return { ok: true, data: _nullishCoalesce(data, () => []) }
}

export async function getClientOrders(userContext, limit) {
  const clienteId = _nullishCoalesce(userContext.clienteId, () => userContext.userId)
  if (!clienteId || !isValidUUID(clienteId)) {
    return { ok: true, data: [] }
  }

  const { data, error } = await supabaseAdmin
    .from('pagos')
    .select('id, estado, monto, moneda, plan_nombre, created_at')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error consultando pagos: ${error.message}`)
  return { ok: true, data: _nullishCoalesce(data, () => []) }
}

export async function createTicketRecord(input) {
  const ticketId = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const { error } = await supabaseAdmin.from('leads').insert({
    email: _nullishCoalesce(input.contactEmail, () => null),
    lead_type: 'chat',
    message: `[${ticketId}] ${_nullishCoalesce(input.projectType, () => 'solicitud sin tipo')} — registrado vía asistente IA`,
  })

  if (error) {
    console.error('[aiTool][createTicket] Error persistiendo lead:', error)
    throw new Error(`Error persistiendo la solicitud: ${error.message}`)
  }

  return {
    ticketId,
    contactEmail: _nullishCoalesce(input.contactEmail, () => null),
    projectType: _nullishCoalesce(input.projectType, () => null),
    ok: true,
  }
}
