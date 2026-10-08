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
}

import { calculateDiscount } from '../financial/financialEngine'

const MONTHS_BY_INTERVAL = {
  monthly: 1,
  quarterly: 3,
  annual: 12,
}

/**
 * Calcula la próxima fecha de renovación sumando un período a la fecha dada.
 * Si el día no existe en el mes destino (ej. 31 de enero), se ajusta al último día
 * del mes. Devuelve null para servicios de un solo pago, que no se renuevan.
 */
export function computeNextRenewalDate(fecha, intervalo) {
  const monthsToAdd = MONTHS_BY_INTERVAL[intervalo]
  if (monthsToAdd === undefined) return null

  const [y, m, d] = fecha.split('-').map(Number)
  const year = y
  const month = m
  const day = d
  const targetMonthIndex = month - 1 + monthsToAdd
  const targetYear = year + Math.floor(targetMonthIndex / 12)
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12

  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate()
  const targetDay = Math.min(day, lastDayOfTargetMonth)

  return `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`
}

/**
 * Selecciona las renovaciones pendientes cuya fecha de renovación ya llegó.
 * Excluye estados en curso o finales (procesando, completada, fallida, cancelada).
 */
export function findDueRenewals(renewals, hoy) {
  return renewals.filter((r) => r.estado === 'pendiente' && r.fecha_renovacion <= hoy)
}

/**
 * Deriva el monto esperado de la próxima renovación de un servicio de tenant.
 * Devuelve null cuando el servicio no se renueva automáticamente.
 */
export function computeExpectedRenewalAmount(tenantService) {
  if (!tenantService.auto_renew) return null

  const rawDiscount = _optionalChain([
    tenantService,
    'access',
    (_) => _.metadata,
    'optionalAccess',
    (_2) => _2.discountPct,
  ])
  const discountPct =
    typeof rawDiscount === 'number' && Number.isFinite(rawDiscount) ? rawDiscount : 0

  return {
    montoEsperado: calculateDiscount(tenantService.precio_actual, discountPct),
    moneda: tenantService.moneda,
  }
}

const TERMINAL_OR_IN_FLIGHT = ['procesando', 'completada', 'fallida', 'cancelada']

function toUtcMs(dateString) {
  return new Date(dateString + 'T00:00:00Z').getTime()
}

/**
 * Decide qué hacer con una renovación dado el estado actual y la fecha de hoy.
 * - Estados finales o en curso se ignoran.
 * - Antes de la fecha de renovación se ignora.
 * - Con el primer intento se cobra; con intentos previos fallidos se reintenta.
 * - Tras agotar max_intentos (o superar la ventana de gracia) se marca como fallida.
 */
export function decideRenewalAction(renewal, hoy, graceDays = 0) {
  if (TERMINAL_OR_IN_FLIGHT.includes(renewal.estado)) {
    return { action: 'ignorar' }
  }

  if (renewal.fecha_renovacion > hoy) {
    return { action: 'ignorar' }
  }

  const maxAttemptsExceeded = renewal.intentos >= renewal.max_intentos
  const deadLineMs = toUtcMs(renewal.fecha_renovacion) + graceDays * 86400000
  const graceExceeded = graceDays > 0 && toUtcMs(hoy) > deadLineMs

  if (maxAttemptsExceeded || graceExceeded) {
    return { action: 'marcar_fallida' }
  }

  return renewal.intentos === 0 ? { action: 'cobrar' } : { action: 'reintentar' }
}
