import { BookingRequest, ExistingReservation } from './types'

export function hasConflict(
  request: BookingRequest,
  existingReservations: ExistingReservation[]
): boolean {
  if (existingReservations.length === 0) return false

  for (const existing of existingReservations) {
    if (existing.employeeId !== request.employeeId) {
      continue
    }

    if (existing.status === 'cancelled' || existing.status === 'no_show') {
      continue
    }

    const isOverlapping =
      request.startTime < existing.endTime && request.endTime > existing.startTime

    if (isOverlapping) {
      return true
    }
  }

  return false
}
