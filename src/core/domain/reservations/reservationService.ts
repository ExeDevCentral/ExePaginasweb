import { hasConflict } from './conflictDetector';
import { IReservationRepository } from './reservationRepository.interface';
import { BookingRequest, ExistingReservation } from './types';

export class ReservationService {
  constructor(private reservationRepository: IReservationRepository) {}

  async createReservation(request: BookingRequest): Promise<ExistingReservation> {
    // 1. Obtener reservas existentes para ese día y empleado
    const existingReservations = await this.reservationRepository.findByEmployeeAndDate(
      request.employeeId,
      request.startTime
    );

    // 2. Validar conflictos usando nuestro Core Engine
    const conflict = hasConflict(request, existingReservations);
    
    if (conflict) {
      throw new Error('CONFLIT_DETECTED: El horario ya está ocupado.');
    }

    // 3. Guardar si todo está en orden
    return await this.reservationRepository.save({
      ...request,
      status: 'confirmed' // Por simplicidad arranca confirmada
    });
  }
}
