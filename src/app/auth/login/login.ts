import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router} from "@angular/router";
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
  goBack(): void { window.history.back(); }
  constructor(private router: Router, private auth: Auth, private toast: ToastService) {}
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    document.body.classList.add('login-open');
  }

  ngOnDestroy() {
    document.body.classList.remove('login-open');
  }

  showPassword = false;
  togglePassword(): void {
      this.showPassword = !this.showPassword;
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  async onSubmit() {
  if (!this.loginForm.valid) {
    this.toast.error('Please fill in all fields correctly');
    return;
  }

  try {
    await this.auth.login(
      this.loginForm.value.email!,
      this.loginForm.value.password!
    );

    this.toast.success('Login successful');
    this.router.navigate(['/']);

  } catch (error: any) {

    this.toast.error(error.message);

  }
}
}
