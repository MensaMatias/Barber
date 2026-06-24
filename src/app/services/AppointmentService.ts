import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment/appointment';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  private appointmentsKey = 'appointments';

  /*private getAppointments(): Appointment[] {
    return JSON.parse(
      localStorage.getItem(this.appointmentsKey) || '[]'
    );
  }*/

  private async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase.from('appointments').select('*');

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    return (data || []).map(a => ({
      id: a.id,
      userEmail: a.userEmail,
      date: a.date,
      time: a.time,
      service: a.service  
    }))
  }

  async addAppointment(appointment: Appointment): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .insert([{
      userEmail: appointment.userEmail,
      date: appointment.date,
      time: appointment.time,
      service: appointment.service
    }]);
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

  async getUserAppointments(userEmail: string): Promise<Appointment[]> {
    const {data, error} = await supabase.from('appointments').select('*').eq('userEmail', userEmail);

    if (error) {
      console.error('Error fetching user appointments:', error);
      return [];
    }

    return (data || []).map(a => ({
      id: a.id,
      userEmail: a.userEmail,
      date: a.date,
      time: a.time,
      service: a.service  
    }));
  }

  async deleteAppointment(appointmentId: number): Promise<void> {
    const { error } = await supabase.from('appointments').delete().eq('id', appointmentId);
    
    if (error) {
      console.error('Error deleting appointment:', error);
    }
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const { data, error } = await supabase.from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time', time);
      
    if (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
    return data.length === 0;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.getAppointments();
  }
}
