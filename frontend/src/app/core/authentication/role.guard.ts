// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from './auth.service';
// import { map } from 'rxjs';

// export const roleGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const authService = inject(AuthService);

//   const userRole$ = authService.getLoggedInUserRole();
//   return userRole$.pipe(
//     map(role => {
//       if (role === 'ADMIN') {
//         // Redirect to the admin panel leave page
//         return router.createUrlTree(['/admin-leave']);
//       } else if (role === 'EMPLOYEE') {
//         // Redirect to the regular leave page
//         return router.createUrlTree(['/leave']);
//       } else {
//         // Redirect to the login page if the user is not authenticated
//         //router.navigate(['/auth/login']).catch(err => console.error('Error navigating to login:', err));
//         return false;
//       }
//     })
//   );
  
// };
