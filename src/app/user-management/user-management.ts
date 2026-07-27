import { Component, ChangeDetectorRef,inject } from '@angular/core';
import { User } from '../models/user/user';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {
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
