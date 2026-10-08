export class InMemoryReservationRepository {
  constructor() {
    InMemoryReservationRepository.prototype.__init.call(this)
  }
  __init() {
    this.reservations = []
  }

  async findByEmployeeAndDate(employeeId, date) {
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return this.reservations.filter(
      (res) =>
        res.employeeId === employeeId && res.startTime >= startOfDay && res.startTime <= endOfDay
    )
  }

  async save(reservation) {
    // Simular latencia de red/DB para exponer condiciones de carrera
    await new Promise((resolve) => setTimeout(resolve, 50))

    const newReservation = {
      id: Math.random().toString(36).substring(2, 9),
      ...reservation,
    }

    this.reservations.push(newReservation)
    return newReservation
  }

  // Método auxiliar para tests
  async clear() {
    this.reservations = []
  }
}
