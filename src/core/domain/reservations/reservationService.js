/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { hasConflict } from './conflictDetector'

export class ReservationService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository
  }

  async createReservation(request) {
    // 1. Obtener reservas existentes para ese día y empleado
    const existingReservations = await this.reservationRepository.findByEmployeeAndDate(
      request.employeeId,
      request.startTime
    )

    // 2. Validar conflictos usando nuestro Core Engine
    const conflict = hasConflict(request, existingReservations)

    if (conflict) {
      throw new Error('CONFLIT_DETECTED: El horario ya está ocupado.')
    }

    // 3. Guardar si todo está en orden
    return await this.reservationRepository.save({
      ...request,
      status: 'confirmed', // Por simplicidad arranca confirmada
    })
  }
}
