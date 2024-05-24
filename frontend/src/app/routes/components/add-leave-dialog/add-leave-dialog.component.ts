import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@core';
import { LeaveService } from '@core/services/leave.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-add-leave-dialog',
  templateUrl: './add-leave-dialog.component.html',
  styleUrls: ['./add-leave-dialog.component.scss']
})
export class AddLeaveDialogComponent implements OnInit {
  addLeaveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leaveService: LeaveService,
    private authService: AuthService
  ) {
    this.addLeaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required],
      userId: [''],
      name:[''],
      email:['']
    });
  }

  userId: string | null = null;
  name: string | null = null;
  email: string | null = null;

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
      this.addLeaveForm.patchValue({
        userId: this.userId
      });
      this.fetchUserDetails(); 
    
  }

  fetchUserDetails() {
    if(this.userId !== null){
      this.leaveService.getLoggedInUserDetails(this.userId)
      .subscribe(
        (data) => {
          this.email = data.email;
          this.name = `${data.firstName} ${data.lastName}`;

          this.addLeaveForm.patchValue({
            name: this.name,
            email: this.email
          });
        },
        (error) => {
          console.error('Error fetching leave applications:', error);
        }
      );
    }
    
  }

  addLeave() {
    if (this.addLeaveForm.valid) {

      this.leaveService.addLeaveApplication(this.addLeaveForm.value)
          .subscribe(
            (response) => {
              console.log('Leave application added successfully:', response);
              // Handle success response
              this.dialogRef.close(true); // Close the dialog
            },
            (error) => {
              console.error('Error adding leave application:', error);
            }
          );
    }
  }

  closeDialog() {
    this.dialogRef.close(false); // Close the dialog without adding a leave application
  }

}
