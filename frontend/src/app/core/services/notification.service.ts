import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private http: HttpClient
    ) { }

    getAllNotification(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/notification/`);
    }

    getNotificationByEmpId(empId: any): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/notification/${empId}`);
    }

    markAllAsViewed(): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/notification/markAllAsViewed`, {});
    }

    markAllAsViewedByEmpId(empId: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/notification/markAllAsViewed/${empId}`, {});
    }
}