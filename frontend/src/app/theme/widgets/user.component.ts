import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsService } from '@core';
import { AuthService, GetUser, User } from '@core/authentication';
import { environment } from '@env/environment';
import { ChangePasswordDialogComponent } from 'app/routes/components/change-password-dialog/change-password-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  template: `
    <button class="r-full" mat-button [matMenuTriggerFor]="menu" *ngIf="user | async as userData">
      <img
        matButtonIcon
        class="avatar r-full"
        [src]="userData.profileImage"
        width="24"
        alt="avatar"
      /> 
      <span class="m-x-8">{{ userData.firstName }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ 'profile' | translate }}</span>
      </button>
      <button mat-menu-item (click)="changePassword()">
        <mat-icon>lock</mat-icon>
        <span>{{ 'Change Password' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'Logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .avatar {
        width: 24px;
        height: 24px;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  user!: Observable<GetUser>;

  loginUserId: string | null = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private settings: SettingsService,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginUserId = localStorage.getItem('userId');
    if (this.loginUserId) {
      this.user = this.getUser();
    }
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
    localStorage.removeItem('userRole');
  }

  restore() {
    this.settings.reset();
    window.location.reload();
  }

  getUser(): Observable<GetUser> {
    return this.http.get<GetUser>(`${environment.apiUrl}/user/${this.loginUserId}`);
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      position: {
        top: '0',
        left: '600px'
      }
    });
  }
}
