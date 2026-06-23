import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Footer } from "./footer/footer";
import { ToastComponent } from './shared/toast/toast';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.testConnection();
  }
  protected readonly title = signal('barber');
}
