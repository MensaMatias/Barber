import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: '../auth.css',
})
export class Login {
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private router: Router, private auth: Auth, private toast: ToastService) {}

  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
    document.body.classList.add('login-open');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-open');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.error('Please fill in all fields correctly');
      return;
    }

    try {
      await this.auth.login(this.loginForm.value.email!, this.loginForm.value.password!);
      this.toast.success('Login successful');
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toast.error(error?.message ?? 'Unable to log in right now.');
    }
  }
}
