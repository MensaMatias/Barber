import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { Product } from '../models/products/product';
import { FormBuilder, ReactiveFormsModule ,Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css',
})

export class ProductManagement {
  products: Product[] = [];
  editingProduct = false;
  editingProductId: number | null = null;

  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef); 
  private formBuilder = inject(FormBuilder);

  productForm = this.formBuilder.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],

    description: ['', [
      Validators.maxLength(300)
    ]],

    price: [0, [
      Validators.required,
      Validators.min(1),
      Validators.max(10000000000)
    ]],

    imageurl: ['', [
      Validators.required,
      Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/)
    ]],

    badge: [''],

    category: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]],

    stock: [0, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000000)
    ]]
  });

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.products = await this.productService.getProducts();
    this.cdr.detectChanges();
  }

  async deleteProduct(productId: number): Promise<void> {
      await this.productService.deleteProduct(productId);
      await this.loadProducts();  
      this.toastService.success('Product deleted successfully');
  }

  editProduct(product: Product): void {
      this.editingProduct = true;
      this.editingProductId = product.id;

      this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      imageurl: product.imageurl,
      badge: product.badge,
      category: product.category,
      stock: product.stock
    });
  }

  async saveProduct(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.toastService.error('Please fill in all required fields correctly.');
      return;
    }

    const product: Product = {
      id: this.editingProductId ?? 0,
      ... (this.productForm.value as Omit<Product, 'id'>)
    } 

    if (this.editingProduct) {
      await this.productService.updateProduct(product);
      this.toastService.success('Product updated successfully');
    } else{
      await this.productService.addProduct(product);
      this.toastService.success('Product added successfully');
    }

    this.resetForm(); 
    await this.loadProducts();
  }

  resetForm(): void {
    this.editingProduct = false;
    this.editingProductId = null;

    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      imageurl: '',
      badge: '',
      category: '',       
      stock: 0  
    })
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['minlength']) {
      return `This field must be at least ${control.errors['minlength'].requiredLength} characters long.`;
    }

    if (control.errors['maxlength']) {
      return `This field must be no more than ${control.errors['maxlength'].requiredLength} characters long.`;
    }

    if (control.errors['min']) {
      return 'This field must be a positive number.';
    }

    if (control.errors['pattern']) {
      return 'Please enter a valid image URL. e.g., https://example.com/image.jpg';
    }

    return 'This field is invalid.';
  }
}
