import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { User } from '../models/user/user';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  isLoading = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const users = await this.auth.getAllUsers();
      this.users = [...users].sort((a, b) => {
        if (a.role === b.role) {
          return a.name.localeCompare(b.name);
        }

        return a.role === 'admin' ? -1 : 1;
      });
    } catch (error) {
      this.errorMessage = 'Failed to load users. Please try again later.';
      console.error('Error fetching users:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
