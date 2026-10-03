import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AdminUser {
  username: string;
  displayName: string;
  email: string;
  role: string;
  loginTime: string;
}

export interface DistributorUser {
  party_id: number;
  party_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  gst_no: string;
  district: string;
  state: string;
  role: 'DISTRIBUTOR';
  loginTime: string;
}

export interface LoginResponse {
  success: boolean;
  role?: 'ADMIN' | 'DISTRIBUTOR';
  message: string;
  token?: string;
  user?: AdminUser;
  distributor?: DistributorUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private adminSessionKey = 'invo_admin_session';
  private distSessionKey = 'invo_dist_session';

  currentUser = signal<AdminUser | null>(this.loadAdminFromStorage());
  isLoggedIn = signal<boolean>(!!this.loadAdminFromStorage());

  currentDistributor = signal<DistributorUser | null>(this.loadDistributorFromStorage());
  isDistributorLoggedIn = signal<boolean>(!!this.loadDistributorFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  private loadAdminFromStorage(): AdminUser | null {
    try {
      const raw = localStorage.getItem(this.adminSessionKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading admin session:', e);
    }
    return null;
  }

  private loadDistributorFromStorage(): DistributorUser | null {
    try {
      const raw = localStorage.getItem(this.distSessionKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading distributor session:', e);
    }
    return null;
  }

  // Unified login handling both roles
  login(credentials: { role: 'ADMIN' | 'DISTRIBUTOR'; username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.token) {
          if (res.role === 'ADMIN' && res.user) {
            localStorage.setItem(this.adminSessionKey, JSON.stringify(res.user));
            localStorage.setItem('invo_admin_token', res.token);
            this.currentUser.set(res.user);
            this.isLoggedIn.set(true);
          } else if (res.role === 'DISTRIBUTOR' && res.distributor) {
            localStorage.setItem(this.distSessionKey, JSON.stringify(res.distributor));
            localStorage.setItem('invo_dist_token', res.token);
            this.currentDistributor.set(res.distributor);
            this.isDistributorLoggedIn.set(true);
          }
        }
      })
    );
  }

  logoutAdmin() {
    localStorage.removeItem(this.adminSessionKey);
    localStorage.removeItem('invo_admin_token');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login'], { queryParams: { role: 'admin' } });
  }

  logoutDistributor() {
    localStorage.removeItem(this.distSessionKey);
    localStorage.removeItem('invo_dist_token');
    this.currentDistributor.set(null);
    this.isDistributorLoggedIn.set(false);
    this.router.navigate(['/login'], { queryParams: { role: 'distributor' } });
  }

  // Backward compatibility alias
  logout() {
    this.logoutAdmin();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.adminSessionKey);
  }

  isDistributorAuthenticated(): boolean {
    return !!localStorage.getItem(this.distSessionKey);
  }

  getUser(): AdminUser | null {
    return this.currentUser();
  }

  getDistributor(): DistributorUser | null {
    return this.currentDistributor();
  }
}
