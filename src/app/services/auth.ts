import { Injectable } from '@angular/core';
import { User } from '../models/user/user';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserKey = 'currentUser';

  async register(user: User): Promise<void> {
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

    if (lookupError && lookupError.code !== 'PGRST116') {
      throw new Error('Unable to check the account right now.');
    }

    if (existingUser) {
      throw new Error('User already exists');
    }

    const { error } = await supabase
      .from('users')
      .insert([{ name: user.name, email: user.email, password: user.password, role: user.role ?? 'customer' }]);

    if (error) {
      throw new Error('Error registering user');
    }
  }

  async login(email: string, password: string): Promise<void> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error('Unable to log in right now.');
    }

    if (!data) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(data));
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(this.currentUserKey);
      if (!user) {
        return null;
      }

      const parsedUser = JSON.parse(user) as User;
      return parsedUser && typeof parsedUser === 'object' ? parsedUser : null;
    } catch (error) {
      console.error('Error reading current user from storage:', error);
      this.logout();
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data as User[];
  }
}
