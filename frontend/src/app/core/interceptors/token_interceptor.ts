import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from local storage
    const authToken = localStorage.getItem('token');


    // If the auth token exists, clone the request and add the auth header
    if (authToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });

      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle authentication errors here
          if (error.status === 401) {
            // Unauthorized, handle accordingly (e.g., redirect to login page)
            console.log('Unauthorized, redirecting to login page...');
            localStorage.removeItem('token');
            this.router.navigateByUrl('/auth/login');
          }
          return throwError(error);
        })
      );
    }

    // If the auth token doesn't exist, just pass through the request
    return next.handle(request);
  }
}