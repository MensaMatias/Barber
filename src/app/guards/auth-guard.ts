import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isLoggedIn()) {
    return true;
  }

  toast.error('You must be logged in to access this page.');
  router.navigate(['/login'], {
    queryParams: { returnUrl: router.url },
  });
  return false;
};
