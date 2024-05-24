import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivate } from '@angular/router';

export const authGuard = (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.check() ? true : router.parseUrl('/auth/login');
};



// export class AuthGuardService implements CanActivate {
//   constructor(private router: Router){}
//   canActivate(): boolean {
//     if (localStorage.getItem('token')) {
//       return true;
//     }
//     else {
//       this.router.navigate(['/auth/login']).catch(err => console.error('Error navigating to login:', err));
//       return false;
//     }
//   }
// }