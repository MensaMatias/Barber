import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  async testConnection(): Promise<void> {

    const { data, error } = await supabase
      .from('users')
      .select('*');

    console.log('DATA:', data);
    console.log('ERROR:', error);
  }
}