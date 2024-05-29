import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from '@core/services/leave.service';

@Component({
  selector: 'app-leave-admin',
  templateUrl: './leave-admin.component.html',
  styleUrls: ['./leave-admin.component.scss']
})
export class LeaveAdminComponent implements OnInit{
  displayedColumns: string[] = ['name', 'email', 'start date', 'end date', 'reason', 'status', 'date', 'action'];
  dataSource = new MatTableDataSource<any>();
  leaveApplications: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchLeaveApplications();
  }

  fetchLeaveApplications() {
    this.leaveService.getAllLeaveApplications()
      .subscribe(
        (data) => {
          this.dataSource.data = data;
        },
        (error) => {
          console.error('Error fetching leave applications:', error);
        }
      );
  }

  approveLeave(id: string) {
    this.leaveService.approveLeaveApplication(id)
      .subscribe(
        (data) => {
          this.fetchLeaveApplications();
        },
        (error) => {
          console.error('Error approving leave application:', error);
        }
      );
  }

  rejectLeave(id: string) {
    this.leaveService.rejectLeaveApplication(id)
      .subscribe(
        (data) => {
          console.log('Leave Application Rejected: ', data);
          this.fetchLeaveApplications();
        },
        (error) => {
          console.error('Error approving leave application:', error);
        }
      );
  }
}
