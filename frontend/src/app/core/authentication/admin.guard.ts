import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const role = localStorage.getItem('userRole');

  if (role === 'ADMIN') {
    return true;
  }

  else {
    router.navigate(['/403']);
    return false;
  }
};
