import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HolidayService } from '@core/services/holiday.service';
import { Holiday } from '@core/services/interface';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-deleteholidaydialog',
  templateUrl: './deleteholidaydialog.component.html',
  styleUrls: ['./deleteholidaydialog.component.scss']
})
export class DeleteholidaydialogComponent {
  constructor(
    public dialogRef : MatDialogRef<DeleteholidaydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Holiday,
    private holidayService: HolidayService,
    private dialog: MatDialog
  ) {}

  onConfirm() {
    const holiday = this.data;
    this.holidayService.deleteHoliday(holiday).subscribe(
      (response) => {
        this.openSuccessDialog('Holiday Deleted Successfully');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error deleting holiday:', error);
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  openSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message },
      width: '700px', 
      height: '450px' 
    });
  }
}
