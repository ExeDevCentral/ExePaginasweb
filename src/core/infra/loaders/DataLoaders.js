function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * DataLoader Pattern — Query Batching
 *
 * Problema: Si 100 componentes piden el mismo tenant, hace 100 queries
 * Solución: BatchLoader agrupa todas las requests en 1 query
 *
 * Basado en Facebook's dataloader
 */

export class DataLoader {
  __init() {
    this.queue = []
  }

  __init2() {
    this.processing = false
  }
  __init3() {
    this.batchSchedule = null
  }

  constructor(
    batchFn,
    options = {
      batchScheduleFn: (callback) => process.nextTick(callback),
      cache: true,
    }
  ) {
    this.batchFn = batchFn
    this.options = options
    DataLoader.prototype.__init.call(this)
    DataLoader.prototype.__init2.call(this)
    DataLoader.prototype.__init3.call(this)
  }

  async load(key) {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject })
      this.enqueue()
    })
  }

  async loadMany(keys) {
    return Promise.all(keys.map((key) => this.load(key)))
  }

  enqueue() {
    if (!this.processing) {
      this.processing = true
      this.batchSchedule = new Promise((resolve) => {
        this.options.batchScheduleFn(() => {
          this.processBatch().finally(resolve)
        })
      })
    }
  }

  async processBatch() {
    const batch = this.queue.splice(0)
    this.processing = false

    if (batch.length === 0) return

    const keys = batch.map((item) => item.key)

    try {
      const results = await this.batchFn(keys)

      results.forEach((result, i) => {
        if (result instanceof Error) {
          batch[i].reject(result)
        } else {
          batch[i].resolve(result)
        }
      })
    } catch (error) {
      batch.forEach((item) => {
        item.reject(error)
      })
    }
  }

  clear(_key) {
    // Implementar caché si es necesario
  }

  clearAll() {
    // Implementar caché si es necesario
  }
}

/**
 * Ejemplo de uso en repositorio Supabase
 */
export class TenantDataLoader {
  constructor(supabase) {
    this.supabase = supabase
    this.loader = new DataLoader(async (tenantIds) => {
      const client = this.supabase
      const { data, error } = await client.from('tenants').select('*').in('id', tenantIds)

      if (error) throw error

      // Retornar en mismo orden que las keys
      return tenantIds.map(
        (id) =>
          _optionalChain([
            data,
            'optionalAccess',
            (_) => _.find,
            'call',
            (_2) => _2((t) => t.id === id),
          ]) || new Error(`Tenant ${id} not found`)
      )
    })
  }

  load(tenantId) {
    return this.loader.load(tenantId)
  }

  loadMany(tenantIds) {
    return this.loader.loadMany(tenantIds)
  }
}

/**
 * Colección de loaders para una request
 */
export class DataLoaders {
  constructor(supabase) {
    this.supabase = supabase
    this.tenantLoader = new DataLoader(async (ids) => {
      const client = this.supabase
      const { data, error } = await client.from('tenants').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) =>
          _optionalChain([
            data,
            'optionalAccess',
            (_3) => _3.find,
            'call',
            (_4) => _4((t) => t.id === id),
          ]) || new Error(`Not found: ${id}`)
      )
    })

    this.workgroupLoader = new DataLoader(async (ids) => {
      const client = this.supabase
      const { data, error } = await client.from('workgroups').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) =>
          _optionalChain([
            data,
            'optionalAccess',
            (_5) => _5.find,
            'call',
            (_6) => _6((g) => g.id === id),
          ]) || new Error(`Not found: ${id}`)
      )
    })

    this.invoiceLoader = new DataLoader(async (ids) => {
      const client = this.supabase
      const { data, error } = await client.from('invoices').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) =>
          _optionalChain([
            data,
            'optionalAccess',
            (_7) => _7.find,
            'call',
            (_8) => _8((i) => i.id === id),
          ]) || new Error(`Not found: ${id}`)
      )
    })

    this.ticketLoader = new DataLoader(async (ids) => {
      const client = this.supabase
      const { data, error } = await client.from('tickets').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) =>
          _optionalChain([
            data,
            'optionalAccess',
            (_9) => _9.find,
            'call',
            (_10) => _10((t) => t.id === id),
          ]) || new Error(`Not found: ${id}`)
      )
    })
  }
}
