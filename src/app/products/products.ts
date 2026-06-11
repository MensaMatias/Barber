import { Component } from '@angular/core';

Component({
  selector: 'app-products',
  imports: [],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.css',
})

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  badge: string;
  category: string;
}

export class Products {
  Products: Product[] = [
    {
      id: 1,
      name: 'Gloss Pomade',
      description: 'Classic pomade with a glossy finish and flexible hold.',
      price: 250,
      imageUrl: '/assets/img/product1.png',
      badge: 'High shine',
      category: 'Pomade',
    },
    {
      id: 2,
      name: 'Powder Snow',
      description: 'Texturizing powder that adds volume and a natural matte look.',
      price: 200,
      imageUrl: '/assets/img/product2.png',
      badge: 'Matte finish',
      category: 'Powder',
    },
    {
      id: 3,
      name: 'Extreme Hairspray',
      description: 'Long-lasting hairspray designed to keep your style in place all day.',
      price: 400,
      imageUrl: '/assets/img/product3.png',
      badge: 'Extra strong hold',
      category: 'Hairspray',
    },
    {
      id: 4,
      name: 'Detail Trimmer',
      description: 'Precision trimmer for sharp lines, beard detailing, and clean finishes.', 
      price: 500,
      imageUrl: '/assets/img/product4.png',
      badge: 'Professional tool',
      category: 'Trimmer',
    },
  ];

  filteredProducts: Product[] = this.Products;

  searchQuerry: string = '';

  selectedCategory: string = 'All';

  filterProducts(): void {
    this.filteredProducts = this.Products.filter(product => {
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuerry.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
}
