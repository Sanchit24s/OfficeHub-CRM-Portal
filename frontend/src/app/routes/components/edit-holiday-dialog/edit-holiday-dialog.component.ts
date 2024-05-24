import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HolidayService } from '@core/services/holiday.service';
import { Holiday } from '@core/services/interface';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-edit-holiday-dialog',
  templateUrl: './edit-holiday-dialog.component.html',
  styleUrls: ['./edit-holiday-dialog.component.scss']
})
export class EditHolidayDialogComponent {
  editHolidayForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditHolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Holiday,
    private formBuilder: FormBuilder,
    private holidayService: HolidayService,
    private dialog: MatDialog
  ) {
    this.editHolidayForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      date: [data.date, Validators.required],
      description: [data.description]
    });
  }

  onSubmit() {
    if (this.editHolidayForm.valid) {
      const newHoliday = this.editHolidayForm.value;
      newHoliday._id = this.data._id;
      this.holidayService.editHoliday(newHoliday).subscribe(
        (response) => {
          this.openSuccessDialog('Holiday Updated Successfully');
          this.dialogRef.close('submit');
        },
        (error) => {
          console.error('Error updating holiday:', error);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  openSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message },
      width: '700px', 
      height: '450px' 
    });
  }
}
