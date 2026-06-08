import { Component } from '@angular/core';
import { FormGroup, FormControl,  ReactiveFormsModule ,Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register { 
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    RepeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
}
