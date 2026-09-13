/**
 * DataLoader Pattern — Query Batching
 *
 * Problema: Si 100 componentes piden el mismo tenant, hace 100 queries
 * Solución: BatchLoader agrupa todas las requests en 1 query
 *
 * Basado en Facebook's dataloader
 */

type BatchFn<K, V> = (keys: readonly K[]) => Promise<readonly (V | Error)[]>

export class DataLoader<K, V> {
  private queue: Array<{
    key: K
    resolve: (value: V) => void
    reject: (error: Error) => void
  }> = []

  private processing = false
  private batchSchedule: Promise<void> | null = null

  constructor(
    private batchFn: BatchFn<K, V>,
    private options = {
      batchScheduleFn: (callback: () => void) => process.nextTick(callback),
      cache: true,
    }
  ) {}

  async load(key: K): Promise<V> {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject })
      this.enqueue()
    })
  }

  async loadMany(keys: K[]): Promise<V[]> {
    return Promise.all(keys.map((key) => this.load(key)))
  }

  private enqueue() {
    if (!this.processing) {
      this.processing = true
      this.batchSchedule = new Promise((resolve) => {
        this.options.batchScheduleFn(() => {
          this.processBatch().finally(resolve)
        })
      })
    }
  }

  private async processBatch() {
    const batch = this.queue.splice(0)
    this.processing = false

    if (batch.length === 0) return

    const keys = batch.map((item) => item.key)

    try {
      const results = await this.batchFn(keys)

      results.forEach((result, i) => {
        if (result instanceof Error) {
          batch[i]!.reject(result)
        } else {
          batch[i]!.resolve(result)
        }
      })
    } catch (error) {
      batch.forEach((item) => {
        item.reject(error as Error)
      })
    }
  }

  clear(_key: K) {
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
  private loader: DataLoader<string, unknown>

  constructor(private supabase: unknown) {
    this.loader = new DataLoader(async (tenantIds) => {
      const client = this.supabase as { from: (table: string) => any }
      const { data, error } = await client
        .from('tenants')
        .select('*')
        .in('id', tenantIds as string[])

      if (error) throw error

      // Retornar en mismo orden que las keys
      return tenantIds.map(
        (id) => (data as any)?.find((t: any) => t.id === id) || new Error(`Tenant ${id} not found`)
      )
    })
  }

  load(tenantId: string) {
    return this.loader.load(tenantId)
  }

  loadMany(tenantIds: string[]) {
    return this.loader.loadMany(tenantIds)
  }
}

/**
 * Colección de loaders para una request
 */
export class DataLoaders {
  tenantLoader: DataLoader<string, unknown>
  workgroupLoader: DataLoader<string, unknown>
  invoiceLoader: DataLoader<string, unknown>
  ticketLoader: DataLoader<string, unknown>

  constructor(private supabase: unknown) {
    this.tenantLoader = new DataLoader(async (ids) => {
      const client = this.supabase as { from: (table: string) => any }
      const { data, error } = await client.from('tenants').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) => (data as any)?.find((t: any) => t.id === id) || new Error(`Not found: ${id}`)
      )
    })

    this.workgroupLoader = new DataLoader(async (ids) => {
      const client = this.supabase as { from: (table: string) => any }
      const { data, error } = await client.from('workgroups').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) => (data as any)?.find((g: any) => g.id === id) || new Error(`Not found: ${id}`)
      )
    })

    this.invoiceLoader = new DataLoader(async (ids) => {
      const client = this.supabase as { from: (table: string) => any }
      const { data, error } = await client.from('invoices').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) => (data as any)?.find((i: any) => i.id === id) || new Error(`Not found: ${id}`)
      )
    })

    this.ticketLoader = new DataLoader(async (ids) => {
      const client = this.supabase as { from: (table: string) => any }
      const { data, error } = await client.from('tickets').select('*').in('id', ids)

      if (error) throw error
      return ids.map(
        (id) => (data as any)?.find((t: any) => t.id === id) || new Error(`Not found: ${id}`)
      )
    })
  }
}
