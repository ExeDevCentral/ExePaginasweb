/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AiRunRecord, AiToolCallRecord, sanitizeAiInput } from './types'

export interface IAiAuditRepository {
  createRun(record: Omit<AiRunRecord, 'id' | 'createdAt'>): Promise<AiRunRecord>
  updateRun(runId: string, patch: Partial<Omit<AiRunRecord, 'id' | 'createdAt'>>): Promise<void>
  recordToolCall(record: Omit<AiToolCallRecord, 'createdAt'>): Promise<AiToolCallRecord>
  countRunsToday(userId: string | null): Promise<number>
}

export class DevNullAiAuditRepository implements IAiAuditRepository {
  async createRun(record: Omit<AiRunRecord, 'id' | 'createdAt'>): Promise<AiRunRecord> {
    return {
      ...record,
      id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    }
  }

  async updateRun(
    _runId: string,
    _patch: Partial<Omit<AiRunRecord, 'id' | 'createdAt'>>
  ): Promise<void> {
    return
  }

  async recordToolCall(record: Omit<AiToolCallRecord, 'createdAt'>): Promise<AiToolCallRecord> {
    return { ...record, createdAt: new Date().toISOString() }
  }

  async countRunsToday(_userId: string | null): Promise<number> {
    return 0
  }
}

export function sanitizeForAuditInput(input: unknown): Record<string, unknown> {
  return sanitizeAiInput(input)
}

export function safeToolError(error: unknown): string {
  if (typeof error === 'string') return error.slice(0, 1000)
  if (error instanceof Error) return error.message.slice(0, 1000)
  return 'Error desconocido'
}
