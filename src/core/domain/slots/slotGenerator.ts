import { WeeklySchedule } from '../availability/types'
import { ExistingReservation } from '../reservations/types'

import { ScheduleException } from '../availability/types'
import { getEffectiveShifts } from '../availability/availabilityEngine'
import { hasConflict } from '../reservations/conflictDetector'

export interface SlotGeneratorParams {
  date: Date
  schedule: WeeklySchedule
  exceptions?: ScheduleException[]
  existingReservations: ExistingReservation[]
  serviceDurationMinutes: number
  intervalMinutes: number
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0')
  const minutes = (totalMinutes % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function generateAvailableSlots(params: SlotGeneratorParams): string[] {
  const shifts = getEffectiveShifts(params.date, params.schedule, params.exceptions || [])

  if (!shifts || shifts.length === 0) {
    return []
  }

  const availableSlots: string[] = []

  for (const shift of shifts) {
    let currentMin = parseTime(shift.startTime)
    const endMin = parseTime(shift.endTime)

    while (currentMin + params.serviceDurationMinutes <= endMin) {
      // Reconstruir Date objects para el checker de conflictos
      const slotStartTime = new Date(params.date)
      slotStartTime.setUTCHours(Math.floor(currentMin / 60), currentMin % 60, 0, 0)

      const slotEndTime = new Date(params.date)
      const endTotalMin = currentMin + params.serviceDurationMinutes
      slotEndTime.setUTCHours(Math.floor(endTotalMin / 60), endTotalMin % 60, 0, 0)

      const request = {
        employeeId: params.schedule.employeeId,
        startTime: slotStartTime,
        endTime: slotEndTime,
      }

      if (!hasConflict(request, params.existingReservations)) {
        availableSlots.push(formatTime(currentMin))
      }

      currentMin += params.intervalMinutes
    }
  }

  return availableSlots
}
