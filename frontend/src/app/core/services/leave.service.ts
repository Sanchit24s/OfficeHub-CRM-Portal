import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LeaveService{
  
  constructor(private http: HttpClient) { }

  getAllLeaveApplications(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/leave/`);
  }

  getAllLeaveApplicationById(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/leave/${userId}`);
  }

  addLeaveApplication(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/leave/add/${data.userId}`, data);
  }

  approveLeaveApplication(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/leave/${id}/approve`, {});
  }

  rejectLeaveApplication(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/leave/${id}/reject`, {});
  }

  getLoggedInUserDetails(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/${id}`);
  }
}