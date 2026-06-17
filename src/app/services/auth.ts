import { Injectable } from '@angular/core';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';

  constructor() {}

  register(User: User): void {
    const users = this.getUsers();
    if (users.find(u => u.email === User.email)) {
      throw new Error('User already exists');
    }
    users.push(User);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
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
}
