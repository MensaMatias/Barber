import { Component, inject } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Cart} from "../services/cart";
import {map} from "rxjs/operators"; 
import {Product} from "../models/products/product";
import {ProductService} from "../services/product.service";

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

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchQuery: string = '';
  selectedCategory: string = 'all';

  drawerOpen = false;

  cart$ = this.cart.cart$;
  cartCount$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.quantity, 0)));
  cartTotal$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.price * item.quantity, 0)));

  async ngOnInit(): Promise<void> {
    try {
      this.products = await this.productService.getProducts();  
      this.filteredProducts = this.products;
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
}


