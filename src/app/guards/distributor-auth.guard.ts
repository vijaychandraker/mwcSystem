import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const distributorAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If logged in as distributor or as admin, allow access
  if (authService.isDistributorLoggedIn() || authService.isLoggedIn()) {
    return true;
  }

  // Not logged in -> redirect to unified login window with distributor role pre-selected
  router.navigate(['/login'], {
    queryParams: {
      role: 'distributor',
      returnUrl: state.url
    }
  });

  return false;
};
