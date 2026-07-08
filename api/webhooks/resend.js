import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'svix'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export const config = { api: { bodyParser: false } }

function buffer(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const secret = process.env.RESEND_WEBHOOK_SIGNING_SECRET
  if (!secret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SIGNING_SECRET not set')
    res.status(500).json({ error: 'Server not configured' })
    return
  }

  const payload = await buffer(req)
  const headers = {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature'],
  }

  if (!headers['svix-id'] || !headers['svix-timestamp'] || !headers['svix-signature']) {
    console.error('[resend-webhook] missing svix headers')
    res.status(400).json({ error: 'Missing webhook signature headers' })
    return
  }

  let event
  try {
    const wh = new Webhook(secret)
    event = wh.verify(payload.toString(), headers)
  } catch (err) {
    console.error('[resend-webhook] signature verification failed:', err.message)
    res.status(400).json({ error: 'Invalid signature' })
    return
  }

  const eventType = event.type || 'unknown'
  console.log(`[resend-webhook] received: ${eventType}`, JSON.stringify(event.data))

  try {
    await supabase.from('webhook_events').insert({
      event_type: eventType,
      provider: 'resend',
      payload: event.data,
      raw: event,
    })
  } catch (dbErr) {
    console.error('[resend-webhook] failed to save event:', dbErr.message)
  }

  res.status(200).json({ received: true })
}
