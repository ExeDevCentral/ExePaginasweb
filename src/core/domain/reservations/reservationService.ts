/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { hasConflict } from './conflictDetector'
import { IReservationRepository } from './reservationRepository.interface'
import { BookingRequest, ExistingReservation } from './types'

export class ReservationService {
  constructor(private reservationRepository: IReservationRepository) {}

  async createReservation(request: BookingRequest): Promise<ExistingReservation> {
    // Pre-check rápido para dar un error de dominio antes de intentar la operación atómica.
    const existingReservations = await this.reservationRepository.findByEmployeeAndDate(
      request.employeeId,
      request.startTime
    )

    if (hasConflict(request, existingReservations)) {
      throw new Error('CONFLICT_DETECTED: El horario ya está ocupado.')
    }

    // El repositorio vuelve a comprobar y guarda atómicamente para cerrar la ventana de carrera.
    return this.reservationRepository.createIfAvailable({
      ...request,
      status: 'confirmed',
    })
  }
}
