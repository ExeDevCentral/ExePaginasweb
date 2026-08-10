export interface TimeBlock {
  startTime: Date
  endTime: Date
}

export interface ExistingReservation extends TimeBlock {
  id: string
  employeeId: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
}

export interface BookingRequest extends TimeBlock {
  employeeId: string
}
