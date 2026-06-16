import { IReservationRepository } from '../../domain/reservations/reservationRepository.interface'
import { ExistingReservation } from '../../domain/reservations/types'

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

  async save(reservation: Omit<ExistingReservation, 'id'>): Promise<ExistingReservation> {
    // Simular latencia de red/DB para exponer condiciones de carrera
    await new Promise((resolve) => setTimeout(resolve, 50))

    const newReservation: ExistingReservation = {
      id: Math.random().toString(36).substring(2, 9),
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
