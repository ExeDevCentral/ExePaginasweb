function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

export class EmptyContextProvider {
  async getContext(_userContext) {
    return { user: null, tenant: null, summary: '' }
  }
}

export function buildContextSummary(context, maxLength = 1500) {
  const parts = []

  if (context.user) {
    parts.push(
      `Usuario: ${_nullishCoalesce(context.user.name, () => 'sin nombre')} (${_nullishCoalesce(context.user.email, () => 'sin email')}, rol: ${context.user.role})`
    )
  }

  if (context.tenant) {
    parts.push(
      `Tenant: ${context.tenant.nombre} (slug: ${context.tenant.slug}, plan: ${_nullishCoalesce(context.tenant.plan, () => 'sin plan')})`
    )
  }

  const summary = parts.join('\n')
  return summary.length > maxLength ? `${summary.slice(0, maxLength)}…[truncado]` : summary
}
