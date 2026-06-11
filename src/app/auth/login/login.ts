import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: '../auth.css',
})
export class Login {
  goBack(): void { window.history.back(); }
  constructor(private router: Router) {}
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    document.body.classList.add('login-open');
  }

  ngOnDestroy() {
    document.body.classList.remove('login-open');
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }
}
