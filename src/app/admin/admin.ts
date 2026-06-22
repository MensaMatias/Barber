import { Component, inject } from '@angular/core';
import {AppointmentService} from "../services/AppointmentService";
import {Appointment} from "../models/appointment/appointment";

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private appointmentService = inject(AppointmentService);
  appointments: Appointment[] = [];

  ngOnInit() {
    this.loadAppointments();
  }
  
  loadAppointments(): void {
    this.appointments = this.appointmentService.getAllAppointments();
  }
}
