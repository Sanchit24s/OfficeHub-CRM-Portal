import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@core/authentication';
import { Users } from '@core/services/interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class ProfileLayoutComponent implements OnInit {
  loginUserId: string | null = null;
  user!: Users; 

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loginUserId = localStorage.getItem('userId');

    if(this.loginUserId) {
      this.getUser().subscribe(user => (this.user = user));
    }
  }

  getUser(): Observable<Users>{
    return this.http.get<Users>(`${environment.apiUrl}/user/${this.loginUserId}`);
  }

}
