import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { UserService } from '@core/services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  messages: any[] = [];
  visibleMessages: any[] = [];
  userRole = localStorage.getItem('userRole');
  userId = localStorage.getItem('userId');
  lengthOfMessage = 0;
  menuOpen = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications() {
    if (this.userRole === 'ADMIN') {
      this.notificationService.getAllNotification().subscribe(
        (notifications: any[]) => {
          this.messages = notifications.filter(notification => !notification.isView);
          this.visibleMessages = this.messages.slice(0, 5);
          this.lengthOfMessage = this.messages.length;
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error fetching notifications:', error);
        }
      );
    } else if (this.userRole === 'EMPLOYEE') {
      this.userService.getUser(this.userId).subscribe(
        (user) => {
          this.notificationService.getNotificationByEmpId(user.employeeId).subscribe(
            (notifications: any[]) => {
              this.messages = notifications.filter(notification => !notification.isView);
              this.visibleMessages = this.messages.slice(0, 5);
              this.lengthOfMessage = this.messages.length;
              this.cdr.detectChanges();
            },
            error => {
              console.error('Error fetching notifications:', error);
            }
          );
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  moreNotificationsAvailable(): boolean {
    return this.messages.length > 5;
  }

  showAllNotifications() {
    this.markAllNotificationsAsViewed();
    this.router.navigate([this.userRole === 'ADMIN' ? '/notifications' : '/notification']);
    this.closeMenu();
  }

  markAllNotificationsAsViewed() {
    if (this.userRole === 'ADMIN') {
      this.notificationService.markAllAsViewed().subscribe(
        () => this.fetchNotifications(),
        error => console.log(error)
      );
    } else {
      this.userService.getUser(this.userId).subscribe(
        (user) => {
          this.notificationService.markAllAsViewedByEmpId(user.employeeId).subscribe(
            () => this.fetchNotifications(),
            error => console.log(error)
          );
        },
        error => console.error('Error fetching user:', error)
      );
    }
  }
  
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {
    const isInsideContainer = this.elementRef.nativeElement.contains(targetElement);
    if (!isInsideContainer) {
      this.menuOpen = false;
      this.cdr.detectChanges();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.cdr.detectChanges();
  }

  closeMenu() {
    this.menuOpen = false;
    this.cdr.detectChanges();
  }
}
