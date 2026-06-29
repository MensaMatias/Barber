import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageurl: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();

  addToCart(product: { id: number; name: string; price: number; imageurl: string }) {
    const current = this.cartItems.getValue();
    const existing = current.find(item => item.id === product.id);
    if (existing) {
      this.cartItems.next(current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      this.cartItems.next([...current, { ...product, quantity: 1 }]);
    }
    
  }

  removeFromCart(id: number) {
    this.cartItems.next(this.cartItems.getValue().filter(item => item.id !== id));
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  getTotalItems(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  decreaseQuantity(id: number): void {
    const current = this.cartItems.getValue();
    const existing = current.find(item => item.id === id);
    if (existing) {
      if (existing.quantity > 1) {
        this.cartItems.next(current.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
      } else {
        this.removeFromCart(id);
      }
    }
  }
  increaseQuantity(id: number): void {
    const current = this.cartItems.getValue();
    this.cartItems.next(
    current.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
  }
}
