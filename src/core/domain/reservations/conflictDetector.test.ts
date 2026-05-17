import { describe, it, expect } from 'vitest';
import { hasConflict } from './conflictDetector';
import { BookingRequest, ExistingReservation } from './types';

describe('Conflict Detector Engine', () => {
  it('no hay conflicto si la agenda del empleado está vacía', () => {
    // Arrange (Preparar)
    const request: BookingRequest = {
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T11:00:00Z'),
    };

    // Act (Actuar)
    const result = hasConflict(request, []);

    // Assert (Verificar)
    expect(result).toBe(false);
  });

  it('no hay conflicto si el turno termina exactamente cuando empieza otro', () => {
    const existing: ExistingReservation[] = [
      {
        id: 'res-1',
        employeeId: 'emp-1',
        startTime: new Date('2026-06-01T11:00:00Z'),
        endTime: new Date('2026-06-01T12:00:00Z'),
        status: 'confirmed'
      }
    ];

    const request: BookingRequest = {
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T11:00:00Z'),
    };

    expect(hasConflict(request, existing)).toBe(false);
  });

  it('ignora conflictos si la reserva existe pero es de otro empleado', () => {
    const existing: ExistingReservation[] = [
      {
        id: 'res-1',
        employeeId: 'emp-DISTINTO', // Otro empleado
        startTime: new Date('2026-06-01T10:00:00Z'),
        endTime: new Date('2026-06-01T11:00:00Z'),
        status: 'confirmed'
      }
    ];

    const request: BookingRequest = {
      employeeId: 'emp-1', // Mi empleado
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T11:00:00Z'), // Mismo horario exacto
    };

    // No debería haber conflicto porque son recursos (empleados/canchas) distintos
    expect(hasConflict(request, existing)).toBe(false);
  });

  it('ignora conflictos si la reserva superpuesta está cancelada o es no_show', () => {
    const existing: ExistingReservation[] = [
      {
        id: 'res-1',
        employeeId: 'emp-1',
        startTime: new Date('2026-06-01T10:00:00Z'),
        endTime: new Date('2026-06-01T11:00:00Z'),
        status: 'cancelled'
      },
      {
        id: 'res-2',
        employeeId: 'emp-1',
        startTime: new Date('2026-06-01T10:30:00Z'),
        endTime: new Date('2026-06-01T11:30:00Z'),
        status: 'no_show'
      }
    ];

    const request: BookingRequest = {
      employeeId: 'emp-1',
      startTime: new Date('2026-06-01T10:00:00Z'),
      endTime: new Date('2026-06-01T12:00:00Z'), // Se solapa con ambas
    };

    expect(hasConflict(request, existing)).toBe(false);
  });
});
