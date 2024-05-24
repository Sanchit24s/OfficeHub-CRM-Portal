import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from '@core/services/interface';
import { environment } from '@env/environment';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'date', 'checkIn', 'checkOut', 'status'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  employees: any[] = []; // Array of employee objects
  selectedEmployeeId: any;
  userId: any;
  fromDate: Date | null = null;
  toDate: Date | null = null; // Updated toDate property to allow null
  updateForm: FormGroup;
  noAttendanceFound = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      employeeId: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchAttendance();
    this.fetchEmployees();

  }

  fetchAttendance() {
    this.http.get<any[]>(`${environment.apiUrl}/attendance/`)
      .subscribe(
        (data: any[]) => {
          this.dataSource.data = data;
        },
        (error: any) => {
          console.error('Error fetching attendance data:', error);
        }
      );
  }

  fetchEmployees() {
    this.http.get<any[]>(`${environment.apiUrl}/user/`)
      .subscribe(
        (employees: any[]) => {
          this.employees = employees;
        },
        (error: any) => {
          console.error('Error fetching employees:', error);
        }
      );
  }

  filterAttendance() {
    const body = { employeeId: this.selectedEmployeeId };
    this.http.post<any[]>(`${environment.apiUrl}/user/empId`, body)
      .subscribe(
        (user: any[]) => {
          if (user) {
            this.userId = user;
            const body = {
              startDate: this.fromDate ? this.fromDate.toISOString() : null,
              endDate: this.toDate ? this.toDate.toISOString() : null
            };

            this.http.post<any[]>(`${environment.apiUrl}/attendance/range/${this.userId}`, body)
              .subscribe(
                (data: any[]) => {
                  this.dataSource.data = data;
                  this.noAttendanceFound = data.length === 0;
                  console.log(this.noAttendanceFound);
                },
                (error: any) => {
                  console.error('Error fetching attendance data:', error);
                }
              );
          } else {
            console.log('No user found');
          }
        },
        (error) => {
          console.log(error);
        }
      );

  }

  resetForm() {
    this.selectedEmployeeId = null;
    this.fromDate = null;
    this.toDate = null;

    
    this.fetchAttendance();
  }
}
