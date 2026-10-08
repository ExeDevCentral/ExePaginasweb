function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

export class InMemorySubscriptionRepository {
  constructor() {
    InMemorySubscriptionRepository.prototype.__init.call(this)
  }
  __init() {
    this.suscripciones = new Map()
  }

  seed(byCliente) {
    Object.entries(byCliente).forEach(([clienteId, subs]) =>
      this.suscripciones.set(clienteId, subs)
    )
  }

  async getByClienteId(clienteId) {
    return _nullishCoalesce(this.suscripciones.get(clienteId), () => [])
  }
}
