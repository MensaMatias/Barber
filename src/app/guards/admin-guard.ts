import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isAdmin()) {
    return true;
  }

  if (auth.isLoggedIn()) {
    toast.error('You do not have permission to access the admin panel.');
  } else {
    toast.error('Please log in to access the admin panel.');
  }

  router.navigate(['/home']);
  return false;
};
