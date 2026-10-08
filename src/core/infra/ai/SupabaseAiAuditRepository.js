function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sanitizeAiInput } from '@/core/ai/types'

export class SupabaseAiAuditRepository {
  async createRun(record) {
    const { data, error } = await supabaseAdmin
      .from('ai_runs')
      .insert({
        user_id: record.userId,
        conversation_id: _nullishCoalesce(record.conversationId, () => null),
        model: record.model,
        provider: record.provider,
        prompt_version: record.promptVersion,
        status: record.status,
        latency_ms: _nullishCoalesce(record.latencyMs, () => null),
        input_tokens: _nullishCoalesce(record.inputTokens, () => null),
        output_tokens: _nullishCoalesce(record.outputTokens, () => null),
        cost_estimate_usd: _nullishCoalesce(record.costEstimateUsd, () => null),
        error: _nullishCoalesce(record.error, () => null),
        tool_calls_count: record.toolCallsCount,
      })
      .select('*')
      .single()

    if (error) throw error

    const row = data
    return {
      id: row.id,
      userId: row.user_id,
      conversationId: row.conversation_id,
      model: row.model,
      provider: row.provider,
      promptVersion: row.prompt_version,
      status: row.status,
      latencyMs: row.latency_ms,
      inputTokens: row.input_tokens,
      outputTokens: row.output_tokens,
      costEstimateUsd: row.cost_estimate_usd,
      error: row.error,
      toolCallsCount: row.tool_calls_count,
      createdAt: row.created_at,
    }
  }

  async updateRun(runId, patch) {
    const { error } = await supabaseAdmin
      .from('ai_runs')
      .update({
        status: patch.status,
        latency_ms: _nullishCoalesce(patch.latencyMs, () => null),
        input_tokens: _nullishCoalesce(patch.inputTokens, () => null),
        output_tokens: _nullishCoalesce(patch.outputTokens, () => null),
        cost_estimate_usd: _nullishCoalesce(patch.costEstimateUsd, () => null),
        error: _nullishCoalesce(patch.error, () => null),
        tool_calls_count: _nullishCoalesce(patch.toolCallsCount, () => 0),
      })
      .eq('id', runId)

    if (error) throw error
  }

  async recordToolCall(record) {
    const { data, error } = await supabaseAdmin
      .from('ai_tool_calls')
      .insert({
        run_id: record.runId,
        tool_name: record.toolName,
        input: sanitizeAiInput(record.input),
        output: record.output ? sanitizeAiInput(record.output) : null,
        status: record.status,
        latency_ms: _nullishCoalesce(record.latencyMs, () => null),
        error: _nullishCoalesce(record.error, () => null),
        user_id: _nullishCoalesce(record.userId, () => null),
        tenant_id: _nullishCoalesce(record.tenantId, () => null),
      })
      .select('*')
      .single()

    if (error) throw error

    const row = data
    return {
      runId: row.run_id,
      toolName: row.tool_name,
      input: row.input,
      output: row.output,
      status: row.status,
      latencyMs: _nullishCoalesce(row.latency_ms, () => 0),
      error: row.error,
      userId: row.user_id,
      tenantId: row.tenant_id,
      createdAt: row.created_at,
    }
  }

  async countRunsToday(userId) {
    if (!userId) return 0
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const { count, error } = await supabaseAdmin
      .from('ai_runs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfDay.toISOString())

    if (error) throw error
    return _nullishCoalesce(count, () => 0)
  }
}
