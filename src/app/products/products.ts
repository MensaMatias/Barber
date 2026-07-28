import { Component, inject,ChangeDetectorRef } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Cart} from "../services/cart";
import {map} from "rxjs/operators"; 
import {Product} from "../models/products/product";
import {ProductService} from "../services/product.service";
import { OrderService } from '../services/order.service';
import { Auth } from '../services/auth';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-products',
  imports: [ FormsModule, AsyncPipe],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.css',
})

export class Products {
  private cart = inject(Cart);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);
  private auth = inject(Auth);
  private toastService = inject(ToastService);

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchQuery: string = '';
  selectedCategory: string = 'all';

  drawerOpen = false;

  cart$ = this.cart.cart$;
  cartCount$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.quantity, 0)));
  cartTotal$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.price * item.quantity, 0)));

  showCheckoutModal = false;

  async ngOnInit(): Promise<void> {
    try {
      this.products = await this.productService.getProducts();  
      this.filteredProducts = this.products;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'all' ||
        product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: Product): void {
    this.cart.addToCart(product);
  }

  removeFromCart(id: number): void {
    this.cart.removeFromCart(id);
  }

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  decreaseQuantity(id: number): void {
    this.cart.decreaseQuantity(id);
  }

  increaseQuantity(id: number): void {
    this.cart.increaseQuantity(id);
  }

  async checkout(): Promise<void> {
    const cartItems = await firstValueFrom(this.cart.cart$);

    if (cartItems.length === 0) {
      this.toastService.error('Your cart is empty.');
      return;
    }

    this.showCheckoutModal = true;
  }

  async confirmOrder(): Promise<void> {
    try {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser) {
        this.showCheckoutModal = false;
        this.toastService.error('You must be logged in to place an order.');
        return;
      }

      const cartItems = await firstValueFrom(this.cart.cart$);

      if (cartItems.length === 0) {
        this.showCheckoutModal = false;
        this.toastService.error('Your cart is empty.');
        return;
      }

      const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const order = {
        userEmail: currentUser.email,
        total,
        createdAt: new Date().toISOString(),
      };

      await this.orderService.createOrder(order);

      this.cart.clearCart();
      this.showCheckoutModal = false;
      this.drawerOpen = false;

      this.toastService.success(`Order placed successfully! Total: $${total}`);
    } catch (error) {
      console.error('Error placing order:', error);
      this.toastService.error('Failed to place order. Please try again.');
    }
  }
}


