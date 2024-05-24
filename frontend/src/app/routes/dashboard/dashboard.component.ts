import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { SettingsService } from '@core';
import { Observable, Subscription } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Employee, Holiday, Users } from '@core/services/interface';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { HolidayService } from '@core/services/holiday.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit { //AfterViewInit, OnDestroy
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = this.dashboardSrv.getData();

  // messages = this.dashboardSrv.getMessages();

  // charts = this.dashboardSrv.getCharts();
  // chart1: any;
  // chart2: any;

  // stats = this.dashboardSrv.getStats();

  // notifySubscription!: Subscription;

  upcomingHolidays: any[] = [
    { date: new Date('2024-05-01'), name: 'Labor Day' },
    { date: new Date('2024-05-27'), name: 'Memorial Day' },
    { date: new Date('2024-07-04'), name: 'Independence Day' },
    // Add more holiday objects as needed
  ];


  employees$: Observable<Employee[]> | null = null;
  checkedInUsers: Employee[] = [];
  checkedOutUsers: Employee[] = [];
  usersOnLeave: Employee[] = [];
  count = 0;
  employeeBirthdays: Users[] = [];
  holidays: Holiday[] = [];

  constructor(
    // private ngZone: NgZone,
    // private dashboardSrv: DashboardService,
    // private settings: SettingsService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private holidayService: HolidayService
  ) { }

  ngOnInit() {
    // this.notifySubscription = this.settings.notify.subscribe(res => {
    //   console.log(res);
    // });

    this.employees$ = this.http.get<Employee[]>(`${environment.apiUrl}/attendance/today`);
    this.employees$.subscribe(
      (employees) => {
        this.categorizeEmployees(employees);
        this.cdr.markForCheck(); // Trigger change detection manually
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );

    this.userService.getUpcomingUsersBirthday().subscribe(
      (users: Users[]) => {
        this.employeeBirthdays = users;
      },
      (error) => {
        console.error('Error fetching upcoming birthdays:', error);
      }
    );

    this.holidayService.getUpcomingHolidays().subscribe(
      (holidays: Holiday[]) => {
        this.holidays = holidays;
      },
      (error) => {
        console.error('Error fetching upcoming holidays:', error);
      }
    );
  }

  categorizeEmployees(employees: Employee[]) {
    this.checkedInUsers = employees.filter((employee) => employee.checkIn && !employee.checkOut);
    this.checkedOutUsers = employees.filter((employee) => employee.checkIn && employee.checkOut);
    this.usersOnLeave = employees.filter((employee) => employee.status === 'Leave');
  }


  // ngAfterViewInit() {
  //   this.ngZone.runOutsideAngular(() => this.initChart());
  // }

  // ngOnDestroy() {
  //   if (this.chart1) {
  //     this.chart1?.destroy();
  //   }
  //   if (this.chart2) {
  //     this.chart2?.destroy();
  //   }

  //   this.notifySubscription.unsubscribe();
  // }

  // initChart() {
  //   this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
  //   this.chart1?.render();
  //   this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.charts[1]);
  //   this.chart2?.render();
  // }
}
