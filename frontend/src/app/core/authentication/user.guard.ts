import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const userGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken: any = jwtDecode(token);
    const id = decodedToken._id;
    const userId = localStorage.getItem('userId');

    if(id === userId) {
      //console.log(id);
      return true;
    }else {
      return false;
    }

    // try {
    //   const response = await http.get<any>(`${environment.apiUrl}/user/${id}`).toPromise();
    //   console.log(response);
    //   if (response.status === 200) {
    //     // User exists, activate the route
    //     return true;
    //   } else {
    //     // User not found, don't activate the route
    //     router.navigate(['/auth/login']).catch(err => console.error('Error navigating to login:', err));
    //     return false;
    //   }
    // } catch (error) {
    //   console.error('Error fetching user data:', error);
    //   // Error occurred, don't activate the route
    //   router.navigate(['/auth/login']).catch(err => console.error('Error navigating to login:', err));
    //   return false;
    // }

    
    return true;
  } else {
    // No token, don't activate the route
    router.navigate(['/auth/login']).catch(err => console.error('Error navigating to login:', err));
    return false;
  }
};