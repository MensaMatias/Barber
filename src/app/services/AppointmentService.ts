import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment/appointment';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  
  private isExpiredAppointment(date: string, time: string): boolean {
    const appointmentDateTime = new Date(`${date}T${time}`);

    if (Number.isNaN(appointmentDateTime.getTime())) {
      return false;
    }

    return appointmentDateTime < new Date();
  }

  private async purgeExpiredAppointments(): Promise<void> {
    const { data, error } = await supabase.from('appointments').select('id, date, time');

    if (error) {
      console.error('Error fetching appointments for cleanup:', error);
      return;
    }

    const expiredAppointmentIds = (data || [])
      .filter(appointment => this.isExpiredAppointment(appointment.date, appointment.time))
      .map(appointment => appointment.id);

    if (expiredAppointmentIds.length === 0) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .in('id', expiredAppointmentIds);

    if (deleteError) {
      console.error('Error deleting expired appointments:', deleteError);
    }
  }

  private async getAppointments(): Promise<Appointment[]> {
    await this.purgeExpiredAppointments();

    const { data, error } = await supabase.from('appointments').select('*');

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    } 

    return this.mapAppointments(data || []);
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
    await this.purgeExpiredAppointments();

    const {data, error} = await supabase.from('appointments').select('*').eq('userEmail', userEmail);

    if (error) {
      console.error('Error fetching user appointments:', error);
      return [];
    }

    return this.mapAppointments(data || []);
  }

  async deleteAppointment(appointmentId: number): Promise<void> {
    const { error } = await supabase.from('appointments').delete().eq('id', appointmentId);
    
    if (error) {
      console.error('Error deleting appointment:', error);
    }
  }

  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    await this.purgeExpiredAppointments();

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

  private mapAppointments(data: any[]): Appointment[] {
  return data.map(a => ({
    id: a.id,
    userEmail: a.userEmail,
    date: a.date,
    time: a.time,
    service: a.service
  }));
}
}
