import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHolidayDialogComponent } from './edit-holiday-dialog.component';

describe('EditHolidayDialogComponent', () => {
  let component: EditHolidayDialogComponent;
  let fixture: ComponentFixture<EditHolidayDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHolidayDialogComponent]
    });
    fixture = TestBed.createComponent(EditHolidayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
