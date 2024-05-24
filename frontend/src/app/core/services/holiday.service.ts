// holiday.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Holiday } from './interface';


@Injectable({
  providedIn: 'root'
})
export class HolidayService { 
  constructor(private http: HttpClient) {}

  getHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(environment.apiUrl + '/holiday/');
  }

  getUpcomingHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(environment.apiUrl + '/holiday/upcomingHolidays');
  }

  addHoliday(holiday: Holiday): Observable<Holiday> {
    return this.http.post<Holiday>(environment.apiUrl + '/holiday/add', holiday);
  }

  editHoliday(holiday: Holiday): Observable<Holiday> {
    return this.http.patch<Holiday>(environment.apiUrl + '/holiday/update/:id', holiday);
  }

  deleteHoliday(holiday: Holiday): Observable<any> {
    const url = `${environment.apiUrl}/holiday/delete/:id`;
    const body = { _id: holiday._id };
    return this.http.delete(url, { body });
  }
}
