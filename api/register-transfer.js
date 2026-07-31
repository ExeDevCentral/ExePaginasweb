import { createClient } from '@supabase/supabase-js'

let supabase = null
function getSupabase() {
  if (!supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    if (!url || !key) return null
    supabase = createClient(url, key)
  }
  return supabase
}

function setCorsHeaders(res, req) {
  const allowedOrigins = [
    process.env.VITE_SITE_URL,
    process.env.SITE_URL,
    'https://exepaginasweb.com',
    'https://www.exepaginasweb.com',
  ].filter(Boolean)
  const origin = req.headers?.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const PLAN_MONTOS_ARS = {
  'mantenimiento-basico': 25000,
  'mantenimiento-avanzado': 50000,
  'mantenimiento-premium': 150000,
}

async function getOrCreateCliente(email, fullName) {
  const db = getSupabase()
  if (!db) return null

  const { data: existentes } = await db.from('clientes').select('id').eq('email', email).limit(1)

  if (existentes?.[0]) return existentes[0].id

  let id = null
  try {
    const { data: authUser } = await db.auth.admin.listUsers()
    const match = authUser?.users?.find((u) => u.email?.toLowerCase() === email?.toLowerCase())
    id = match?.id || null
  } catch (e) {
    console.warn('[register-transfer] No se pudo buscar en auth.users:', e.message)
  }

  const { data: nuevo } = await db
    .from('clientes')
    .insert(id ? { id, email, nombre: fullName || null } : { email, nombre: fullName || null })
    .select('id')
    .single()

  return nuevo?.id
}

export default async function handler(req, res) {
  setCorsHeaders(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, fullName, planSlug, planNombre, tipoProyecto } = req.body || {}

  if (!email || !planSlug) {
    return res.status(400).json({ error: 'Faltan campos requeridos (email, planSlug).' })
  }

  const db = getSupabase()
  if (!db) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }

  try {
    const clienteId = await getOrCreateCliente(email, fullName || null)
    if (!clienteId) {
      return res.status(500).json({ error: 'No se pudo identificar al cliente.' })
    }

    const monto = PLAN_MONTOS_ARS[planSlug]
    if (!monto) {
      return res.status(400).json({ error: `Plan desconocido: ${planSlug}` })
    }

    const { data: pago, error: pagoError } = await db
      .from('pagos')
      .insert({
        cliente_id: clienteId,
        monto,
        moneda: 'ARS',
        estado: 'pendiente',
        plan_nombre: planNombre || null,
        plan_slug: planSlug,
        tipo_proyecto: tipoProyecto || 'mantenimiento',
        metodo_pago: 'transferencia',
        provider: 'transferencia',
      })
      .select('id, monto, moneda, estado, created_at')
      .single()

    if (pagoError) {
      console.error('[register-transfer] Error inserting pago:', pagoError)
      return res.status(500).json({ error: pagoError.message })
    }

    console.log(`[register-transfer] Transferencia pendiente registrada para ${email}:`, pago.id)
    return res.status(200).json({ ok: true, pagoId: pago.id })
  } catch (err) {
    console.error('[register-transfer] Error:', err)
    return res.status(500).json({ error: 'Error al registrar la transferencia.' })
  }
}
