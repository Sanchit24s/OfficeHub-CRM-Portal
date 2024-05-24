import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from '@core/services/interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from 'app/routes/components/add-employee-dialog/add-employee-dialog.component';
import { UpdateEmployeeDialogComponent } from 'app/routes/components/update-employee-dialog/update-employee-dialog.component';
import { DeleteEmployeeDialogComponent } from 'app/routes/components/delete-employee-dialog/delete-employee-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'fullName', 'email', 'date', 'position', 'action'];
  employees: Users[] = [];
  dataSource = new MatTableDataSource<Users>(this.employees);

  searchQuery = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => {
        this.employees = users;
        this.dataSource.data = this.employees; // Update the dataSource
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openAddEmployeeDialog() {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.getUsers().subscribe(
          users => {
            this.employees = users;
            this.dataSource.data = this.employees; // Update the dataSource
          },
          error => {
            console.error('Error fetching users after adding a new employee:', error);
          }
        );
      }
    });
  }

  viewEmployee(employee: Users): void {
    const employeeId = employee.employeeId; 
    this.router.navigate(['/viewProfile', employeeId], { relativeTo: this.route });
  }

  openUpdateEmployeeDialog(employee: Users) {
    const dialogRef = this.dialog.open(UpdateEmployeeDialogComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.getUsers().subscribe(
          users => {
            this.employees = users;
            this.dataSource.data = this.employees;
          },
          error => {
            console.error('Error fetching users after updating an employee:', error);
          }
        );
      }
    });
  }

  deleteEmployee(employee: Users) {

    const dialogRef = this.dialog.open(DeleteEmployeeDialogComponent, {
      data: employee, width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.getUsers().subscribe(
          users => {
            this.employees = users;
            this.dataSource.data = this.employees;
          },
          error => {
            console.error('Error fetching users after updating an employee:', error);
          }
        );
      }
    });

  }

  applyFilter(): void {
    const filterValue = this.searchInput.nativeElement.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  resetSearch() {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''; 
      this.applyFilter();
    }
  }
}