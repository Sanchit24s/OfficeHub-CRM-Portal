import { Component, OnInit } from '@angular/core';
import { LeaveService } from '@core/services/leave.service';
import { AddLeaveDialogComponent } from '../add-leave-dialog/add-leave-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  leaveApplications: any[] = [];
  userId: string | null = null;

  constructor(
              private leaveService: LeaveService,
              private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.fetchLeaveApplications();
  }

  fetchLeaveApplications() {
    if(this.userId) {
      this.leaveService.getAllLeaveApplicationById(this.userId)
      .subscribe(
        (data) => {
          this.leaveApplications = data;
        },
        (error) => {
          console.error('Error fetching leave applications:', error);
        }
      );
    }
  }

  openAddLeaveDialog() {
    const dialogRef = this.dialog.open(AddLeaveDialogComponent, {
      width: '400px' // Set the desired width for the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the leave applications list if a new application was added
        this.fetchLeaveApplications();
      }
    });
  }
}
