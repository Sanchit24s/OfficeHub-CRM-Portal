import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@core/services/user.service';
import { ErrorDialogComponent } from 'app/routes/shared/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit{
  changePasswordForm!: FormGroup;
  email: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.changePasswordForm = this.formBuilder.group({
      email: [`${this.email}`],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  changePassword() {
    this.userService.changePassword(this.changePasswordForm.value).subscribe(
      (response) => {
        console.log(response);
        this.openSuccessDialog('Password Changed Successfully');
      },
      (error) => {
        console.log(this.changePasswordForm.value);
        console.log(error);
        this.openErrorDialog('Error');
      }
    );
    this.dialogRef.close();
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
