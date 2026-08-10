export interface FinancialItem {
  id: string
  monto: number
  estado: string
  moneda?: string
}

export interface InvoiceSummary {
  totalPaid: number
  totalPending: number
  pendingCount: number
  paidCount: number
  currency: string
}

/**
 * Recibe un conjunto de facturas / ítems financieros y calcula un resumen de totales pagados y pendientes.
 */
export function calculateInvoiceTotals(
  items: FinancialItem[],
  defaultCurrency = 'ARS'
): InvoiceSummary {
  let totalPaid = 0
  let totalPending = 0
  let pendingCount = 0
  let paidCount = 0

  for (const item of items) {
    const isPaid =
      item.estado === 'pagada' || item.estado === 'approved' || item.estado === 'aprobado'
    const isPending =
      item.estado === 'emitida' ||
      item.estado === 'vencida' ||
      item.estado === 'pendiente' ||
      item.estado === 'pending'

    if (isPaid) {
      totalPaid += Number(item.monto || 0)
      paidCount++
    } else if (isPending) {
      totalPending += Number(item.monto || 0)
      pendingCount++
    }
  }

  return {
    totalPaid,
    totalPending,
    pendingCount,
    paidCount,
    currency: items[0]?.moneda || defaultCurrency,
  }
}

/**
 * Calcula el ingreso mensual recurrente (MRR) a partir de las suscripciones activas.
 */
export function calculateTenantMRR(
  suscripciones: Array<{ estado: string; monto?: number | string }>
): number {
  return suscripciones
    .filter((s) => s.estado === 'activa' || s.estado === 'active')
    .reduce((sum, s) => sum + Number(s.monto || 0), 0)
}

/**
 * Formatea importes a moneda estándar (es-AR / en-US).
 */
export function formatCurrency(amount: number, currency = 'ARS', locale = 'es-AR'): string {
  const safeAmount = Number.isNaN(amount) ? 0 : amount
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount)
}

/**
 * Aplica cupones o porcentajes de descuento calculando el importe final de forma segura.
 */
export function calculateDiscount(amount: number, discountPercentage: number): number {
  if (amount <= 0) return 0
  if (discountPercentage <= 0) return amount
  if (discountPercentage >= 100) return 0

  const discount = (amount * discountPercentage) / 100
  return Math.max(0, amount - discount)
}

/**
 * Normaliza estados de transacciones/facturas a una etiqueta unificada.
 */
export function resolvePaymentState(
  estado: string
): 'pagada' | 'pendiente' | 'vencida' | 'cancelada' {
  const normalized = (estado || '').toLowerCase().trim()
  if (
    normalized === 'approved' ||
    normalized === 'aprobado' ||
    normalized === 'pagada' ||
    normalized === 'paid'
  ) {
    return 'pagada'
  }
  if (normalized === 'emitida' || normalized === 'pending' || normalized === 'pendiente') {
    return 'pendiente'
  }
  if (normalized === 'vencida' || normalized === 'overdue') {
    return 'vencida'
  }
  return 'cancelada'
}
