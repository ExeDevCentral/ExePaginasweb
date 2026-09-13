/**
 * Telemetría con OpenTelemetry + Tracer
 *
 * Instrumenta:
 * - Query latency
 * - API response time
 * - Error rates
 */

import { trace, context, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('exe-sistemas-web', '1.0.0')

/**
 * Decorador para tracing automático
 */
export function withTracing(name: string, fn: (span: unknown) => Promise<unknown>) {
  return async (..._args: unknown[]) => {
    const span = tracer.startSpan(name)

    try {
      return await context.with(trace.setSpan(context.active(), span), () => fn(span))
    } catch (error) {
      span.recordException(error as Error)
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
export async function withDatabaseSpan<T>(query: string, fn: () => Promise<T>): Promise<T> {
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
    span.recordException(error as Error)
    span.setStatus({ code: SpanStatusCode.ERROR })
    throw error
  } finally {
    span.end()
  }
}

/**
 * Tracing para API calls
 */
export async function withAPISpan<T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>
): Promise<T> {
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
    span.recordException(error as Error)
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
  constructor(private supabase: unknown) {}

  async getTenantWithDetails(tenantId: string) {
    return withDatabaseSpan('SELECT * FROM tenants WHERE id = ?', async () => {
      const client = this.supabase as { from: (table: string) => any }
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

  async getTenantDashboard(tenantId: string) {
    const span = tracer.startSpan('tenant.get_dashboard')

    try {
      const client = this.supabase as { from: (table: string) => any }
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
        tenant: (tenant as any).data,
        invoices: (invoices as any).data,
        tickets: (tickets as any).data,
        slaContracts: (slaContracts as any).data,
      }
    } finally {
      span.end()
    }
  }
}

/**
 * Middleware para API routes
 */
export function withRequestTracing(route: string) {
  return async (request: Request, handler: (req: Request) => Promise<Response>) => {
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
      span.recordException(error as Error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      throw error
    } finally {
      span.end()
    }
  }
}
