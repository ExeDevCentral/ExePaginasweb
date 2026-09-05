import {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
} from '../entities/AdminDashboard'

export function computeAdminStats(
  clientes: AdminCliente[],
  suscripciones: AdminSuscripcion[],
  pagos: AdminPago[],
  tickets: AdminTicket[]
): AdminStats {
  const totalClientes = clientes.length
  const ticketsAbiertos = tickets.filter(
    (t) => t.estado === 'abierto' || t.estado === 'en_progreso'
  ).length

  const pagosAprobados = pagos.filter((p) => p.estado === 'approved' || p.estado === 'aprobado')
  const ingresosTotalesARS = pagosAprobados
    .filter((p) => p.moneda === 'ARS')
    .reduce((sum, p) => sum + Number(p.monto), 0)
  const ingresosTotalesUSD = pagosAprobados
    .filter((p) => p.moneda === 'USD')
    .reduce((sum, p) => sum + Number(p.monto), 0)

  let planBasico = 0
  let planAvanzado = 0
  let planPremium = 0
  let sinPlan = 0

  clientes.forEach((c) => {
    const clienteSubs = suscripciones.filter((s) => s.cliente_id === c.id && s.estado === 'activa')
    if (clienteSubs.length === 0) {
      sinPlan++
    } else {
      const activeSub = clienteSubs[0]
      const slug = activeSub.plan_slug || ''
      if (slug.includes('premium')) {
        planPremium++
      } else if (slug.includes('avanzado') || slug.includes('pro')) {
        planAvanzado++
      } else {
        planBasico++
      }
    }
  })

  return {
    totalClientes,
    planBasico,
    planAvanzado,
    planPremium,
    sinPlan,
    ticketsAbiertos,
    ingresosTotalesARS,
    ingresosTotalesUSD,
  }
}
