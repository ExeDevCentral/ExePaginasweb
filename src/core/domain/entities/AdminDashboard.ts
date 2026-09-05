export interface AdminCliente {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  created_at: string
}

export interface AdminSuscripcion {
  id: string
  cliente_id: string
  plan_slug: string
  estado: string
  fecha_inicio: string | null
  fecha_fin: string | null
  created_at: string
}

export interface AdminPago {
  id: string
  cliente_id: string
  monto: number
  moneda: string
  estado: string
  plan_nombre: string | null
  plan_slug: string | null
  metodo_pago: string | null
  created_at: string
}

export interface AdminTicket {
  id: string
  cliente_id: string
  asunto: string
  mensaje: string
  categoria: string
  prioridad: string
  estado: string
  respuesta_resolucion?: string | null
  fecha_cierre?: string | null
  created_at: string
  updated_at: string
}

export interface AdminStats {
  totalClientes: number
  planBasico: number
  planAvanzado: number
  planPremium: number
  sinPlan: number
  ticketsAbiertos: number
  ingresosTotalesARS: number
  ingresosTotalesUSD: number
}

export interface AdminOverview {
  clientes: AdminCliente[]
  suscripciones: AdminSuscripcion[]
  pagos: AdminPago[]
  tickets: AdminTicket[]
}

export const DEFAULT_ADMIN_STATS: AdminStats = {
  totalClientes: 0,
  planBasico: 0,
  planAvanzado: 0,
  planPremium: 0,
  sinPlan: 0,
  ticketsAbiertos: 0,
  ingresosTotalesARS: 0,
  ingresosTotalesUSD: 0,
}
