import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveDialogComponent } from './add-leave-dialog.component';

describe('AddLeaveDialogComponent', () => {
  let component: AddLeaveDialogComponent;
  let fixture: ComponentFixture<AddLeaveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLeaveDialogComponent]
    });
    fixture = TestBed.createComponent(AddLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
