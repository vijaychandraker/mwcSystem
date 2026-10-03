import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  selectedRole: 'ADMIN' | 'DISTRIBUTOR' = 'ADMIN';
  username = '';
  password = '';
  showPassword = false;
  rememberMe = true;
  isLoading = false;
  errorMessage = '';

  private returnUrl = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['role']?.toLowerCase() === 'distributor') {
        this.selectedRole = 'DISTRIBUTOR';
      } else if (params['role']?.toLowerCase() === 'admin') {
        this.selectedRole = 'ADMIN';
      }

      this.returnUrl = params['returnUrl'] || '';

      // Check if already authenticated for current role
      if (this.selectedRole === 'ADMIN' && this.authService.isAuthenticated()) {
        this.router.navigateByUrl(this.returnUrl || '/admin');
      } else if (this.selectedRole === 'DISTRIBUTOR' && this.authService.isDistributorAuthenticated()) {
        this.router.navigateByUrl(this.returnUrl || '/distributor');
      }
    });
  }

  setRole(role: 'ADMIN' | 'DISTRIBUTOR') {
    this.selectedRole = role;
    this.errorMessage = '';
    this.username = '';
    this.password = '';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  fillQuickCredentials(u: string, p: string) {
    this.username = u;
    this.password = p;
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = this.selectedRole === 'ADMIN'
        ? 'Please enter both Admin username and password.'
        : 'Please enter your registered mobile/GSTIN and password.';
      return;
    }

    this.isLoading = true;

    this.authService.login({
      role: this.selectedRole,
      username: this.username.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          if (this.selectedRole === 'ADMIN') {
            this.router.navigateByUrl(this.returnUrl || '/admin');
          } else {
            this.router.navigateByUrl(this.returnUrl || '/distributor');
          }
        } else {
          this.errorMessage = res.message || 'Login failed. Please verify your credentials.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials. Please verify your details.';
      }
    });
  }
}
