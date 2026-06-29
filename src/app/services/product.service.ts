import { Injectable } from '@angular/core';
import { Product } from '../models/products/product';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    
    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
    return data as Product;
  }

  async addProduct(product: Product): Promise<void> {
    const { error } = await supabase.from('products').insert([{name: product.name, description: product.description, price: product.price, 
      imageurl: product.imageurl, badge: product.badge, category: product.category, stock: product.stock}]);

    if (error) {
      console.error('Error adding product:', error);
      throw Error('Error adding product');
    }
  }

  async updateProduct(product: Product): Promise<void> {
    const { error } = await supabase.from('products').update({
      name: product.name,
      description: product.description,
      price: product.price,
      imageurl: product.imageurl,
      badge: product.badge,
      category: product.category,
      stock: product.stock
    }).eq('id', product.id);
    
    if (error) {
      console.error('Error updating product:', error);
      throw Error('Error updating product');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw Error('Error deleting product');
    }
  }
}
