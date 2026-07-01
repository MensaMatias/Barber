  import { Component, inject, ChangeDetectorRef } from '@angular/core';
  import {AppointmentService} from "../services/AppointmentService";
  import {Appointment} from "../models/appointment/appointment";
  import { Auth } from '../services/auth';
  import { User } from '../models/user/user';
  import { FormsModule,ReactiveFormsModule   } from '@angular/forms';
  import { Product } from '../models/products/product';
  import { ProductService } from '../services/product.service';
  import { ToastService } from '../services/toast.service';
  import { FormBuilder, Validators } from '@angular/forms';

  @Component({
    selector: 'app-admin',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './admin.html',
    styleUrl: './admin.css',
  })
  export class Admin {
    private appointmentService = inject(AppointmentService);
    private auth = inject(Auth);
    private cdr = inject(ChangeDetectorRef);
    // Proyecto sin Zone.js: necesario para refrescar la vista
    // después de cargar datos asíncronos desde Supabase.
    private productService = inject(ProductService);
    private toastService = inject(ToastService);
    private formBuilder = inject(FormBuilder);

    appointments: Appointment[] = [];
    users: User[] = [];
    products: Product[] = [];
    searchEmail: string = '';
    editingProduct: boolean = false;
    showForm: boolean = false;

    async ngOnInit() {
      await this.loadAppointments();
      await this.loadUsers();
      await this.loadProducts();
    }
    
    async loadAppointments(): Promise<void> {
      this.appointments = await this.appointmentService.getAllAppointments();
    }

    async loadUsers(): Promise<void> {
      this.users = await this.auth.getAllUsers();
      this.cdr.detectChanges();
    }

    async deleteAppointment(appointmentId: number): Promise<void> {
      await this.appointmentService.deleteAppointment(appointmentId);
      await this.loadAppointments();
    }

    getFilteredAppointments(): Appointment[] {
      if (!this.searchEmail) {
        return this.appointments;
      }
      return this.appointments.filter(appointment =>
        appointment.userEmail.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
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

    editingProductId: number | null = null;

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

    productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(1), Validators.max(10000000000)]],
      imageurl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/)]],
      badge: [''],
      category: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      stock: [0, [Validators.required, Validators.min(1), Validators.max(10000000000)]]
    })

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
