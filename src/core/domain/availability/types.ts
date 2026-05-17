export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 1 = Lunes

export interface WorkShift {
  startTime: string; // formato "HH:mm" (ej. "09:00")
  endTime: string;   // formato "HH:mm" (ej. "18:00")
}

export interface WeeklySchedule {
  employeeId: string;
  businessId: string;
  shifts: Partial<Record<DayOfWeek, WorkShift[]>>; // Un empleado puede tener multiples turnos por día o ninguno
}

export type ExceptionType = 'block' | 'override';

export interface ScheduleException {
  id: string;
  employeeId?: string; // Si está vacío, aplica a todo el negocio (ej. feriado nacional)
  businessId: string;
  date: string; // "YYYY-MM-DD"
  type: ExceptionType;
  shifts?: WorkShift[]; // Si es override, define los nuevos turnos
  startTime?: string; // Si es block parcial
  endTime?: string;   // Si es block parcial
}
