import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return auth.isAdmin();
};
