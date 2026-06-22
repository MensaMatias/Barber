import { Injectable } from '@angular/core';
import { User } from '../models/user/user';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';

  constructor(private toastService: ToastService) {

    const users = this.getUsers();
    const adminExists = users.some(u => u.role === 'admin');

    if (!adminExists) {
      users.push({
        name: 'Admin',
        email: 'admin@barber.com',
        password: 'admin123',
        role: 'admin'
      });
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

  }

  register(user: User): boolean {
  const users = this.getUsers();

  if (users.find(u => u.email === user.email)) {
    this.toastService.error('User already exists');
    return false;
  }

  users.push(user);
  localStorage.setItem(this.usersKey, JSON.stringify(users));

  return true;
}

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user)); 
      return true;
    }
    this.toastService.error('Invalid email or password');
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey); 
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.currentUserKey) !== null;
  }
  
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }
}
