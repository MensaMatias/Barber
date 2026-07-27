import { Component } from '@angular/core';
import { ProductManagement } from '../product-management/product-management';
import { AppointmentsManagement } from '../appointments-management/appointments-management';
import { UserManagement } from '../user-management/user-management';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ ProductManagement, AppointmentsManagement, UserManagement ],
  templateUrl: './admin.html',  
  styleUrl: './admin.css',
})

export class Admin {
}
