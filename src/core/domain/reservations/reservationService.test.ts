import { describe, it, expect, beforeEach } from 'vitest'
import { ReservationService } from './reservationService'
import { InMemoryReservationRepository } from '../../infra/memory/InMemoryReservationRepository'
import { BookingRequest } from './types'

describe('ReservationService - Concurrencia', () => {
  let repo: InMemoryReservationRepository
  let service: ReservationService

  beforeEach(() => {
    repo = new InMemoryReservationRepository()
    service = new ReservationService(repo)
  })

  it('ALERTA: Dos peticiones simultáneas pueden crear reservas duplicadas (Condición de Carrera)', async () => {
    const request1: BookingRequest = {
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T11:00:00Z'),
    }

    const request2: BookingRequest = {
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T10:00:00Z'), // Mismo horario
      endTime: new Date('2026-06-01T11:00:00Z'),
    }

    // Ejecutamos ambas en paralelo simulando dos clicks casi simultáneos en la red
    const results = await Promise.allSettled([
      service.createReservation(request1),
      service.createReservation(request2),
    ])

    const fulfilled = results.filter((r) => r.status === 'fulfilled')

    // Aquí está el problema de concurrencia:
    // Ambos métodos leyeron la base de datos vacía antes de que el otro guardara.
    // Por lo tanto, ¡ambos se guardaron con éxito!
    console.log(`Reservas creadas exitosamente en paralelo: ${fulfilled.length}`)

    // Este test pasa SI DEMUESTRA que fallamos en proteger la concurrencia (por ahora).
    expect(fulfilled.length).toBe(2)
  })
})
