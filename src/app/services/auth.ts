import { Injectable } from '@angular/core';
import { User } from '../models/user/user';
import { ToastService } from './toast.service';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserKey = 'currentUser';
  

  constructor(private toastService: ToastService) {
  }

  async register(user: User): Promise<void> {
      const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
      
    if (existingUser) {
      throw new Error('User already exists');
    }

    const { error } = await supabase
      .from('users')
      .insert([{name: user.name, email: user.email, password: user.password, role: user.role ?? 'customer'}]);

    if (error) {
      throw new Error('Error registering user');
    } else {
      this.toastService.success('User registered successfully');
    }
  }

  async login(email: string, password: string): Promise<void> {
   const { data:user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
      
    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
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

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data as User[];
  }
}
