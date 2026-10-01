/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { zodSchema } from 'ai'
import { AiUserContext } from '@/core/ai/types'
import { IAiAuditRepository, safeToolError } from '@/core/ai/audit'
import { AiToolInputSchemas } from '@/core/ai/schemas'
import { getToolDefinition, toolRequiresConfirmation } from '@/core/ai/toolRegistry'
import {
  getActiveServices,
  getActivePlans,
  getClientStatus,
  getClientInvoices,
  getClientOrders,
  createTicketRecord,
} from './aiToolImplementations'
import { dispatchN8nEvent } from '@/lib/server/n8n'

export interface ToolRuntime {
  userContext: AiUserContext
  audit: IAiAuditRepository
  runId: string
  conversationId: string | null
  onExecute?: (params: { toolName: string; latencyMs: number; ok: boolean }) => void
}

export type ExecutableToolMap = Record<
  string,
  {
    description: string
    inputSchema: ReturnType<typeof zodSchema>
    execute: (input: never) => Promise<unknown>
  }
>

export function buildExecutableTools(runtime: ToolRuntime): ExecutableToolMap {
  const executeWithAudit = async (toolName: string, input: Record<string, unknown>) => {
    const def = getToolDefinition(toolName)
    const started = performance.now()
    try {
      if (!def) throw new Error(`Herramienta desconocida: ${toolName}`)
      if (toolRequiresConfirmation(def)) {
        throw new Error('Esta operación requiere confirmación del usuario antes de ejecutarse.')
      }

      let output: unknown
      switch (toolName) {
        case 'getServices':
          output = await getActiveServices()
          break
        case 'getPlans':
          output = await getActivePlans()
          break
        case 'getClientStatus':
          output = await getClientStatus(runtime.userContext)
          break
        case 'getInvoices':
          output = await getClientInvoices(runtime.userContext, Number(input['limit'] ?? 10))
          break
        case 'getOrders':
          output = await getClientOrders(runtime.userContext, Number(input['limit'] ?? 10))
          break
        case 'getAvailability':
          output = { ok: true, message: 'Disponibilidad a consultar por negocio.', params: input }
          break
        case 'createReservation':
          output = { ok: true, message: 'Reserva pendiente de confirmación.', params: input }
          break
        case 'createTicket': {
          const contactEmail = input['contactEmail'] as string | null | undefined
          const projectType = input['projectType'] as string | null | undefined
          output = await createTicketRecord({
            contactEmail: contactEmail ?? null,
            projectType: projectType ?? null,
          })
          break
        }
        case 'triggerN8nAutomation': {
          const automationType =
            typeof input['automationType'] === 'string'
              ? input['automationType']
              : 'cotizacion_express'
          const clientName =
            typeof input['clientName'] === 'string' ? input['clientName'] : 'Cliente'
          const clientEmail =
            typeof input['clientEmail'] === 'string' ? input['clientEmail'] : undefined
          const details = typeof input['details'] === 'string' ? input['details'] : ''
          const ticketId = `EXE-N8N-${Date.now().toString(36).toUpperCase().slice(-5)}`

          const dispatchResult = await dispatchN8nEvent({
            event: 'automation.trigger',
            ticketId,
            name: clientName,
            email: clientEmail,
            message: `[${automationType}] ${details}`,
            metadata: {
              automationType,
              source: 'ai_assistant_tool',
              conversationId: runtime.conversationId,
            },
          })

          output = {
            ok: true,
            ticketId,
            automationType,
            clientName,
            status: 'workflow_triggered',
            dispatchedToN8n: dispatchResult.sent,
            timestamp: new Date().toISOString(),
            message: `¡Automatización n8n activada con éxito para ${clientName}! Ticket de seguimiento: [${ticketId}].`,
          }
          break
        }
        default:
          throw new Error(`Sin implementación para: ${toolName}`)
      }

      const latencyMs = Math.round(performance.now() - started)
      if (def) {
        await runtime.audit.recordToolCall({
          runId: runtime.runId,
          toolName,
          input,
          output:
            typeof output === 'object' && output !== null
              ? (output as Record<string, unknown>)
              : { value: output },
          status: 'executed',
          latencyMs,
          error: null,
          userId: runtime.userContext.userId,
          tenantId: runtime.userContext.tenantId,
        })
      }
      runtime.onExecute?.({ toolName, latencyMs, ok: true })
      return output
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - started)
      await runtime.audit.recordToolCall({
        runId: runtime.runId,
        toolName,
        input,
        output: null,
        status: 'failed',
        latencyMs,
        error: safeToolError(err),
        userId: runtime.userContext.userId,
        tenantId: runtime.userContext.tenantId,
      })
      runtime.onExecute?.({ toolName, latencyMs, ok: false })
      throw err
    }
  }

  return {
    createTicket: {
      description:
        'Registra una solicitud de cotización/contacto y devuelve un identificador EXE-CHT-XXXXX.',
      inputSchema: zodSchema(AiToolInputSchemas.createTicket),
      execute: (input: never) =>
        executeWithAudit('createTicket', input as unknown as Record<string, unknown>),
    },
    getServices: {
      description: 'Consulta el catálogo de servicios activos de ExeSistemasWEB.',
      inputSchema: zodSchema(AiToolInputSchemas.getServices),
      execute: (input: never) =>
        executeWithAudit('getServices', input as unknown as Record<string, unknown>),
    },
    getPlans: {
      description: 'Consulta los planes de mantenimiento disponibles.',
      inputSchema: zodSchema(AiToolInputSchemas.getPlans),
      execute: (input: never) =>
        executeWithAudit('getPlans', input as unknown as Record<string, unknown>),
    },
    getClientStatus: {
      description: 'Consulta el estado del cliente autenticado: suscripción, plan y tenant.',
      inputSchema: zodSchema(AiToolInputSchemas.getClientStatus),
      execute: (input: never) =>
        executeWithAudit('getClientStatus', input as unknown as Record<string, unknown>),
    },
    getInvoices: {
      description: 'Consulta las facturas del cliente autenticado.',
      inputSchema: zodSchema(AiToolInputSchemas.getInvoices),
      execute: (input: never) =>
        executeWithAudit('getInvoices', input as unknown as Record<string, unknown>),
    },
    getOrders: {
      description: 'Consulta los pagos/pedidos del cliente autenticado.',
      inputSchema: zodSchema(AiToolInputSchemas.getOrders),
      execute: (input: never) =>
        executeWithAudit('getOrders', input as unknown as Record<string, unknown>),
    },
    getAvailability: {
      description: 'Consulta disponibilidad de turnos para un negocio.',
      inputSchema: zodSchema(AiToolInputSchemas.getAvailability),
      execute: (input: never) =>
        executeWithAudit('getAvailability', input as unknown as Record<string, unknown>),
    },
    createReservation: {
      description:
        'Crea una reserva/turno en un negocio. Requiere confirmación previa del usuario.',
      inputSchema: zodSchema(AiToolInputSchemas.createReservation),
      execute: (input: never) =>
        executeWithAudit('createReservation', input as unknown as Record<string, unknown>),
    },
    triggerN8nAutomation: {
      description:
        'Dispara una automatización en tiempo real vía n8n Cloud para cotización express, auditoría o demo con el nombre del cliente.',
      inputSchema: zodSchema(AiToolInputSchemas.triggerN8nAutomation),
      execute: (input: never) =>
        executeWithAudit('triggerN8nAutomation', input as unknown as Record<string, unknown>),
    },
  }
}
