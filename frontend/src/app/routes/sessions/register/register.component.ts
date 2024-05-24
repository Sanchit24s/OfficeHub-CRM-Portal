import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  isSubmitting = false;
  registerForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    },
    {
      validators: [this.matchValidator('password', 'confirmPassword')],
    }
  );

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient
  ) {}

  submit() {
    this.isSubmitting = true;

    //console.log(this.registerForm.value);

    const url = 'http://localhost:3000/user/create';
    this.http.post<any>(url, this.registerForm.value).subscribe({
      next: (response) => {

        if(response) {
          console.log(response);
          this.router.navigate(['/auth/login']);
          console.log('Registration Successful', response);
        }
      },
      error: (error) => {
        this.router.navigate(['/auth/register']);
        console.log(error);
      }
    });
  }

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }
}
