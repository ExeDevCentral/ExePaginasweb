import { isSupabaseAdminConfigured, supabaseAdmin } from '@/lib/supabase/admin'

type WebhookPayload = Record<string, unknown>

export async function claimWebhookEvent(
  provider: string,
  providerEventId: string,
  eventType: string,
  payload: WebhookPayload
): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Supabase admin client is not configured')
  }

  const { error } = await supabaseAdmin.from('webhook_events').insert({
    provider,
    provider_event_id: providerEventId,
    event_type: eventType,
    payload,
    raw: payload,
    status: 'processing',
    attempts: 1,
    claimed_at: new Date().toISOString(),
  })

  if (!error) return true
  if (error.code !== '23505') throw error

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from('webhook_events')
    .select('id, status, attempts, claimed_at')
    .eq('provider', provider)
    .eq('provider_event_id', providerEventId)
    .maybeSingle()

  if (lookupError) throw lookupError
  if (!existing) return false
  if (existing.status === 'processed') return false

  const claimedAt = existing.claimed_at ? Date.parse(existing.claimed_at) : 0
  const stale = !claimedAt || Date.now() - claimedAt > 5 * 60 * 1000
  if (existing.status === 'processing' && !stale) return false

  const { error: reclaimError } = await supabaseAdmin
    .from('webhook_events')
    .update({
      status: 'processing',
      attempts: Number(existing.attempts ?? 0) + 1,
      claimed_at: new Date().toISOString(),
      last_error: null,
    })
    .eq('id', existing.id)
    .eq('status', existing.status)

  if (reclaimError) throw reclaimError
  return true
}

export async function markWebhookProcessed(provider: string, providerEventId: string) {
  const { error } = await supabaseAdmin
    .from('webhook_events')
    .update({ status: 'processed', processed_at: new Date().toISOString(), last_error: null })
    .eq('provider', provider)
    .eq('provider_event_id', providerEventId)

  if (error) throw error
}

export async function markWebhookFailed(provider: string, providerEventId: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown webhook processing error'
  await supabaseAdmin
    .from('webhook_events')
    .update({ status: 'failed', last_error: message.slice(0, 1000) })
    .eq('provider', provider)
    .eq('provider_event_id', providerEventId)
}
