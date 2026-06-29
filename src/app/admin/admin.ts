  import { Component, inject, ChangeDetectorRef } from '@angular/core';
  import {AppointmentService} from "../services/AppointmentService";
  import {Appointment} from "../models/appointment/appointment";
  import { Auth } from '../services/auth';
  import { User } from '../models/user/user';
  import { FormsModule } from '@angular/forms';
  import { Product } from '../models/products/product';
  import { ProductService } from '../services/product.service';
  import { ToastService } from '../services/toast.service';

  @Component({
    selector: 'app-admin',
    standalone: true,
    imports: [FormsModule],
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

    appointments: Appointment[] = [];
    users: User[] = [];
    products: Product[] = [];
    searchEmail: string = '';

    editingProduct: boolean = false;
    showForm: boolean = false;
    productForm: Product = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageurl: '',
      badge: '',
      category: '',
      stock: 0
    };

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

    editProduct(product: Product): void {
      this.productForm = { ...product };
      this.editingProduct = true;
    }

    async saveProduct(): Promise<void> {
      if (this.editingProduct) {
        await this.productService.updateProduct(this.productForm);
        this.toastService.success('Product updated successfully');
      } else {
        await this.productService.addProduct(this.productForm);
        this.toastService.success('Product added successfully');
      }
      this.resetForm();
      await this.loadProducts();
    }
    
    resetForm(): void {
      this.editingProduct = false;
      this.productForm = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        imageurl: '',
        badge: '',
        category: '',
        stock: 0
      };
    }
  }
