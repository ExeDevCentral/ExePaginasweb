/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { zodSchema } from 'ai'
import { AiUserContext } from '@/core/ai/types'
import { IAiAuditRepository, safeToolError } from '@/core/ai/audit'
import { canRoleUseTool, toolAuthorizationError } from '@/core/ai/permissions'
import { AiToolInputSchemas } from '@/core/ai/schemas'
import { inspectUserMessage, sanitizeVisitorName } from '@/core/ai/securityGuard'
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
  const executedWriteTools = new Set<string>()
  const isAuthenticated = Boolean(runtime.userContext.userId)

  const executeWithAudit = async (toolName: string, input: Record<string, unknown>) => {
    const def = getToolDefinition(toolName)
    const started = performance.now()
    try {
      if (!def) throw new Error(`Herramienta desconocida: ${toolName}`)

      // 1. Verificación estricta RBAC + Autenticación Zero-Trust
      if (!canRoleUseTool(def, runtime.userContext.role, isAuthenticated)) {
        throw new Error(toolAuthorizationError(def))
      }

      // 2. Verificación de aislamiento Multi-Tenant
      if (def.tenantScoped && !runtime.userContext.tenantId) {
        throw new Error('Operación requiere un tenant activo autenticado.')
      }

      // 3. Bloqueo de operaciones de alto riesgo / confirmación manual
      if (toolRequiresConfirmation(def)) {
        throw new Error('Esta operación requiere confirmación del usuario antes de ejecutarse.')
      }

      // 4. Límite anti-abuso: máximo 1 ejecución por herramienta de escritura en cada turno
      if (def.level === 'write') {
        if (executedWriteTools.has(toolName)) {
          throw new Error(
            `Límite de seguridad alcanzado: la herramienta "${toolName}" ya fue ejecutada en este turno.`
          )
        }
        executedWriteTools.add(toolName)
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
          output = await getClientInvoices(
            runtime.userContext,
            Math.min(Math.max(Number(input['limit'] ?? 10), 1), 25)
          )
          break
        case 'getOrders':
          output = await getClientOrders(
            runtime.userContext,
            Math.min(Math.max(Number(input['limit'] ?? 10), 1), 25)
          )
          break
        case 'getAvailability':
          output = { ok: true, message: 'Disponibilidad a consultar por negocio.', params: input }
          break
        case 'createReservation':
          output = { ok: true, message: 'Reserva pendiente de confirmación.', params: input }
          break
        case 'createTicket': {
          const contactEmail =
            typeof input['contactEmail'] === 'string' ? input['contactEmail'].trim() : null
          const contactPhone =
            typeof input['contactPhone'] === 'string' ? input['contactPhone'].trim() : null
          const rawProjectType =
            typeof input['projectType'] === 'string' ? input['projectType'].trim() : null

          if (rawProjectType) {
            const check = inspectUserMessage(rawProjectType)
            if (!check.allowed) {
              throw new Error('Solicitud rechazada por el filtro de seguridad Zero-Trust.')
            }
          }

          output = await createTicketRecord({
            contactEmail: contactEmail ?? null,
            contactPhone: contactPhone ?? null,
            projectType: rawProjectType ? rawProjectType.slice(0, 120) : null,
          })
          break
        }
        case 'triggerN8nAutomation': {
          const automationType =
            typeof input['automationType'] === 'string'
              ? input['automationType']
              : 'cotizacion_express'
          const rawClientName =
            typeof input['clientName'] === 'string' ? input['clientName'] : 'Cliente'
          const clientName = sanitizeVisitorName(rawClientName) ?? 'Cliente'
          const clientEmail =
            typeof input['clientEmail'] === 'string' ? input['clientEmail'].trim() : undefined
          const clientPhone =
            typeof input['clientPhone'] === 'string' ? input['clientPhone'].trim() : undefined
          const rawDetails = typeof input['details'] === 'string' ? input['details'] : ''

          const detailsCheck = inspectUserMessage(rawDetails)
          if (!detailsCheck.allowed) {
            throw new Error('Automatización bloqueada por detección de payload no seguro.')
          }
          const details = detailsCheck.sanitizedText.slice(0, 300)
          const ticketId = `EXE-N8N-${Date.now().toString(36).toUpperCase().slice(-5)}`

          const dispatchResult = await dispatchN8nEvent({
            event: 'automation.trigger',
            ticketId,
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            message: `[${automationType}] ${details}`,
            metadata: {
              automationType,
              phone: clientPhone,
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

  const allCandidates: ExecutableToolMap = {
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

  // Filtrado de mínimo privilegio (Least Privilege):
  // Solo se exponen al modelo las herramientas autorizadas para el rol y estado de sesión actual.
  const authorizedTools: ExecutableToolMap = {}
  for (const [toolName, toolEntry] of Object.entries(allCandidates)) {
    const def = getToolDefinition(toolName)
    if (!def) continue
    if (!canRoleUseTool(def, runtime.userContext.role, isAuthenticated)) continue
    if (def.tenantScoped && !runtime.userContext.tenantId) continue
    authorizedTools[toolName] = toolEntry
  }

  return authorizedTools
}
