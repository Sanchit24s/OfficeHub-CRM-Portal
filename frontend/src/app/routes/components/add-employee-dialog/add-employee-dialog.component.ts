import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { ErrorDialogComponent } from 'app/routes/shared/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.scss']
})
export class AddEmployeeDialogComponent {
  registerForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(35)]],
      lastName: ['', [Validators.required, Validators.maxLength(35)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      role: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    },
    {
      validators: [this.matchValidator('password', 'confirmPassword')],
    }
  );

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

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

  submit() {
    if (this.registerForm.valid) {
      const url = `${environment.apiUrl}/user/create`;
      this.http.post<any>(url, this.registerForm.value).subscribe({
        next: (response) => {

          if(response) {
            this.openSuccessDialog('Registration Successful');
            console.log('Registration Successful', response);
          }
        },
        error: (error) => {
          //this.router.navigate(['/auth/register']);
          this.openErrorDialog(error.message);
          console.log(error);
        }
      });
      this.dialogRef.close(this.registerForm.value);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message },
      width: '700px', 
      height: '450px' 
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
      width: '700px', 
      height: '450px'
    });
  }

}
