import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Users } from '@core/services/interface';
import { UserService } from '@core/services/user.service';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-update-employee-dialog',
  templateUrl: './update-employee-dialog.component.html',
  styleUrls: ['./update-employee-dialog.component.scss']
})
export class UpdateEmployeeDialogComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Users,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initUpdateForm();
  }

  initUpdateForm() {
    this.updateForm = this.fb.group({
      firstName: [this.data.firstName, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: [this.data.lastName, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: [this.data.email, [Validators.required, Validators.email]],
      phone: [this.data.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: [this.data.password, Validators.required],
      confirmPassword: [this.data.password, Validators.required],
      designation: [this.data.designation, Validators.required],
      role: [this.data.role, Validators.required],
      gender: [this.data.gender, Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  submit() {
    if (this.updateForm.valid) {
      // Implement your logic to update the employee here
      const updatedEmployee = this.updateForm.value;
      updatedEmployee._id = this.data._id;

      this.userService.updateUser(updatedEmployee).subscribe(
        (response) => {
          this.openSuccessDialog('Details Updated Successfully');
          this.dialogRef.close('submit');
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
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
}