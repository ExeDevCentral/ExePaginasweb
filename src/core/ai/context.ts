/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AiUserContext } from './types'

export interface AiContextBundle {
  user: {
    name: string | null
    email: string | null
    role: string
  } | null
  tenant: {
    id: string
    slug: string
    nombre: string
    plan: string | null
  } | null
  summary: string
}

export interface IContextProvider {
  getContext(userContext: AiUserContext): Promise<AiContextBundle>
}

export class EmptyContextProvider implements IContextProvider {
  async getContext(_userContext: AiUserContext): Promise<AiContextBundle> {
    return { user: null, tenant: null, summary: '' }
  }
}

export function buildContextSummary(context: AiContextBundle, maxLength = 1500): string {
  const parts: string[] = []

  if (context.user) {
    parts.push(
      `Usuario: ${context.user.name ?? 'sin nombre'} (${context.user.email ?? 'sin email'}, rol: ${context.user.role})`
    )
  }

  if (context.tenant) {
    parts.push(
      `Tenant: ${context.tenant.nombre} (slug: ${context.tenant.slug}, plan: ${context.tenant.plan ?? 'sin plan'})`
    )
  }

  const summary = parts.join('\n')
  return summary.length > maxLength ? `${summary.slice(0, maxLength)}…[truncado]` : summary
}
