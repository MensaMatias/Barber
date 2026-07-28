import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { User } from '../../models/user/user';
import { ToastService } from '../../services/toast.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const repeat = group.get('repeatPassword')?.value;
  return pass === repeat ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: '../auth.css',
})
export class Register {
  showPassword = false;
  showRepeatPassword = false;

  registerForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).*$')]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
    { validators: passwordsMatch }
  );

  constructor(private router: Router, private auth: Auth, private toast: ToastService) {}

  goBack(): void {
    window.history.length > 1 ? window.history.back() : this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword')!;
  }

  ngOnInit(): void {
    document.body.classList.add('register-open');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('register-open');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPassword(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.error('Please fill in all fields correctly');
      return;
    }

    const user: User = {
      name: this.registerForm.value.name!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      role: 'customer',
    };

    try {
      await this.auth.register(user);
      this.toast.success('Registration successful');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.toast.error(error?.message ?? 'Unable to register right now.');
    }
  }
}