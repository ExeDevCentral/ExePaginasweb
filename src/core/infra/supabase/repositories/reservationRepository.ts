import { IReservationRepository } from '../../../domain/reservations/reservationRepository.interface';
import { ExistingReservation } from '../../../domain/reservations/types';
import { supabase } from '../client';

export class SupabaseReservationRepository implements IReservationRepository {
  async findByEmployeeAndDate(
    employeeId: string,
    date: Date
  ): Promise<ExistingReservation[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // TODO: Implementar consulta real a Supabase
    // const { data, error } = await supabase
    //   .from('reservations')
    //   .select('*')
    //   .eq('employee_id', employeeId)
    //   .gte('start_at', startOfDay.toISOString())
    //   .lte('start_at', endOfDay.toISOString());

    console.log(`Buscando reservas para empleado ${employeeId} en fecha ${date.toISOString()}`);
    
    return [];
  }

  async save(
    reservation: Omit<ExistingReservation, 'id'>
  ): Promise<ExistingReservation> {
    // TODO: Implementar insert real en Supabase
    console.log('Guardando reserva en Supabase...', reservation);
    
    return {
      id: 'temp-uuid',
      ...reservation
    };
  }
}
