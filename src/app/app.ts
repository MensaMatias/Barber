import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Footer } from "./footer/footer";
<<<<<<< HEAD
=======
import { ToastComponent } from './shared/toast/toast';
>>>>>>> main

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, Navbar, Footer],
=======
  imports: [RouterOutlet, Navbar, Footer, ToastComponent],
>>>>>>> main
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('barber');
}
