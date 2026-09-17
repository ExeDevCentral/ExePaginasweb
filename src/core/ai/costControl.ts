/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AI_RUN_LIMITS_DEFAULT, AiRunLimit, estimateCostUsd } from './types'

export class CostLimitExceededError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CostLimitExceededError'
  }
}

export class AgentStepsExceededError extends Error {
  constructor(maxSteps: number) {
    super(`Límite de pasos del agente alcanzado (${maxSteps}).`)
    this.name = 'AgentStepsExceededError'
  }
}

export class ToolCallsExceededError extends Error {
  constructor(maxCalls: number) {
    super(`Límite de herramientas alcanzado (${maxCalls}).`)
    this.name = 'ToolCallsExceededError'
  }
}

export interface AiUsageState {
  runId: string
  steps: number
  toolCalls: number
  inputTokens: number
  outputTokens: number
  runsToday: number
}

export function assertWithinRunLimits(
  state: Pick<AiUsageState, 'steps' | 'toolCalls' | 'inputTokens' | 'outputTokens' | 'runsToday'>,
  limits: AiRunLimit = AI_RUN_LIMITS_DEFAULT
): void {
  if (state.steps > limits.maxAgentSteps) {
    throw new AgentStepsExceededError(limits.maxAgentSteps)
  }
  if (state.toolCalls > limits.maxToolCallsPerRun) {
    throw new ToolCallsExceededError(limits.maxToolCallsPerRun)
  }
  if (state.inputTokens > limits.maxInputTokens) {
    throw new CostLimitExceededError('Límite de tokens de entrada alcanzado.')
  }
  if (state.outputTokens > limits.maxOutputTokens) {
    throw new CostLimitExceededError('Límite de tokens de salida alcanzado.')
  }
  if (state.runsToday >= limits.maxRunsPerDay) {
    throw new CostLimitExceededError('Límite de ejecuciones diarias alcanzado.')
  }
}

export function runCostEstimateUsd(model: string, input: number, output: number): number {
  return estimateCostUsd(model, input, output)
}
