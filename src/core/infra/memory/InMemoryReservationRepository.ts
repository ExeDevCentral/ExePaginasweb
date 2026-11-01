/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { IReservationRepository } from '../../domain/reservations/reservationRepository.interface'
import { hasConflict } from '../../domain/reservations/conflictDetector'
import { BookingRequest, ExistingReservation } from '../../domain/reservations/types'

export class InMemoryReservationRepository implements IReservationRepository {
  private reservations: ExistingReservation[] = []

  async findByEmployeeAndDate(employeeId: string, date: Date): Promise<ExistingReservation[]> {
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return this.reservations.filter(
      (res) =>
        res.employeeId === employeeId && res.startTime >= startOfDay && res.startTime <= endOfDay
    )
  }

  async createIfAvailable(
    reservation: Omit<ExistingReservation, 'id'>
  ): Promise<ExistingReservation> {
    const request: BookingRequest = {
      employeeId: reservation.employeeId,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    }
    const startOfDay = new Date(reservation.startTime)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(reservation.startTime)
    endOfDay.setUTCHours(23, 59, 59, 999)
    const sameDayReservations = this.reservations.filter(
      (existing) =>
        existing.employeeId === reservation.employeeId &&
        existing.startTime >= startOfDay &&
        existing.startTime <= endOfDay
    )

    if (hasConflict(request, sameDayReservations)) {
      throw new Error('CONFLICT_DETECTED: El horario ya está ocupado.')
    }

    const newReservation: ExistingReservation = {
      id: globalThis.crypto.randomUUID(),
      ...reservation,
    }
    this.reservations.push(newReservation)
    return newReservation
  }

  // Método auxiliar para tests
  async clear(): Promise<void> {
    this.reservations = []
  }
}
