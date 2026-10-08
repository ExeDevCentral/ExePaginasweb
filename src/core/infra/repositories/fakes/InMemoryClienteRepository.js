function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

export class InMemoryClienteRepository {
  constructor() {
    InMemoryClienteRepository.prototype.__init.call(this)
  }
  __init() {
    this.clientes = new Map()
  }

  seed(clientes) {
    clientes.forEach((c) => this.clientes.set(c.id, c))
  }

  async getByAuthId(authId) {
    return _nullishCoalesce(this.clientes.get(authId), () => null)
  }

  async ensureByAuthId(authId, fallback) {
    const existing = this.clientes.get(authId)
    if (existing) return existing
    const nuevo = {
      id: authId,
      full_name: _nullishCoalesce(fallback.full_name, () => null),
      email: fallback.email,
    }
    this.clientes.set(authId, nuevo)
    return nuevo
  }
}
