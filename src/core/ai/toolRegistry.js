function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

export const AI_TOOL_REGISTRY = {
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
    timeoutMs: 10000,
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
    timeoutMs: 10000,
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
    timeoutMs: 10000,
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
    timeoutMs: 10000,
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
    timeoutMs: 10000,
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
    timeoutMs: 10000,
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
    timeoutMs: 10000,
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
    timeoutMs: 15000,
  },
  triggerN8nAutomation: {
    name: 'triggerN8nAutomation',
    description:
      'Dispara una automatización en tiempo real vía n8n Cloud para cotización express, auditoría o demo con el nombre del cliente.',
    level: 'write',
    requiresAuth: false,
    minRole: 'anonymous',
    rolesAllowed: [],
    tenantScoped: false,
    requiresConfirmation: false,
    timeoutMs: 10000,
  },
}

export function getToolDefinition(name) {
  return _nullishCoalesce(AI_TOOL_REGISTRY[name], () => null)
}

export function toolRequiresConfirmation(def) {
  return def.requiresConfirmation || def.level === 'high_risk'
}

export function toolRequiresAuth(def) {
  return def.requiresAuth || def.level === 'high_risk'
}
