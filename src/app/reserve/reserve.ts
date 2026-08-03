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
  private auth = inject(Auth);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  service = '';
  date = '';
  time = '';
  appointments: Appointment[] = [];
  today = new Date().toISOString().split('T')[0];
  availableTimes: string[] = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  unavailableTimes: string[] = [];
  isCheckingAvailability = false;
  availabilityMessage = '';
  isBooking = false;

  async reserve(): Promise<void> {
    if (this.isBooking) {
      return;
    }

    if (!this.service || !this.date || !this.time) {
      this.toast.error('Please fill in all fields');
      return;
    }

    const appointmentDateTime = new Date(`${this.date}T${this.time}`);
    const now = new Date();

    if (appointmentDateTime <= now) {
      this.toast.error('You cannot book an appointment in the past');
      return;
    }

    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      this.toast.error('You must be logged in to book an appointment');
      return;
    }

    this.isBooking = true;
    this.cdr.detectChanges();

    try {
      const appointment: Appointment = {
        id: Date.now(),
        userEmail: currentUser.email,
        date: this.date,
        time: this.time,
        service: this.service,
      };

      const available = await this.appointmentService.isTimeSlotAvailable(this.date, this.time);

      if (!available) {
        this.toast.error('This time slot is already booked');
        await this.refreshAvailability();
        return;
      }

      await this.appointmentService.addAppointment(appointment);
      this.appointments = await this.appointmentService.getUserAppointments(currentUser.email);

      this.toast.success('Appointment booked successfully');

      this.service = '';
      this.date = '';
      this.time = '';
      this.availabilityMessage = '';
      this.unavailableTimes = [];
    } finally {
      this.isBooking = false;
      this.cdr.detectChanges();
    }
  }

  async ngOnInit(): Promise<void> {
    const currentUser = this.auth.getCurrentUser();

    if (currentUser) {
      this.appointments = await this.appointmentService.getUserAppointments(currentUser.email);
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

  async onDateChange(): Promise<void> {
    this.time = '';
    this.availabilityMessage = '';
    this.unavailableTimes = [];

    if (!this.date) {
      return;
    }

    await this.refreshAvailability();
  }

  async refreshAvailability(): Promise<void> {
    if (!this.date) {
      return;
    }

    this.isCheckingAvailability = true;
    this.availabilityMessage = 'Checking availability...';

    try {
      const availableTimes = await Promise.all(
        this.availableTimes.map(async (slot) => ({
          slot,
          available: await this.appointmentService.isTimeSlotAvailable(this.date, slot),
        }))
      );

      this.unavailableTimes = availableTimes.filter((item) => !item.available).map((item) => item.slot);

      if (this.unavailableTimes.length === this.availableTimes.length) {
        this.availabilityMessage = 'No available times for this date.';
      } else if (this.unavailableTimes.length > 0) {
        this.availabilityMessage = 'Some times are already booked for this date.';
      } else {
        this.availabilityMessage = 'All times are available for this date.';
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      this.availabilityMessage = 'Unable to check availability right now.';
    } finally {
      this.isCheckingAvailability = false;
      this.cdr.detectChanges();
    }
  }
}
