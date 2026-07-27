import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../services/AppointmentService';
import { Appointment } from '../models/appointment/appointment';
import { FormsModule } from '@angular/forms';

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
  appointments: Appointment[] = [];
  searchEmail: string = '';
  
  async ngOnInit() {
    await this.loadAppointments();
  }

   async loadAppointments(): Promise<void> {
    this.appointments = await this.appointmentService.getAllAppointments();
     this.cdr.detectChanges();
  }

   async deleteAppointment(appointmentId: number): Promise<void> {
    await this.appointmentService.deleteAppointment(appointmentId);
    await this.loadAppointments();
  }

  getFilteredAppointments(): Appointment[] {
    if (!this.searchEmail) {
      return this.appointments;
    }
    return this.appointments.filter(appointment =>
      appointment.userEmail.toLowerCase().includes(this.searchEmail.toLowerCase())
    );
  }
}
