function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

export class InMemoryClientePagoRepository {
  constructor() {
    InMemoryClientePagoRepository.prototype.__init.call(this)
  }
  __init() {
    this.pagos = new Map()
  }

  seed(byCliente) {
    Object.entries(byCliente).forEach(([clienteId, pagos]) => this.pagos.set(clienteId, pagos))
  }

  async listByClienteId(clienteId, limit = 10) {
    const list = _nullishCoalesce(this.pagos.get(clienteId), () => [])
    return list.slice(0, limit)
  }
}
