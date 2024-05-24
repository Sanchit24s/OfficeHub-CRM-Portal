import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceDisplayComponent } from './attendance-display.component';

describe('AttendanceDisplayComponent', () => {
  let component: AttendanceDisplayComponent;
  let fixture: ComponentFixture<AttendanceDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceDisplayComponent]
    });
    fixture = TestBed.createComponent(AttendanceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
