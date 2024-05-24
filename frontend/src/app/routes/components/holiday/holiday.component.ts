import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HolidayService } from '@core/services/holiday.service';
import { Holiday } from '@core/services/interface';
import { AddHolidayDialogComponent } from '../add-holiday-dialog/add-holiday-dialog.component';
import { EditHolidayDialogComponent } from '../edit-holiday-dialog/edit-holiday-dialog.component';
import { DeleteholidaydialogComponent } from '../deleteholidaydialog/deleteholidaydialog.component';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit{
  holidays: Holiday[] = [];
  role = localStorage.getItem('userRole');
  isAdmin = this.role === 'ADMIN';

  constructor(
              private holidayService: HolidayService,
              private dialog: MatDialog
            ) {}

  ngOnInit(): void {
    this.getHolidays();
  }

  openDialog(){
    const dialogRef = this.dialog.open(AddHolidayDialogComponent, {
      width: '380px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submit') {
        this.getHolidays(); // Refresh the holidays list
      }
    });
  }

  getHolidays() {
    this.holidayService.getHolidays().subscribe(
      (data: Holiday[]) => {
        this.holidays = data;
      },
      (error) => {
        console.error('Error retrieving holidays:', error);
      }
    );
  }

  openEditDialog(holiday: Holiday) {
    const dialogRef = this.dialog.open(EditHolidayDialogComponent, {
      data: holiday, width: '380px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated holiday data
        console.log('Updated holiday:', result);
        // Update the holiday in the holidays array or perform any other necessary operations
        this.getHolidays();
      }
    });
  }

  deleteHoliday(holiday: Holiday) {
    const dialogRef = this.dialog.open(DeleteholidaydialogComponent, {
      data: holiday, width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated holiday data
        console.log('Holiday Deleted Successfully', result);
        // Update the holiday in the holidays array or perform any other necessary operations
        this.getHolidays();
      }
    });
  }
}
