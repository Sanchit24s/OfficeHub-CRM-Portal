import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services/notification.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = ['date', 'title', 'description',];
  notifications: any[] = [];
  dataSource = new MatTableDataSource<any>(this.notifications);
  loginUserId = localStorage.getItem('userId');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.loginUserId).subscribe(
      (user) => {
        this.notificationService.getNotificationByEmpId(user.employeeId).subscribe(
          (response) => {
            this.notifications = response;
            this.dataSource.data = this.notifications;
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
 