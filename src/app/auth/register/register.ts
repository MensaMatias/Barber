import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {Router} from "@angular/router";

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
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).*$')]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6), ]),
  }, { validators: passwordsMatch });

  goBack(): void { window.history.back(); }
  constructor(private router: Router) {}
  goToLogin(): void {
  this.router.navigate(['/login']);
}

  get name() { return this.registerForm.get('name')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get repeatPassword() { return this.registerForm.get('repeatPassword')!; }

  ngOnInit() {
  document.body.classList.add('register-open');
}

  ngOnDestroy() {
    document.body.classList.remove('register-open');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Form Submitted', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}