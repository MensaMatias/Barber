import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../services/AppointmentService';
import { Appointment } from '../models/appointment/appointment';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-appointments-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './appointments-management.html',
  styleUrl: './appointments-management.css',
})
export class AppointmentsManagement {
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  appointments: Appointment[] = [];
  searchEmail = '';

  async ngOnInit(): Promise<void> {
    await this.loadAppointments();
  }

  async loadAppointments(): Promise<void> {
    try {
      this.appointments = await this.appointmentService.getAllAppointments();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading appointments:', error);
      this.toastService.error('Unable to load appointments right now.');
    }
  }

  async deleteAppointment(appointmentId: number): Promise<void> {
    try {
      await this.appointmentService.deleteAppointment(appointmentId);
      await this.loadAppointments();
      this.toastService.success('Appointment deleted successfully.');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      this.toastService.error('Unable to delete the appointment.');
    }
  }

  getFilteredAppointments(): Appointment[] {
    const search = this.searchEmail.trim().toLowerCase();

    if (!search) {
      return this.appointments;
    }

    return this.appointments.filter((appointment) =>
      appointment.userEmail.toLowerCase().includes(search)
    );
  }
}
