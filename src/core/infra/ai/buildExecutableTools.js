function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
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
import { zodSchema } from 'ai'

import { safeToolError } from '@/core/ai/audit'
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

export function buildExecutableTools(runtime) {
  const executeWithAudit = async (toolName, input) => {
    const def = getToolDefinition(toolName)
    const started = performance.now()
    try {
      if (!def) throw new Error(`Herramienta desconocida: ${toolName}`)
      if (toolRequiresConfirmation(def)) {
        throw new Error('Esta operación requiere confirmación del usuario antes de ejecutarse.')
      }

      let output
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
          output = await getClientInvoices(
            runtime.userContext,
            Number(_nullishCoalesce(input['limit'], () => 10))
          )
          break
        case 'getOrders':
          output = await getClientOrders(
            runtime.userContext,
            Number(_nullishCoalesce(input['limit'], () => 10))
          )
          break
        case 'getAvailability':
          output = { ok: true, message: 'Disponibilidad a consultar por negocio.', params: input }
          break
        case 'createReservation':
          output = { ok: true, message: 'Reserva pendiente de confirmación.', params: input }
          break
        case 'createTicket': {
          const contactEmail = input['contactEmail']
          const projectType = input['projectType']
          output = await createTicketRecord({
            contactEmail: _nullishCoalesce(contactEmail, () => null),
            projectType: _nullishCoalesce(projectType, () => null),
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
          output: typeof output === 'object' && output !== null ? output : { value: output },
          status: 'executed',
          latencyMs,
          error: null,
          userId: runtime.userContext.userId,
          tenantId: runtime.userContext.tenantId,
        })
      }
      _optionalChain([
        runtime,
        'access',
        (_) => _.onExecute,
        'optionalCall',
        (_2) => _2({ toolName, latencyMs, ok: true }),
      ])
      return output
    } catch (err) {
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
      _optionalChain([
        runtime,
        'access',
        (_3) => _3.onExecute,
        'optionalCall',
        (_4) => _4({ toolName, latencyMs, ok: false }),
      ])
      throw err
    }
  }

  return {
    createTicket: {
      description:
        'Registra una solicitud de cotización/contacto y devuelve un identificador EXE-CHT-XXXXX.',
      inputSchema: zodSchema(AiToolInputSchemas.createTicket),
      execute: (input) => executeWithAudit('createTicket', input),
    },
    getServices: {
      description: 'Consulta el catálogo de servicios activos de ExeSistemasWEB.',
      inputSchema: zodSchema(AiToolInputSchemas.getServices),
      execute: (input) => executeWithAudit('getServices', input),
    },
    getPlans: {
      description: 'Consulta los planes de mantenimiento disponibles.',
      inputSchema: zodSchema(AiToolInputSchemas.getPlans),
      execute: (input) => executeWithAudit('getPlans', input),
    },
    getClientStatus: {
      description: 'Consulta el estado del cliente autenticado: suscripción, plan y tenant.',
      inputSchema: zodSchema(AiToolInputSchemas.getClientStatus),
      execute: (input) => executeWithAudit('getClientStatus', input),
    },
    getInvoices: {
      description: 'Consulta las facturas del cliente autenticado.',
      inputSchema: zodSchema(AiToolInputSchemas.getInvoices),
      execute: (input) => executeWithAudit('getInvoices', input),
    },
    getOrders: {
      description: 'Consulta los pagos/pedidos del cliente autenticado.',
      inputSchema: zodSchema(AiToolInputSchemas.getOrders),
      execute: (input) => executeWithAudit('getOrders', input),
    },
    getAvailability: {
      description: 'Consulta disponibilidad de turnos para un negocio.',
      inputSchema: zodSchema(AiToolInputSchemas.getAvailability),
      execute: (input) => executeWithAudit('getAvailability', input),
    },
    createReservation: {
      description:
        'Crea una reserva/turno en un negocio. Requiere confirmación previa del usuario.',
      inputSchema: zodSchema(AiToolInputSchemas.createReservation),
      execute: (input) => executeWithAudit('createReservation', input),
    },
    triggerN8nAutomation: {
      description:
        'Dispara una automatización en tiempo real vía n8n Cloud para cotización express, auditoría o demo con el nombre del cliente.',
      inputSchema: zodSchema(AiToolInputSchemas.triggerN8nAutomation),
      execute: (input) => executeWithAudit('triggerN8nAutomation', input),
    },
  }
}
