/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { ExistingReservation } from './types'

export interface IReservationRepository {
  /**
   * Obtiene las reservas de un empleado para un día específico.
   */
  findByEmployeeAndDate(employeeId: string, date: Date): Promise<ExistingReservation[]>

  /**
   * Guarda una nueva reserva.
   */
  save(reservation: Omit<ExistingReservation, 'id'>): Promise<ExistingReservation>
}
