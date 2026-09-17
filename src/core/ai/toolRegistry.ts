/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AiToolDefinition } from './types'

export const AI_TOOL_REGISTRY: Record<string, AiToolDefinition> = {
  createTicket: {
    name: 'createTicket',
    description:
      'Registra una solicitud de cotización/contacto y devuelve un identificador EXE-CHT-XXXXX.',
    level: 'write',
    requiresAuth: false,
    minRole: 'anonymous',
    rolesAllowed: [],
    tenantScoped: false,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  getServices: {
    name: 'getServices',
    description: 'Consulta el catálogo de servicios activos de ExeSistemasWEB.',
    level: 'read',
    requiresAuth: false,
    minRole: 'anonymous',
    rolesAllowed: [],
    tenantScoped: false,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  getPlans: {
    name: 'getPlans',
    description: 'Consulta los planes de mantenimiento disponibles en la tienda.',
    level: 'read',
    requiresAuth: false,
    minRole: 'anonymous',
    rolesAllowed: [],
    tenantScoped: false,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  getClientStatus: {
    name: 'getClientStatus',
    description: 'Consulta el estado del cliente autenticado: suscripción, plan y tenant activo.',
    level: 'read',
    requiresAuth: true,
    minRole: 'customer',
    rolesAllowed: [],
    tenantScoped: false,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  getInvoices: {
    name: 'getInvoices',
    description: 'Consulta las facturas del cliente autenticado.',
    level: 'read',
    requiresAuth: true,
    minRole: 'customer',
    rolesAllowed: [],
    tenantScoped: true,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  getOrders: {
    name: 'getOrders',
    description: 'Consulta los pagos/pedidos del cliente autenticado.',
    level: 'read',
    requiresAuth: true,
    minRole: 'customer',
    rolesAllowed: [],
    tenantScoped: true,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  getAvailability: {
    name: 'getAvailability',
    description: 'Consulta disponibilidad de turnos para un negocio en una fecha.',
    level: 'read',
    requiresAuth: false,
    minRole: 'anonymous',
    rolesAllowed: [],
    tenantScoped: false,
    requiresConfirmation: false,
    timeoutMs: 10_000,
  },
  createReservation: {
    name: 'createReservation',
    description:
      'Crea una reserva/turno en un negocio de ExeSistemasWEB. Requiere confirmación del usuario.',
    level: 'write',
    requiresAuth: false,
    minRole: 'customer',
    rolesAllowed: ['customer', 'staff', 'manager', 'admin'],
    tenantScoped: true,
    requiresConfirmation: true,
    timeoutMs: 15_000,
  },
}

export function getToolDefinition(name: string): AiToolDefinition | null {
  return AI_TOOL_REGISTRY[name] ?? null
}

export function toolRequiresConfirmation(def: AiToolDefinition): boolean {
  return def.requiresConfirmation || def.level === 'high_risk'
}

export function toolRequiresAuth(def: AiToolDefinition): boolean {
  return def.requiresAuth || def.level === 'high_risk'
}
