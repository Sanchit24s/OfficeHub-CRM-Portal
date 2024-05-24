import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Users } from '@core/services/interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user/`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateUser(employee: Users): Observable<any[]> {
    return this.http.patch<any[]>(`${this.apiUrl}/update/${employee._id}`, employee);
  }

  deleteUser(employee: Users): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/delete/${employee._id}`);
  }

  getUser(Id: any): Observable<Users> {
    return this.http.get<Users>(`${environment.apiUrl}/user/${Id}`);
  }

  getUpcomingUsersBirthday(): Observable<Users[]> {
    return this.http.get<Users[]>(`${environment.apiUrl}/user/upcomingBirthdays`);
  }

  changePassword(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}/user/changePassword`,  body );
  }

  getUserProfileImageUrl(userData: Users): string {
    if (userData.gender === 'Male') {
      return 'http://localhost:3000/images/default-male1.jpg';
    } else {
      return 'http://localhost:3000/images/default-female1.jpg';
    }
  }
}