import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['employeeId', 'title', 'description', 'date'];
  notifications: any[] = [];
  dataSource = new MatTableDataSource<any>(this.notifications);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notificationService.getAllNotification().subscribe(
      notice => {
        this.notifications = notice;
        this.dataSource.data = this.notifications;
      },
      error => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
 