import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  uploadProfilePicture(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post(`${environment.apiUrl}/user/update-profile-picture/${userId}`, formData);
  }
}