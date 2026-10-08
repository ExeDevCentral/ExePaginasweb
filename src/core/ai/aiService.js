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
import { AI_RUN_LIMITS_DEFAULT } from './types'
import { DevNullAiAuditRepository } from './audit'
import { EmptyContextProvider } from './context'
import { AI_PROMPT_VERSION, buildSystemPrompt } from './prompts'
import { assertWithinRunLimits, runCostEstimateUsd } from './costControl'
import { getToolDefinition } from './toolRegistry'
import { canRoleUseTool, toolAuthorizationError } from './permissions'

export class AiService {
  constructor(deps = {}) {
    this.audit = _nullishCoalesce(deps.audit, () => new DevNullAiAuditRepository())
    this.context = _nullishCoalesce(deps.context, () => new EmptyContextProvider())
    this.limits = _nullishCoalesce(deps.limits, () => AI_RUN_LIMITS_DEFAULT)
  }

  async prepareRun(request) {
    const runsToday = await this.audit.countRunsToday(request.userContext.userId)
    const usage = { steps: 0, toolCalls: 0, inputTokens: 0, outputTokens: 0, runsToday }
    assertWithinRunLimits(usage, this.limits)

    const runId = request.conversationId
      ? `run-${request.conversationId}-${Date.now()}`
      : crypto.randomUUID()
    const contextBundle = await this.context.getContext(request.userContext)
    const contextSummary = contextBundle.summary
    const systemPrompt =
      contextSummary.length > 0
        ? buildSystemPrompt({ businessContext: `CONTEXTO DEL USUARIO:\n${contextSummary}` })
        : buildSystemPrompt()

    return {
      runId,
      userContext: request.userContext,
      conversationId: request.conversationId,
      systemPrompt,
      contextSummary,
      contextBundle,
      limits: this.limits,
      usage: { ...usage, steps: 0, toolCalls: 0, inputTokens: 0, outputTokens: 0 },
    }
  }

  async createRunRecord(prepared, opts) {
    const record = await this.audit.createRun({
      userId: prepared.userContext.userId,
      conversationId: prepared.conversationId,
      model: opts.model,
      provider: opts.provider,
      promptVersion: AI_PROMPT_VERSION,
      status: _nullishCoalesce(opts.status, () => 'completed'),
      latencyMs: 0,
      inputTokens: 0,
      outputTokens: 0,
      costEstimateUsd: 0,
      error: null,
      toolCallsCount: 0,
    })
    return { runId: record.id, createdAt: record.createdAt }
  }

  async completeRun(runId, data) {
    const hasCostInputs =
      data.model != null && data.inputTokens != null && data.outputTokens != null
    const patch = {
      status: _nullishCoalesce(data.status, () => 'completed'),
      error: _nullishCoalesce(data.error, () => null),
      toolCallsCount: 0,
    }
    if (data.latencyMs != null) patch.latencyMs = data.latencyMs
    if (data.inputTokens != null) patch.inputTokens = data.inputTokens
    if (data.outputTokens != null) patch.outputTokens = data.outputTokens
    if (hasCostInputs) {
      patch.costEstimateUsd = runCostEstimateUsd(
        _nullishCoalesce(data.model, () => ''),
        _nullishCoalesce(data.inputTokens, () => 0),
        _nullishCoalesce(data.outputTokens, () => 0)
      )
    }
    await this.audit.updateRun(runId, patch)
  }

  assertToolAuthorized(toolName, userContext) {
    const def = getToolDefinition(toolName)
    if (!def) throw new Error(`Herramienta desconocida: ${toolName}`)
    const isAuthenticated = userContext.userId !== null
    if (!canRoleUseTool(def, userContext.role, isAuthenticated)) {
      throw new Error(toolAuthorizationError(def))
    }
  }

  getUsageLimits() {
    return this.limits
  }
}
