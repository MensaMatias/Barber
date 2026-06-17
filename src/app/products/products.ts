import { Component, inject } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Cart} from "../services/cart";
import {map} from "rxjs/operators"; 

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge: string;
  category: string;
}

@Component({
  selector: 'app-products',
  imports: [ FormsModule, AsyncPipe],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.css',
})

export class Products {
  Products: Product[] = [
    {
      id: 1,
      name: 'Gloss Pomade',
      description: 'Classic pomade with a glossy finish and flexible hold.',
      price: 250,
      imageUrl: '/assets/img/product1.png',
      badge: 'High shine',
      category: 'pomade',
    },
    {
      id: 2,
      name: 'Powder Snow',
      description: 'Texturizing powder that adds volume and a natural matte look.',
      price: 200,
      imageUrl: '/assets/img/product2.png',
      badge: 'Matte finish',
      category: 'powder',
    },
    {
      id: 3,
      name: 'Extreme Hairspray',
      description: 'Long-lasting hairspray designed to keep your style in place all day.',
      price: 400,
      imageUrl: '/assets/img/product3.png',
      badge: 'Extra strong hold',
      category: 'hairspray',
    },
    {
      id: 4,
      name: 'Detail Trimmer',
      description: 'Precision trimmer for sharp lines, beard detailing, and clean finishes.', 
      price: 500,
      imageUrl: '/assets/img/product4.png',
      badge: 'Professional tool',
      category: 'trimmer',
    },
  ];

  filteredProducts: Product[] = this.Products;

  filterProducts() {
    this.filteredProducts = this.Products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  searchQuery: string = '';

  selectedCategory: string = 'all';

  private cart = inject(Cart);

  cart$ = this.cart.cart$;

  cartCount$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.quantity, 0)));

  cartTotal$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.price * item.quantity, 0)));

  drawerOpen = false;

  addToCart(product: Product) {
    this.cart.addToCart(product);
  }

  removeFromCart(id: number) {
    this.cart.removeFromCart(id);
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  decreaseQuantity(id: number) {
    this.cart.decreaseQuantity(id);
  }

  increaseQuantity(id: number) {
    this.cart.increaseQuantity(id);
  }
}


