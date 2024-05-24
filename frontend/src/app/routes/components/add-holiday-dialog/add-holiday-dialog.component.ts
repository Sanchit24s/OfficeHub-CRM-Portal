import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HolidayService } from '@core/services/holiday.service';
import { SuccessDialogComponent } from 'app/routes/shared/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-holiday-dialog',
  templateUrl: './add-holiday-dialog.component.html',
  styleUrls: ['./add-holiday-dialog.component.scss']
})
export class AddHolidayDialogComponent implements OnInit {
  addHolidayForm!: FormGroup;

  constructor(
              private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<AddHolidayDialogComponent>,
              private holidayService: HolidayService,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.addHolidayForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });
  }

  get name() {
    return this.addHolidayForm.get('name');
  }

  get date() {
    return this.addHolidayForm.get('date');
  }

  addHoliday() {
    if (this.addHolidayForm.valid) {
      const newHoliday = this.addHolidayForm.value;
      this.holidayService.addHoliday(newHoliday).subscribe(
        (response) => {
          this.openSuccessDialog('Holiday Added Successfully');
          this.dialogRef.close('submit');
        },
        (error) => {
          console.error('Error creating holiday:', error);
        }
      );
    }
  }

  closeDialog() {
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
