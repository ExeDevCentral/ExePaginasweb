/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
/**
 * Telemetría con OpenTelemetry + Tracer
 *
 * Instrumenta:
 * - Query latency
 * - API response time
 * - Error rates
 *
 * NOTE: @opentelemetry/api is not installed; this file uses a lightweight no-op shim.
 * Install @opentelemetry/api and remove the shim block below when full tracing is needed.
 */

// ─── No-op shim ──────────────────────────────────────────────────────────────
// Replace this block by importing from '@opentelemetry/api' once the package is installed.

const SpanStatusCode = { ERROR: 2 }
const _noopSpan = {
  end() {},
  recordException() {},
  setStatus() {},
  addEvent() {},
}
const tracer = {
  startSpan(_name, _opts) {
    return _noopSpan
  },
}
const context = {
  active() {
    return {}
  },
  with(_ctx, fn) {
    return fn()
  },
}
const trace = {
  getTracer(_name, _version) {
    return tracer
  },
  setSpan(_ctx, _span) {
    return _ctx
  },
}
// ─── End shim ─────────────────────────────────────────────────────────────────

/**
 * Decorador para tracing automático
 */
export function withTracing(name, fn) {
  return async (..._args) => {
    const span = tracer.startSpan(name)

    try {
      return await context.with(trace.setSpan(context.active(), span), () => fn(span))
    } catch (error) {
      span.recordException(error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      throw error
    } finally {
      span.end()
    }
  }
}

/**
 * Tracing para queries de Supabase
 */
export async function withDatabaseSpan(query, fn) {
  const span = tracer.startSpan('database.query', {
    attributes: {
      'db.system': 'postgresql',
      'db.statement': query.substring(0, 100), // Primeros 100 chars
    },
  })

  const startTime = performance.now()

  try {
    const result = await context.with(trace.setSpan(context.active(), span), () => fn())

    const duration = performance.now() - startTime
    span.addEvent('query.success', {
      'db.duration_ms': duration,
    })

    return result
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR })
    throw error
  } finally {
    span.end()
  }
}

/**
 * Tracing para API calls
 */
export async function withAPISpan(endpoint, method, fn) {
  const span = tracer.startSpan(`http.client.${method}`, {
    attributes: {
      'http.method': method,
      'http.url': endpoint,
    },
  })

  const startTime = performance.now()

  try {
    const result = await context.with(trace.setSpan(context.active(), span), () => fn())

    const duration = performance.now() - startTime
    span.addEvent('http.success', {
      'http.duration_ms': duration,
    })

    return result
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR })
    throw error
  } finally {
    span.end()
  }
}

/**
 * Uso en repositorio
 */
export class TenantRepositoryWithTracing {
  constructor(supabase) {
    this.supabase = supabase
  }

  async getTenantWithDetails(tenantId) {
    return withDatabaseSpan('SELECT * FROM tenants WHERE id = ?', async () => {
      const client = this.supabase
      const { data } = await client
        .from('tenants')
        .select(
          `
            *,
            workgroups:work_groups(
              *,
              members:work_members(*)
            ),
            services:tenant_services(*)
          `
        )
        .eq('id', tenantId)
        .single()

      return data
    })
  }

  async getTenantDashboard(tenantId) {
    const span = tracer.startSpan('tenant.get_dashboard')

    try {
      const client = this.supabase
      const [tenant, invoices, tickets, slaContracts] = await Promise.all([
        withDatabaseSpan('SELECT * FROM tenants WHERE id = ?', () =>
          client.from('tenants').select('*').eq('id', tenantId).single()
        ),

        withDatabaseSpan('SELECT * FROM invoices WHERE tenant_id = ?', () =>
          client.from('invoices').select('*').eq('tenant_id', tenantId).limit(10)
        ),

        withDatabaseSpan('SELECT * FROM tickets WHERE tenant_id = ?', () =>
          client.from('tickets').select('*').eq('tenant_id', tenantId).limit(20)
        ),

        withDatabaseSpan('SELECT * FROM sla_contracts WHERE tenant_id = ?', () =>
          client.from('sla_contracts').select('*').eq('tenant_id', tenantId)
        ),
      ])

      return {
        tenant: tenant.data,
        invoices: invoices.data,
        tickets: tickets.data,
        slaContracts: slaContracts.data,
      }
    } finally {
      span.end()
    }
  }
}

/**
 * Middleware para API routes
 */
export function withRequestTracing(route) {
  return async (request, handler) => {
    const span = tracer.startSpan(`http.server.${request.method}`, {
      attributes: {
        'http.method': request.method,
        'http.url': new URL(request.url).pathname,
        'http.route': route,
        'http.client_ip': request.headers.get('x-forwarded-for') || 'unknown',
      },
    })

    const startTime = performance.now()

    try {
      const response = await context.with(trace.setSpan(context.active(), span), () =>
        handler(request)
      )

      const duration = performance.now() - startTime
      span.addEvent('http.response', {
        'http.status_code': response.status,
        'http.duration_ms': duration,
      })

      return response
    } catch (error) {
      span.recordException(error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      throw error
    } finally {
      span.end()
    }
  }
}
