import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Auth } from '../services/auth';
import { User } from '../models/user/user';
import { FormsModule } from '@angular/forms';
import { ProductManagement } from '../product-management/product-management';
import { AppointmentsManagement } from '../appointments-management/appointments-management';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, ProductManagement, AppointmentsManagement],
  templateUrl: './admin.html',  
  styleUrl: './admin.css',
})

export class Admin {
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  // Proyecto sin Zone.js: necesario para refrescar la vista
  // después de cargar datos asíncronos desde Supabase.
  users: User[] = [];

  async ngOnInit() {
    await this.loadUsers(); 
  }
   
  loadUsers(): void {
    this.auth.getAllUsers().then(users => {
      this.users = users;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error fetching users:', error);
    });
  }
}
