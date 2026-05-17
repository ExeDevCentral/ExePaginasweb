import { describe, it, expect } from 'vitest';
import { generateAvailableSlots, SlotGeneratorParams } from './slotGenerator';

describe('Slot Generator', () => {
  it('retorna array vacío si el empleado no trabaja ese día', () => {
    // Arrange
    const params: SlotGeneratorParams = {
      date: new Date('2026-06-02T10:00:00Z'), // Martes
      schedule: {
        employeeId: 'emp-1',
        businessId: 'biz-1',
        shifts: {
          1: [{ startTime: '09:00', endTime: '18:00' }] // Solo trabaja lunes
        }
      },
      existingReservations: [],
      serviceDurationMinutes: 30,
      intervalMinutes: 30
    };

    // Act
    const slots = generateAvailableSlots(params);

    // Assert
    expect(slots).toEqual([]);
  });

  it('genera slots basados en el intervalMinutes para un turno simple', () => {
    const params: SlotGeneratorParams = {
      date: new Date('2026-06-01T00:00:00Z'), // Lunes
      schedule: {
        employeeId: 'emp-1',
        businessId: 'biz-1',
        shifts: {
          1: [{ startTime: '09:00', endTime: '10:30' }] // 1.5 horas
        }
      },
      existingReservations: [],
      serviceDurationMinutes: 30,
      intervalMinutes: 30
    };

    const slots = generateAvailableSlots(params);

    expect(slots).toEqual(['09:00', '09:30', '10:00']);
  });

  it('filtra los slots que se solapan con reservas existentes', () => {
    const params: SlotGeneratorParams = {
      date: new Date('2026-06-01T00:00:00Z'),
      schedule: {
        employeeId: 'emp-1',
        businessId: 'biz-1',
        shifts: {
          1: [{ startTime: '09:00', endTime: '11:00' }] // 2 horas
        }
      },
      existingReservations: [
        {
          id: 'res-1',
          employeeId: 'emp-1',
          startTime: new Date('2026-06-01T09:30:00Z'),
          endTime: new Date('2026-06-01T10:00:00Z'), // Ocupado
          status: 'confirmed'
        }
      ],
      serviceDurationMinutes: 30,
      intervalMinutes: 30
    };

    const slots = generateAvailableSlots(params);

    // Slots base: 09:00, 09:30, 10:00, 10:30
    // Ocupado: 09:30 a 10:00
    // Disponibles esperados: 09:00, 10:00, 10:30
    expect(slots).toEqual(['09:00', '10:00', '10:30']);
  });

  it('no retorna slots si el día tiene una excepción de feriado (block)', () => {
    const params: SlotGeneratorParams = {
      date: new Date('2026-06-01T00:00:00Z'),
      schedule: {
        employeeId: 'emp-1',
        businessId: 'biz-1',
        shifts: { 1: [{ startTime: '09:00', endTime: '18:00' }] }
      },
      exceptions: [
        {
          id: 'exc-1',
          businessId: 'biz-1',
          date: '2026-06-01',
          type: 'block'
        }
      ],
      existingReservations: [],
      serviceDurationMinutes: 30,
      intervalMinutes: 30
    };

    const slots = generateAvailableSlots(params);
    expect(slots).toEqual([]);
  });
});
