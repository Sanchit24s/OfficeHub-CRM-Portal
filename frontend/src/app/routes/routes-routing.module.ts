import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { authGuard } from '@core/authentication';
import { userGuard } from '@core/authentication/user.guard';
// import { roleGuard } from '@core/authentication/role.guard';
import { adminGuard } from '@core/authentication/admin.guard';
import { HolidayComponent } from './components/holiday/holiday.component';
import { AttendanceComponent } from './sidemenu_components/attendance/attendance.component';
import { LeaveComponent } from './components/leave/leave.component';
import { LeaveAdminComponent } from './components/leave-admin/leave-admin.component';
import { AttendanceTableComponent } from './components/attendance-table/attendance-table.component';
import { AttendanceDisplayComponent } from './components/attendance-display/attendance-display.component';
import { EmployeesComponent } from './sidemenu_components/employees/employees.component';
import { ProfileOverviewComponent } from './profile/overview/overview.component';
import { ProfileLayoutComponent } from './profile/layout/layout.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { NotificationComponent } from './sidemenu_components/notification/notification.component';
import { UserNotificationsComponent } from './sidemenu_components/user-notifications/user-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [authGuard],
    canActivate: [userGuard],
    // canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      { path: 'holiday', component: HolidayComponent},
      { path: 'leave', component: LeaveComponent},
      { path: 'attendance-display', component: AttendanceDisplayComponent},
      { path: 'notification', component: UserNotificationsComponent},
      { path: 'userProfile', component: ViewProfileComponent},
      {
        path: '',
        canActivate: [adminGuard], 
        children: [
          { path: 'leave-admin', component: LeaveAdminComponent },
          { path: 'attendance', component: AttendanceComponent},
          { path: 'get-users', component: EmployeesComponent },
          { path: 'viewProfile/:id', component: ViewProfileComponent},
          { path: 'notifications', component: NotificationComponent}
        ]
      },
      {
        path: 'design',
        loadChildren: () => import('./design/design.module').then(m => m.DesignModule),
      },
      {
        path: 'material',
        loadChildren: () => import('./material/material.module').then(m => m.MaterialModule),
      },
      {
        path: 'media',
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'permissions',
        loadChildren: () =>
          import('./permissions/permissions.module').then(m => m.PermissionsModule),
      },
      {
        path: 'utilities',
        loadChildren: () => import('./utilities/utilities.module').then(m => m.UtilitiesModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule {}
