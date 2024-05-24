import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHolidayDialogComponent } from './add-holiday-dialog.component';

describe('AddHolidayDialogComponent', () => {
  let component: AddHolidayDialogComponent;
  let fixture: ComponentFixture<AddHolidayDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHolidayDialogComponent]
    });
    fixture = TestBed.createComponent(AddHolidayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
