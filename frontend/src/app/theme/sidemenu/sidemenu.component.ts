import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, MenuService } from '@core';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class SidemenuComponent implements OnInit {
  // Note: Ripple effect make page flashing on mobile
  @Input() ripple = false;

  menu$ = this.menu.getAll();

  buildRoute = this.menu.buildRoute;

  role = localStorage.getItem('userRole');
  isAdmin = this.role === 'ADMIN';

  constructor(
              private menu: MenuService,
              private http: HttpClient,
              private authService: AuthService
            ) {}

  isCheckedIn = false;
  loginUserId: string | null = null;
  loginUserEmail: string | null = null;

  attendanceData: any = null;
  checkInTime: Date | null = null;
  checkOutTime: Date | null = null;

  ngOnInit() {
    this.loginUserId = localStorage.getItem('userId');
    this.loginUserEmail = localStorage.getItem('email');
    if(this.loginUserEmail && this.loginUserId) {
      this.fetchAttendanceData();
    }
  }


  toggleCheckInOut() {
    if (this.loginUserId && this.loginUserEmail) {
      const url = this.isCheckedIn
        ? `${environment.apiUrl}/user/check-out`
        : `${environment.apiUrl}/user/check-in`;
      this.http.post(url, { email: this.loginUserEmail }).subscribe(
        (response: any) => {
          this.isCheckedIn = !this.isCheckedIn;
          if (this.isCheckedIn) {
            this.checkInTime = new Date(response.checkInTime);
            this.checkOutTime = null;
          } else {
            this.checkOutTime = new Date(response.checkOutTime);
          }
          //console.log(response);
          this.fetchAttendanceData();
          window.location.reload();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  fetchAttendanceData() {
    if (this.loginUserId && this.loginUserEmail) {
      const url = `${environment.apiUrl}/attendance/today/${this.loginUserId}`;
      this.http.get(url).subscribe(
        (response: any) => {
          this.attendanceData = response;
          this.updateCheckInOutTimes();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  updateCheckInOutTimes() {
    if (this.attendanceData) {
      const { checkIn, checkOut } = this.attendanceData;

      // Check if the properties are not undefined and are valid dates
      this.checkInTime = checkIn !== undefined && this.isValidDate(checkIn) ? 
      new Date(checkIn) : null;
      this.checkOutTime = checkOut !== undefined && this.isValidDate(checkOut) ? 
      new Date(checkOut) : null;
  
      if(checkIn && checkOut === undefined) {
        this.isCheckedIn = true;
      }
    } else {
      this.checkInTime = null;
      this.checkOutTime = null;
      this.isCheckedIn = false;
    }
  }
  
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
