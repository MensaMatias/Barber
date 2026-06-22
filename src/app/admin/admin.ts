import { Component, inject } from '@angular/core';
import {AppointmentService} from "../services/AppointmentService";
import {Appointment} from "../models/appointment/appointment";
import { Auth } from '../services/auth';
import { User } from '../models/user/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private appointmentService = inject(AppointmentService);
  private auth = inject(Auth);
  appointments: Appointment[] = [];
  users: User[] = [];
  searchEmail: string = '';

  ngOnInit() {
    this.loadAppointments();
    this.loadUsers();
  }
  
  loadAppointments(): void {
    this.appointments = this.appointmentService.getAllAppointments();
  }

  loadUsers(): void {
    this.users = this.auth.getAllUsers();
  }

  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId);
    this.loadAppointments();
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
