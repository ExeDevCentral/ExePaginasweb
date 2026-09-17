/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
export type AiActionLevel = 'read' | 'write' | 'high_risk'

export type AiRole = 'anonymous' | 'customer' | 'staff' | 'manager' | 'admin'

export interface AiUserContext {
  userId: string | null
  email: string | null
  role: AiRole
  clienteId: string | null
  tenantId: string | null
}

export interface AiToolDefinition {
  name: string
  description: string
  level: AiActionLevel
  requiresAuth: boolean
  minRole: AiRole
  rolesAllowed: AiRole[]
  tenantScoped: boolean
  requiresConfirmation: boolean
  timeoutMs: number
}

export type AiToolStatus = 'pending' | 'executed' | 'awaiting_confirmation' | 'rejected' | 'failed'

export interface AiToolCallRecord {
  runId: string
  toolName: string
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  status: AiToolStatus
  latencyMs: number
  error: string | null
  userId: string | null
  tenantId: string | null
  createdAt: string
}

export interface AiRunRecord {
  id: string
  userId: string | null
  conversationId: string | null
  model: string
  provider: string
  promptVersion: string
  status: 'completed' | 'failed' | 'cancelled'
  latencyMs: number | null
  inputTokens: number | null
  outputTokens: number | null
  costEstimateUsd: number | null
  error: string | null
  toolCallsCount: number
  createdAt: string
}

export interface AiRunLimit {
  maxAgentSteps: number
  maxInputTokens: number
  maxOutputTokens: number
  maxToolCallsPerRun: number
  maxRunsPerDay: number
}

export const AI_RUN_LIMITS_DEFAULT: AiRunLimit = {
  maxAgentSteps: 8,
  maxInputTokens: 8000,
  maxOutputTokens: 2000,
  maxToolCallsPerRun: 16,
  maxRunsPerDay: 120,
}

export const MODEL_COST_PER_1K_INPUT_USD: Record<string, number> = {
  'gemini-2.5-flash': 0.0005,
  'openai/gpt-4o-mini': 0.00015,
  'llama-3.3-70b-versatile': 0.00059,
}

export const MODEL_COST_PER_1K_OUTPUT_USD: Record<string, number> = {
  'gemini-2.5-flash': 0.002,
  'openai/gpt-4o-mini': 0.0006,
  'llama-3.3-70b-versatile': 0.00079,
}

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const inRate = MODEL_COST_PER_1K_INPUT_USD[model] ?? 0.0003
  const outRate = MODEL_COST_PER_1K_OUTPUT_USD[model] ?? 0.0012
  return (inputTokens / 1000) * inRate + (outputTokens / 1000) * outRate
}

export function sanitizeAiInput(value: unknown, maxDepth = 4): Record<string, unknown> {
  const seen = new WeakSet<object>()

  const clean = (node: unknown, depth: number): unknown => {
    if (depth > maxDepth) return '[truncated]'
    if (node === null || node === undefined) return null
    if (typeof node === 'string') {
      if (node.length > 500) return `${node.slice(0, 500)}…[truncated]`
      return node
    }
    if (typeof node === 'number' || typeof node === 'boolean') return node

    if (Array.isArray(node)) {
      const out: unknown[] = []
      for (let i = 0; i < node.length && i < 50; i++) {
        const el = node[i] as unknown
        if (el && typeof el === 'object' && !seen.has(el)) {
          seen.add(el)
          out.push(clean(el, depth + 1))
        } else if (el === null || typeof el !== 'object') {
          out.push(clean(el, depth + 1))
        } else {
          out.push('[circular]')
        }
      }
      return out
    }

    if (typeof node === 'object') {
      const obj = node as Record<string, unknown>
      if (seen.has(obj)) return '[circular]'
      seen.add(obj)
      const keys = Object.keys(obj).slice(0, 20)
      const out: Record<string, unknown> = {}
      for (const key of keys) {
        if (/(secret|token|password|apikey|api_key|authorization|key)/i.test(key)) continue
        out[key] = clean(obj[key], depth + 1)
      }
      return out
    }

    return String(node).slice(0, 500)
  }

  const result = clean(value, 0)
  return typeof result === 'object' && result !== null ? (result as Record<string, unknown>) : {}
}
