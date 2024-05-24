import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { HolidayComponent } from './components/holiday/holiday.component';
import { AddHolidayDialogComponent } from './components/add-holiday-dialog/add-holiday-dialog.component';
import { EditHolidayDialogComponent } from './components/edit-holiday-dialog/edit-holiday-dialog.component';
import { DeleteholidaydialogComponent } from './components/deleteholidaydialog/deleteholidaydialog.component';
import { AttendanceComponent } from './sidemenu_components/attendance/attendance.component';
import { LeaveComponent } from './components/leave/leave.component';
import { AddLeaveDialogComponent } from './components/add-leave-dialog/add-leave-dialog.component';
import { LeaveAdminComponent } from './components/leave-admin/leave-admin.component';
import { AttendanceTableComponent } from './components/attendance-table/attendance-table.component';
import { AttendanceDisplayComponent } from './components/attendance-display/attendance-display.component';
import { EmployeesComponent } from './sidemenu_components/employees/employees.component';
import { AddEmployeeDialogComponent } from './components/add-employee-dialog/add-employee-dialog.component';
import { SuccessDialogComponent } from './shared/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './shared/error-dialog/error-dialog.component';
import { UpdateEmployeeDialogComponent } from './components/update-employee-dialog/update-employee-dialog.component';
import { DeleteEmployeeDialogComponent } from './components/delete-employee-dialog/delete-employee-dialog.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { NotificationComponent } from './sidemenu_components/notification/notification.component';
import { UserNotificationsComponent } from './sidemenu_components/user-notifications/user-notifications.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';

const COMPONENTS: any[] = [
  DashboardComponent,
  LoginComponent,
  RegisterComponent,
  Error403Component,
  Error404Component,
  Error500Component,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule, FormsModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, 
    HolidayComponent, 
    AddHolidayDialogComponent,  
    EditHolidayDialogComponent, 
    DeleteholidaydialogComponent, 
    AttendanceComponent, 
    LeaveComponent, 
    AddLeaveDialogComponent, 
    LeaveAdminComponent, 
    AttendanceDisplayComponent, 
    EmployeesComponent, 
    AddEmployeeDialogComponent, 
    SuccessDialogComponent, 
    ErrorDialogComponent, 
    UpdateEmployeeDialogComponent, 
    DeleteEmployeeDialogComponent, ViewProfileComponent, NotificationComponent, UserNotificationsComponent, ChangePasswordDialogComponent],
  
})
export class RoutesModule {}
