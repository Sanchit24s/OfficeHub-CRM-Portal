import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, User, GetUser } from '@core/authentication';
import { Observable, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '@core/services/profile.service';
import { Users } from '@core/services/interface';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" *ngIf="user">
      <div class="profile-image-container">
        <img *ngIf="user?.profileImage; else loading" [src]="user.profileImage" alt="profile" class="profile-image">
        <button mat-icon-button (click)="changeProfilePicture()" matTooltip="{{ 'change profile picture' | translate }}" class="change-picture-button">
          <mat-icon class="icon-18">camera_alt</mat-icon>
        </button>
      </div>
      <h4 class="matero-user-panel-name">{{ user.firstName + ' ' + user.lastName }}</h4>
      <h5 class="matero-user-panel-email">{{ user.email }}</h5>
      <div class="matero-user-panel-icons">
        <button mat-icon-button matTooltip="{{ 'profile' | translate }}" (click)="viewEmployee()">
          <mat-icon class="icon-18">account_circle</mat-icon>
        </button>
        <button mat-icon-button routerLink="/profile/overview" matTooltip="{{ 'edit_profile' | translate }}">
          <mat-icon class="icon-18">edit</mat-icon>
        </button>
        <button mat-icon-button (click)="logout()" matTooltip="{{ 'logout' | translate }}">
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </button>
      </div>
    </div>
    <ng-template #loading>Loading...</ng-template>
  `,
  styleUrls: ['./user-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserPanelComponent implements OnInit {
  profilePicture: File | null = null;
  user!: Users;

  loginUserId: string | null = null;
  loginUserRole: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loginUserId = localStorage.getItem('userId');
    this.loginUserRole = localStorage.getItem('userRole');

    if (this.loginUserId) {
      this.getUser().subscribe(user => (this.user = user));
    }

    //this.auth.user().subscribe(user => (this.user = user));

  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
  }

  getUser(): Observable<Users> {
    return this.http.get<Users>(`${environment.apiUrl}/user/${this.loginUserId}`);
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  changeProfilePicture() {
    // Open a file input dialog or handle the file selection logic
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.item(0);
      if (file) {
        this.profilePicture = file;
        // You can perform additional operations here, such as uploading the file or displaying a preview
        //this.uploadProfilePicture();
        this.uploadProfilePictureNew();
      }
    });
    fileInput.click();
  }

  // uploadProfilePicture() {
  //   if (this.profilePicture && this.loginUserId !== null) {
  //     this.profileService.uploadProfilePicture(this.profilePicture, this.loginUserId)
  //       .subscribe(
  //         (response) => {
  //           console.log('Profile picture uploaded successfully:', response);
            
  //           // Perform any additional operations after successful upload
  //         },
  //         (error) => {
  //           console.error('Error uploading profile picture:', error);
  //           // Handle error case
  //         }
  //       );
  //   }
  // }

  uploadProfilePictureNew() {
    this.selectedFile = this.profilePicture;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post(`${environment.apiUrl}/user/update-profile-picture/${this.loginUserId}`, formData).subscribe(
        (response: any) => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          console.error('error'+error);
        }
      );
    }
  }

  viewEmployee(): void {
    
    const employeeId = this.user.employeeId; 
    if(this.loginUserRole === 'ADMIN') {
      this.router.navigate(['/viewProfile', employeeId], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['/userProfile']);
    }
  }
}
