import { DayOfWeek, WeeklySchedule, ScheduleException, WorkShift } from './types'

export function getEffectiveShifts(
  requestedDate: Date,
  schedule: WeeklySchedule,
  exceptions: ScheduleException[] = []
): WorkShift[] {
  const dateString = requestedDate.toISOString().split('T')[0]
  const dayOfWeek = requestedDate.getUTCDay() as DayOfWeek

  for (const exc of exceptions) {
    if (exc.date === dateString) {
      if (exc.type === 'block' && !exc.startTime && !exc.endTime) {
        return [] // Feriado / Día libre completo
      }
      if (exc.type === 'override' && exc.shifts) {
        return exc.shifts
      }
    }
  }

  return schedule.shifts[dayOfWeek] || []
}

export function isEmployeeWorkingAt(
  requestedDate: Date,
  schedule: WeeklySchedule,
  exceptions: ScheduleException[] = []
): boolean {
  const shifts = getEffectiveShifts(requestedDate, schedule, exceptions)

  if (shifts.length === 0) {
    return false
  }

  const hours = requestedDate.getUTCHours().toString().padStart(2, '0')
  const minutes = requestedDate.getUTCMinutes().toString().padStart(2, '0')
  const requestedTime = `${hours}:${minutes}`

  for (const shift of shifts) {
    if (requestedTime >= shift.startTime && requestedTime <= shift.endTime) {
      return true
    }
  }

  return false
}
