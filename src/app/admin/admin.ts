  import { Component, inject, ChangeDetectorRef } from '@angular/core';
  import {AppointmentService} from "../services/AppointmentService";
  import {Appointment} from "../models/appointment/appointment";
  import { Auth } from '../services/auth';
  import { User } from '../models/user/user';
  import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-admin',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './admin.html',
    styleUrl: './admin.css',
  })
  export class Admin {
    private appointmentService = inject(AppointmentService);
    private auth = inject(Auth);
    // la vista no se actualiza automáticamente, no encontre la solucion
    private cdr = inject(ChangeDetectorRef);

    appointments: Appointment[] = [];
    users: User[] = [];
    searchEmail: string = '';

    async ngOnInit() {
      this.loadAppointments();
      await this.loadUsers();
    }
    
    loadAppointments(): void {
      this.appointments = this.appointmentService.getAllAppointments();
    }

    async loadUsers(): Promise<void> {
      this.users = await this.auth.getAllUsers();
      this.cdr.detectChanges();
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
