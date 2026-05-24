import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export const config = {
  api: { bodyParser: false },
}

function buffer(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') return res.status(405).end()

  const raw = await buffer(req)
  let body
  try {
    body = JSON.parse(raw.toString())
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  console.log('[mp-webhook] received:', JSON.stringify(body, null, 2).slice(0, 500))

  const topic = req.query.topic || body.type || body.action
  const mpId = req.query.id || body.data?.id

  if (topic === 'payment' || topic === 'merchant_order' || body.action === 'payment.created' || body.action === 'payment.updated') {
    const paymentId = mpId || body.data?.id
    if (!paymentId) return res.status(200).json({ ok: true })

    try {
      const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      })
      if (!mpResp.ok) {
        console.error('[mp-webhook] Error fetching payment:', mpResp.status)
        return res.status(200).json({ ok: true })
      }

      const payment = await mpResp.json()

      if (payment.status === 'approved') {
        const email =
          payment.metadata?.email ||
          payment.payer?.email
        const monto = payment.transaction_amount
        let planNombre = payment.description || payment.metadata?.plan_title || 'Plan'
        const mpPaymentId = String(payment.id)

        let planSlug =
          payment.metadata?.plan_slug ||
          payment.metadata?.plan_id ||
          null

        if (!planSlug && payment.external_reference?.includes('|')) {
          planSlug = payment.external_reference.split('|')[0]
        }

        const PLAN_SLUGS = [
          'mantenimiento-basico',
          'mantenimiento-avanzado',
          'mantenimiento-premium',
        ]
        if (!planSlug || !PLAN_SLUGS.includes(planSlug)) {
          const lower = (planNombre || '').toLowerCase()
          if (lower.includes('premium')) planSlug = 'mantenimiento-premium'
          else if (lower.includes('avanzado')) planSlug = 'mantenimiento-avanzado'
          else if (lower.includes('basico') || lower.includes('básico')) planSlug = 'mantenimiento-basico'
        }

        if (!email) {
          console.error('[mp-webhook] No payer email')
          return res.status(200).json({ ok: true })
        }

        let { data: clientes } = await supabase
          .from('clientes')
          .select('id, nombre, email')
          .eq('email', email)
          .limit(1)

        let clienteId = clientes?.[0]?.id

        if (!clienteId) {
          const { data: newCliente } = await supabase
            .from('clientes')
            .insert({ email, nombre: payment.payer?.first_name || null })
            .select('id')
            .single()
          clienteId = newCliente?.id
        }

        if (!clienteId) {
          console.error('[mp-webhook] Could not find or create cliente')
          return res.status(200).json({ ok: true })
        }

        let planId = null
        if (planSlug) {
          const { data: planRow } = await supabase
            .from('planes')
            .select('id, nombre')
            .eq('slug', planSlug)
            .maybeSingle()
          planId = planRow?.id ?? null
          if (!planNombre && planRow?.nombre) {
            planNombre = planRow.nombre
          }
        }

        if (!planId) {
          const { data: planes } = await supabase
            .from('planes')
            .select('id, nombre')
            .ilike('nombre', `%${planNombre}%`)
            .limit(1)
          planId = planes?.[0]?.id ?? null
        }

        await supabase
          .from('suscripciones')
          .update({ estado: 'cancelada' })
          .eq('cliente_id', clienteId)
          .eq('estado', 'activa')

        await supabase.from('suscripciones').insert({
          cliente_id: clienteId,
          plan_id: planId,
          fecha_inicio: new Date().toISOString(),
          estado: 'activa',
        })

        await supabase.from('pagos').insert({
          cliente_id: clienteId,
          monto,
          moneda: payment.currency_id || 'ARS',
          estado: 'aprobado',
          mp_payment_id: mpPaymentId,
          plan_nombre: planNombre,
          plan_slug: planSlug,
        })

        console.log('[mp-webhook] suscripcion activada', { email, planSlug, clienteId })

        if (process.env.RESEND_API_KEY) {
          try {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: `✅ Pago aprobado - ${planNombre}`,
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                    <h1 style="color:#00d4ff;">¡Pago aprobado!</h1>
                    <p>Hola <strong>${payment.payer?.first_name || ''}</strong>,</p>
                    <p>Tu pago por <strong>${planNombre}</strong> fue procesado correctamente.</p>
                    <p style="font-size:24px;font-weight:bold;">$${monto} ${payment.currency_id || 'ARS'}</p>
                    <p>Ya podés acceder a todas las funcionalidades de tu plan desde tu panel.</p>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://exepaginasweb.com'}/dashboard"
                       style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#00d4ff,#ff00ff);color:#000;text-decoration:none;border-radius:12px;font-weight:bold;margin-top:16px;">
                      Ir al Dashboard
                    </a>
                  </div>
                `,
              }),
            })
          } catch (emailErr) {
            console.error('[mp-webhook] Email error:', emailErr)
          }
        }
      }
    } catch (err) {
      console.error('[mp-webhook] Error processing payment:', err)
    }
  }

  res.status(200).json({ ok: true })
}
