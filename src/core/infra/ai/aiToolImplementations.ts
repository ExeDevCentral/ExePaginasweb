/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { isValidUUID } from '@/core/utils/uuid'
import { AiUserContext } from '@/core/ai/types'

interface ServiceRow {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  tipo: string
  precio_base: number
  moneda: string
  intervalo: string
}

interface PlanRow {
  id: string
  slug: string
  nombre: string
  precio: number
  moneda: string
}

interface ClientSubscriptionRow {
  id: string
  plan_slug: string | null
  estado: string | null
}

interface InvoiceRow {
  id: string
  numero: string
  estado: string
  concepto: string | null
  total: number
  moneda: string
  fecha_emision: string | null
}

interface PagoRow {
  id: string
  estado: string
  monto: number
  moneda: string
  plan_nombre: string | null
  created_at: string
}

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

export async function getActiveServices(): Promise<
  z.infer<(typeof AiToolOutputSchemas)['getServices']>
> {
  const { data, error } = await supabaseAdmin
    .from('service_catalog')
    .select('id, slug, nombre, descripcion, tipo, precio_base, moneda, intervalo')
    .eq('activo', true)
    .order('tipo', { ascending: true })
    .order('nombre', { ascending: true })
    .limit(50)

  if (error) throw new Error(`Error consultando servicios: ${error.message}`)
  return { ok: true, data: (data ?? []) as ServiceRow[] }
}

export async function getActivePlans(): Promise<z.infer<(typeof AiToolOutputSchemas)['getPlans']>> {
  const { data, error } = await supabaseAdmin
    .from('planes')
    .select('id, slug, nombre, precio, moneda')
    .eq('activo', true)
    .order('precio', { ascending: true })
    .limit(20)

  if (error) throw new Error(`Error consultando planes: ${error.message}`)
  return { ok: true, data: (data ?? []) as PlanRow[] }
}

export async function getClientStatus(userContext: AiUserContext) {
  const clienteId = userContext.clienteId ?? userContext.userId
  if (!clienteId || !isValidUUID(clienteId)) {
    return { ok: true as const, authenticated: false, reason: 'sin_sesion' }
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

  const cliente =
    clienteRes.status === 'fulfilled'
      ? (clienteRes.value.data as {
          id: string
          full_name: string | null
          email: string | null
        } | null)
      : null
  const sub =
    subRes.status === 'fulfilled' ? (subRes.value.data as ClientSubscriptionRow | null) : null

  return {
    ok: true as const,
    authenticated: Boolean(cliente),
    clientName: cliente?.full_name ?? null,
    clientEmail: cliente?.email ?? null,
    subscription: sub ?? null,
  }
}

export async function getClientInvoices(userContext: AiUserContext, limit: number) {
  const clienteId = userContext.clienteId ?? userContext.userId
  if (!clienteId || !isValidUUID(clienteId)) {
    return { ok: true as const, data: [] }
  }

  const { data, error } = await supabaseAdmin
    .from('invoices')
    .select('id, numero, estado, concepto, total, moneda, fecha_emision')
    .eq('cliente_id', clienteId)
    .order('fecha_emision', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error consultando facturas: ${error.message}`)
  return { ok: true as const, data: (data ?? []) as InvoiceRow[] }
}

export async function getClientOrders(userContext: AiUserContext, limit: number) {
  const clienteId = userContext.clienteId ?? userContext.userId
  if (!clienteId || !isValidUUID(clienteId)) {
    return { ok: true as const, data: [] }
  }

  const { data, error } = await supabaseAdmin
    .from('pagos')
    .select('id, estado, monto, moneda, plan_nombre, created_at')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Error consultando pagos: ${error.message}`)
  return { ok: true as const, data: (data ?? []) as PagoRow[] }
}

export async function createTicketRecord(input: {
  contactEmail?: string | null
  projectType?: string | null
}) {
  const ticketId = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const { error } = await supabaseAdmin.from('leads').insert({
    email: input.contactEmail ?? null,
    lead_type: 'chat',
    message: `[${ticketId}] ${input.projectType ?? 'solicitud sin tipo'} — registrado vía asistente IA`,
  })

  if (error) {
    console.error('[aiTool][createTicket] Error persistiendo lead:', error)
    throw new Error(`Error persistiendo la solicitud: ${error.message}`)
  }

  return {
    ticketId,
    contactEmail: input.contactEmail ?? null,
    projectType: input.projectType ?? null,
    ok: true,
  }
}
