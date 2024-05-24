import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '@core/authentication/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-attendance-display',
  templateUrl: './attendance-display.component.html',
  styleUrls: ['./attendance-display.component.scss']
})
export class AttendanceDisplayComponent implements AfterViewInit {
  displayedColumns: string[] = ['date', 'checkIn', 'checkOut', 'status'];
  dataSource = new MatTableDataSource<any>();

  userId = localStorage.getItem('userId');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchAttendance();
  }

  fetchAttendance() {
    this.http.get<any[]>(`${environment.apiUrl}/attendance/${this.userId}`)
          .subscribe(
            (data: any[]) => {
              this.dataSource.data = data;
            },
            (error: any) => {
              console.error('Error fetching attendance data:', error);
            }
          );
  }
}
