import { Injectable } from '@angular/core';
import { Order } from '../models/order/order';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  async createOrder(order: Order): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .insert([
        {
          useremail: order.userEmail,
          total: order.total,
          createdat: order.createdAt,
        },
      ]);

    if (error) {
      throw error;
    }
  }
}