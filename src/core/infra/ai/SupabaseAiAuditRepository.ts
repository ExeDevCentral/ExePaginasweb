/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabaseAdmin } from '@/lib/supabase/admin'
import { AiRunRecord, AiToolCallRecord, sanitizeAiInput } from '@/core/ai/types'
import { IAiAuditRepository } from '@/core/ai/audit'

interface AiRunsRow {
  id: string
  user_id: string | null
  conversation_id: string | null
  model: string
  provider: string
  prompt_version: string
  status: 'completed' | 'failed' | 'cancelled'
  latency_ms: number | null
  input_tokens: number | null
  output_tokens: number | null
  cost_estimate_usd: number | null
  error: string | null
  tool_calls_count: number
  created_at: string
}

interface AiToolCallsRow {
  id: string
  run_id: string
  tool_name: string
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  status: AiToolCallRecord['status']
  latency_ms: number | null
  error: string | null
  user_id: string | null
  tenant_id: string | null
  created_at: string
}

export class SupabaseAiAuditRepository implements IAiAuditRepository {
  async createRun(record: Omit<AiRunRecord, 'id' | 'createdAt'>): Promise<AiRunRecord> {
    const { data, error } = await supabaseAdmin
      .from('ai_runs')
      .insert({
        user_id: record.userId,
        conversation_id: record.conversationId ?? null,
        model: record.model,
        provider: record.provider,
        prompt_version: record.promptVersion,
        status: record.status,
        latency_ms: record.latencyMs ?? null,
        input_tokens: record.inputTokens ?? null,
        output_tokens: record.outputTokens ?? null,
        cost_estimate_usd: record.costEstimateUsd ?? null,
        error: record.error ?? null,
        tool_calls_count: record.toolCallsCount,
      })
      .select('*')
      .single()

    if (error) throw error

    const row = data as AiRunsRow
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

  async updateRun(
    runId: string,
    patch: Partial<Omit<AiRunRecord, 'id' | 'createdAt'>>
  ): Promise<void> {
    const { error } = await supabaseAdmin
      .from('ai_runs')
      .update({
        status: patch.status,
        latency_ms: patch.latencyMs ?? null,
        input_tokens: patch.inputTokens ?? null,
        output_tokens: patch.outputTokens ?? null,
        cost_estimate_usd: patch.costEstimateUsd ?? null,
        error: patch.error ?? null,
        tool_calls_count: patch.toolCallsCount ?? 0,
      })
      .eq('id', runId)

    if (error) throw error
  }

  async recordToolCall(record: Omit<AiToolCallRecord, 'createdAt'>): Promise<AiToolCallRecord> {
    const { data, error } = await supabaseAdmin
      .from('ai_tool_calls')
      .insert({
        run_id: record.runId,
        tool_name: record.toolName,
        input: sanitizeAiInput(record.input),
        output: record.output ? sanitizeAiInput(record.output) : null,
        status: record.status,
        latency_ms: record.latencyMs ?? null,
        error: record.error ?? null,
        user_id: record.userId ?? null,
        tenant_id: record.tenantId ?? null,
      })
      .select('*')
      .single()

    if (error) throw error

    const row = data as AiToolCallsRow
    return {
      runId: row.run_id,
      toolName: row.tool_name,
      input: row.input,
      output: row.output,
      status: row.status,
      latencyMs: row.latency_ms ?? 0,
      error: row.error,
      userId: row.user_id,
      tenantId: row.tenant_id,
      createdAt: row.created_at,
    }
  }

  async countRunsToday(userId: string | null): Promise<number> {
    if (!userId) return 0
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const { count, error } = await supabaseAdmin
      .from('ai_runs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfDay.toISOString())

    if (error) throw error
    return count ?? 0
  }
}
