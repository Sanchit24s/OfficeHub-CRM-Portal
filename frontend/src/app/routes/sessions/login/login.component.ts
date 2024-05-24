import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/authentication';
import { environment } from 'environments/environment';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent { 
  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(private http: HttpClient, 
              private fb: FormBuilder, 
              private router: Router, 
              private auth: AuthService
    ) {}

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    this.isSubmitting = true;
    const emailValue = this.loginForm.get('email')?.value;

    //console.log(this.loginForm.value);
    this.http.post<any>(environment.apiUrl + '/user/login', this.loginForm.value).subscribe({
      next: (response) => {

        if(response && response != null) {
          try {
            //console.log('reponse+' + response);
            localStorage.setItem('token', response);
            const decodedToken: any = jwtDecode(response);
            const userRole = decodedToken.role;
            const userId = decodedToken._id;
            const name = decodedToken.name;
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userId', userId);
            localStorage.setItem('name', name);
            if (emailValue !== undefined) {
              localStorage.setItem('email', emailValue);
            } else {
              console.error('Email value is undefined');
            }

            this.router.navigate(['/dashboard']);
          } catch (error) {
            console.error('Error decoding JWT token:', error);
          }

        }
      },
      error: (error) => {
        //console.log(error.status);
        this.isSubmitting = false;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/auth/login']); // navigate to the same route
        });
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    // this.auth
    //   .login(this.email.value, this.password.value, this.rememberMe.value)
    //   .pipe(filter(authenticated => authenticated))
    //   .subscribe(
    //     () => this.router.navigateByUrl('/'),
    //     (errorRes: HttpErrorResponse) => {
    //       if (errorRes.status === 422) {
    //         const form = this.loginForm;
    //         const errors = errorRes.error.errors;
    //         Object.keys(errors).forEach(key => {
    //           form.get(key === 'email' ? 'username' : key)?.setErrors({
    //             remote: errors[key][0],
    //           });
    //         });
    //       }
    //       this.isSubmitting = false;
    //     }
    //   );
  }
}
