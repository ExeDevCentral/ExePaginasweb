import { supabase } from '../lib/supabase'

export interface SubscriptionUpdateParams {
  clienteId: string
  planSlug: string
  intervalMonths?: number
}

/**
 * Service to handle subscription logic, leveraging the
 * atomic RPC defined in migration 006.
 */
export const subscriptionService = {
  /**
   * Updates a user's subscription by cancelling old ones and
   * creating a new one in a single transaction.
   */
  async updateSubscription({ clienteId, planSlug, intervalMonths }: SubscriptionUpdateParams) {
    const { data, error } = await supabase.rpc('handle_subscription_update', {
      p_cliente_id: clienteId,
      p_plan_slug: planSlug,
      p_interval_months: intervalMonths ?? null,
    })

    if (error) {
      console.error('Error updating subscription:', error.message)
      return { success: false, error }
    }

    return { success: true, data }
  },

  async getActiveSubscription(clienteId: string) {
    return supabase
      .from('suscripciones')
      .select('*, planes(*)')
      .eq('cliente_id', clienteId)
      .eq('estado', 'activa')
      .single()
  },
}
