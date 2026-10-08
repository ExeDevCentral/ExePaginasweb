/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { sanitizeAiInput } from './types'

export class DevNullAiAuditRepository {
  async createRun(record) {
    return {
      ...record,
      id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    }
  }

  async updateRun(_runId, _patch) {
    return
  }

  async recordToolCall(record) {
    return { ...record, createdAt: new Date().toISOString() }
  }

  async countRunsToday(_userId) {
    return 0
  }
}

export function sanitizeForAuditInput(input) {
  return sanitizeAiInput(input)
}

export function safeToolError(error) {
  if (typeof error === 'string') return error.slice(0, 1000)
  if (error instanceof Error) return error.message.slice(0, 1000)
  return 'Error desconocido'
}
