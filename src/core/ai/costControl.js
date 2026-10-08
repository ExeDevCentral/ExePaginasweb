/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AI_RUN_LIMITS_DEFAULT, estimateCostUsd } from './types'

export class CostLimitExceededError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CostLimitExceededError'
  }
}

export class AgentStepsExceededError extends Error {
  constructor(maxSteps) {
    super(`Límite de pasos del agente alcanzado (${maxSteps}).`)
    this.name = 'AgentStepsExceededError'
  }
}

export class ToolCallsExceededError extends Error {
  constructor(maxCalls) {
    super(`Límite de herramientas alcanzado (${maxCalls}).`)
    this.name = 'ToolCallsExceededError'
  }
}

export function assertWithinRunLimits(state, limits = AI_RUN_LIMITS_DEFAULT) {
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

export function runCostEstimateUsd(model, input, output) {
  return estimateCostUsd(model, input, output)
}
