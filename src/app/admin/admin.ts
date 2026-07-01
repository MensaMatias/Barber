import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../services/AppointmentService';
import { Appointment } from '../models/appointment/appointment';
import { Auth } from '../services/auth';
import { User } from '../models/user/user';
import { FormsModule } from '@angular/forms';
import { ProductManagement } from '../product-management/product-management';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, ProductManagement],
  templateUrl: './admin.html',  
  styleUrl: './admin.css',
})

export class Admin {
  private appointmentService = inject(AppointmentService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  // Proyecto sin Zone.js: necesario para refrescar la vista
  // después de cargar datos asíncronos desde Supabase.

  appointments: Appointment[] = [];
  users: User[] = [];
  searchEmail: string = '';

  async ngOnInit() {
    await this.loadAppointments();
    await this.loadUsers(); 
  }
    
  async loadAppointments(): Promise<void> {
    this.appointments = await this.appointmentService.getAllAppointments();
  }

  loadUsers(): void {
    this.auth.getAllUsers().then(users => {
      this.users = users;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
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
