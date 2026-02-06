import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      age: ['', [Validators.min(1), Validators.max(150)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Registration failed';
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during registration';
        this.loading = false;
      }
    });
  }
}
