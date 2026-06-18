import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/AppointmentService';
import { Auth } from '../services/auth';
import { Appointment } from '../models/appointment/appointment';
import { ToastService } from '../services/toast.service';


@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reserve.html',
  styleUrl: './reserve.css',
})
export class Reserve {
  private appointmentService = inject(AppointmentService);
  private auth = inject(Auth)
  private toast = inject(ToastService); 
  service: string = '';
  date: string = '';
  time: string = '';

  reserve() {
    if (!this.service || !this.date || !this.time) {
      this.toast.error('Please fill in all fields');
      return;
    }
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      this.toast.error('You must be logged in to book an appointment');
      return;
    }
    const appointment: Appointment = {
      id: Date.now(),
      userEmail: currentUser.email,
      date: this.date,
      time: this.time,
      service: this.service,
    };

    if (!this.appointmentService.isTimeSlotAvailable(this.date, this.time)) {
      this.toast.error('This time slot is already booked');
      return;
    }

    this.appointmentService.addAppointment(appointment);

    this.appointments = this.appointmentService.getUserAppointments(currentUser.email);

    this.toast.success('Appointment booked successfully');

    this.service = '';
    this.date = '';
    this.time = '';
  }

  appointments: Appointment[] = [];

  ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.appointments = this.appointmentService.getUserAppointments(currentUser.email);
    } 
  }

  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId);
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.appointments = this.appointmentService.getUserAppointments(currentUser.email);
    }
    this.toast.success('Appointment deleted successfully');
  }
}
