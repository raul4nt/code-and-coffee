import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (!authService.isLoggedIn()) {
    return true
  } else {
    return router.createUrlTree(['/'])
  }
};
