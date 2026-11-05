/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
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

  it('rechaza una de dos reservas simultáneas que se solapan', async () => {
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

    expect(fulfilled).toHaveLength(1)
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1)
  })

  it('permite reservas contiguas sin solapamiento', async () => {
    const first = await service.createReservation({
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T11:00:00Z'),
    })
    const next = await service.createReservation({
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T11:00:00Z'),
      endTime: new Date('2026-06-01T12:00:00Z'),
    })

    expect(first.id).not.toBe(next.id)
    expect(next.startTime.toISOString()).toBe('2026-06-01T11:00:00.000Z')
  })
})
