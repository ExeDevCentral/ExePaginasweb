import { describe, it, expect } from 'vitest';
import { isEmployeeWorkingAt } from './availabilityEngine';
import { WeeklySchedule } from './types';

describe('Availability Engine', () => {
  it('retorna false si el día no está configurado en el horario (día libre)', () => {
    // Arrange
    const schedule: WeeklySchedule = {
      employeeId: 'emp-1',
      businessId: 'biz-1',
      shifts: {
        1: [{ startTime: '09:00', endTime: '18:00' }] // Trabaja solo los lunes
      }
    };
    
    // Martes 2 de Junio 2026 (DayOfWeek = 2)
    const requestedDate = new Date('2026-06-02T10:00:00Z');

    // Act
    const result = isEmployeeWorkingAt(requestedDate, schedule);

    // Assert
    expect(result).toBe(false);
  });

  it('retorna false si la hora está fuera de los turnos configurados del día', () => {
    const schedule: WeeklySchedule = {
      employeeId: 'emp-1',
      businessId: 'biz-1',
      shifts: {
        1: [{ startTime: '09:00', endTime: '18:00' }] // Lunes de 09:00 a 18:00
      }
    };
    
    // Lunes 1 de Junio 2026, 08:30Z (Antes)
    const requestedBefore = new Date('2026-06-01T08:30:00Z');
    // Lunes 1 de Junio 2026, 18:30Z (Después)
    const requestedAfter = new Date('2026-06-01T18:30:00Z');

    expect(isEmployeeWorkingAt(requestedBefore, schedule)).toBe(false);
    expect(isEmployeeWorkingAt(requestedAfter, schedule)).toBe(false);
  });

  it('retorna true si la hora está dentro de uno de los múltiples turnos del día (turno partido)', () => {
    const schedule: WeeklySchedule = {
      employeeId: 'emp-1',
      businessId: 'biz-1',
      shifts: {
        1: [
          { startTime: '09:00', endTime: '13:00' }, // Turno Mañana
          { startTime: '15:00', endTime: '19:00' }  // Turno Tarde
        ] 
      }
    };
    
    const timeMorning = new Date('2026-06-01T10:30:00Z'); // Lunes 10:30 (Adentro)
    const timeLunch = new Date('2026-06-01T14:00:00Z');   // Lunes 14:00 (Afuera)
    const timeAfternoon = new Date('2026-06-01T16:00:00Z'); // Lunes 16:00 (Adentro)
    
    expect(isEmployeeWorkingAt(timeMorning, schedule)).toBe(true);
    expect(isEmployeeWorkingAt(timeLunch, schedule)).toBe(false);
    expect(isEmployeeWorkingAt(timeAfternoon, schedule)).toBe(true);
  });

  describe('getEffectiveShifts', () => {
    it('retorna array vacío si hay una excepción de bloqueo total (Feriado)', async () => {
      const schedule: WeeklySchedule = {
        employeeId: 'emp-1',
        businessId: 'biz-1',
        shifts: { 1: [{ startTime: '09:00', endTime: '18:00' }] }
      };

      const exceptions: any[] = [
        {
          id: 'exc-1',
          businessId: 'biz-1',
          date: '2026-06-01', // Lunes
          type: 'block' // Bloqueo total del día
        }
      ];

      const date = new Date('2026-06-01T00:00:00Z');
      
      // Act
      // Usaremos un nuevo método que devolverá los turnos reales de ese día,
      // filtrando feriados o reemplazando con overrides.
      const { getEffectiveShifts } = await import('./availabilityEngine');
      const shifts = getEffectiveShifts(date, schedule, exceptions);

      // Assert
      expect(shifts).toEqual([]);
    });
  });
});
