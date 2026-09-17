/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AiRunRecord, AiUserContext, AiRunLimit, AI_RUN_LIMITS_DEFAULT } from './types'
import { IAiAuditRepository, DevNullAiAuditRepository } from './audit'
import { IContextProvider, EmptyContextProvider, AiContextBundle } from './context'
import { AI_PROMPT_VERSION, buildSystemPrompt } from './prompts'
import { assertWithinRunLimits, runCostEstimateUsd } from './costControl'
import { getToolDefinition } from './toolRegistry'
import { canRoleUseTool, toolAuthorizationError } from './permissions'

export interface AiRequestContext {
  userContext: AiUserContext
  conversationId: string | null
  reportSensitiveLogs?: boolean
}

export interface AiPreparedRun {
  runId: string
  userContext: AiUserContext
  conversationId: string | null
  systemPrompt: string
  contextSummary: string
  contextBundle: AiContextBundle
  limits: AiRunLimit
  usage: {
    steps: 0
    toolCalls: 0
    inputTokens: 0
    outputTokens: 0
    runsToday: number
  }
}

export interface AiServiceDeps {
  audit?: IAiAuditRepository
  context?: IContextProvider
  limits?: AiRunLimit
}

export class AiService {
  private readonly audit: IAiAuditRepository
  private readonly context: IContextProvider
  private readonly limits: AiRunLimit

  constructor(deps: AiServiceDeps = {}) {
    this.audit = deps.audit ?? new DevNullAiAuditRepository()
    this.context = deps.context ?? new EmptyContextProvider()
    this.limits = deps.limits ?? AI_RUN_LIMITS_DEFAULT
  }

  async prepareRun(request: AiRequestContext): Promise<AiPreparedRun> {
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

  async createRunRecord(
    prepared: AiPreparedRun,
    opts: { model: string; provider: string; status?: 'completed' | 'failed' | 'cancelled' }
  ): Promise<{ runId: string; createdAt: string }> {
    const record = await this.audit.createRun({
      userId: prepared.userContext.userId,
      conversationId: prepared.conversationId,
      model: opts.model,
      provider: opts.provider,
      promptVersion: AI_PROMPT_VERSION,
      status: opts.status ?? 'completed',
      latencyMs: 0,
      inputTokens: 0,
      outputTokens: 0,
      costEstimateUsd: 0,
      error: null,
      toolCallsCount: 0,
    })
    return { runId: record.id, createdAt: record.createdAt }
  }

  async completeRun(
    runId: string,
    data: {
      status?: 'completed' | 'failed' | 'cancelled'
      latencyMs?: number
      inputTokens?: number
      outputTokens?: number
      model?: string
      error?: string | null
    }
  ): Promise<void> {
    const hasCostInputs =
      data.model != null && data.inputTokens != null && data.outputTokens != null
    const patch: Partial<Omit<AiRunRecord, 'id' | 'createdAt'>> = {
      status: data.status ?? 'completed',
      error: data.error ?? null,
      toolCallsCount: 0,
    }
    if (data.latencyMs != null) patch.latencyMs = data.latencyMs
    if (data.inputTokens != null) patch.inputTokens = data.inputTokens
    if (data.outputTokens != null) patch.outputTokens = data.outputTokens
    if (hasCostInputs) {
      patch.costEstimateUsd = runCostEstimateUsd(
        data.model ?? '',
        data.inputTokens ?? 0,
        data.outputTokens ?? 0
      )
    }
    await this.audit.updateRun(runId, patch)
  }

  assertToolAuthorized(toolName: string, userContext: AiUserContext): void {
    const def = getToolDefinition(toolName)
    if (!def) throw new Error(`Herramienta desconocida: ${toolName}`)
    const isAuthenticated = userContext.userId !== null
    if (!canRoleUseTool(def, userContext.role, isAuthenticated)) {
      throw new Error(toolAuthorizationError(def))
    }
  }

  getUsageLimits(): AiRunLimit {
    return this.limits
  }
}
