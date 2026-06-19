import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment/appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  private appointmentsKey = 'appointments';

  private getAppointments(): Appointment[] {
    return JSON.parse(
      localStorage.getItem(this.appointmentsKey) || '[]'
    );
  }

  addAppointment(appointment: Appointment): void {
    const appointments = this.getAppointments();
    appointments.push(appointment);
    localStorage.setItem(
      this.appointmentsKey,
      JSON.stringify(appointments)
    );
  }

  getUserAppointments(userEmail: string): Appointment[] {
    const appointments = this.getAppointments();
    return appointments.filter(
      (appointment) => appointment.userEmail === userEmail
    );
  }

  deleteAppointment(appointmentId: number): void {
    const appointments = this.getAppointments().filter(appointment => appointment.id !== appointmentId);
    localStorage.setItem(this.appointmentsKey, JSON.stringify(appointments));
  } 

  isTimeSlotAvailable(date: string, time: string): boolean {
    const appointments = this.getAppointments();
    return !appointments.some(
      (appointment) => appointment.date === date && appointment.time === time
    );  
  }

  getAllAppointments(): Appointment[] {
  return this.getAppointments();
}
}
