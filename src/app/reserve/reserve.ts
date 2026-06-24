import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef); 
  service: string = '';
  date: string = '';
  time: string = '';

  async reserve(): Promise<void> {
    const appointmentDateTime = new Date(
  `${this.date}T${this.time}` 
)
;

const now = new Date();

if (appointmentDateTime <= now) {

  this.toast.error(
    'You cannot book an appointment in the past'
  );

  return;
}

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

    const available =
      await this.appointmentService.isTimeSlotAvailable(
        this.date,
        this.time
      );

    if (!available) {
      this.toast.error('This time slot is already booked');
      return;
    }

    await this.appointmentService.addAppointment(appointment);

    this.appointments = await this.appointmentService.getUserAppointments(currentUser.email);

    this.toast.success('Appointment booked successfully');

    this.service = '';
    this.date = '';
    this.time = '';
  }

  appointments: Appointment[] = [];

  async ngOnInit(): Promise<void> {
  const currentUser = this.auth.getCurrentUser();

    if (currentUser) {
      this.appointments =
        await this.appointmentService.getUserAppointments(
          currentUser.email
        );
      this.cdr.detectChanges();
    }
  }

  async deleteAppointment(appointmentId: number): Promise<void> {
    await this.appointmentService.deleteAppointment(appointmentId);
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.appointments = await this.appointmentService.getUserAppointments(currentUser.email);
    }
    this.toast.success('Appointment deleted successfully');
  }

  today = new Date().toISOString().split('T')[0];

  availableTimes: string[] = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00'
];
}
