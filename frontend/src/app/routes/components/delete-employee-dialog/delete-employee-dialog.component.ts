import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Users } from '@core/services/interface';
import { UserService } from '@core/services/user.service';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',
  styleUrls: ['./delete-employee-dialog.component.scss']
})
export class DeleteEmployeeDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Users,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  onConfirm() {
    const user = this.data;
    this.userService.deleteUser(user).subscribe(
      (response) => {
        this.openSuccessDialog('User Deleted Successfully');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  openSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message },
      width: '700px', 
      height: '450px' 
    });
  }
}
