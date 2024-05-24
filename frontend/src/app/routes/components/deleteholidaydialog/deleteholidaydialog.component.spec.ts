import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteholidaydialogComponent } from './deleteholidaydialog.component';

describe('DeleteholidaydialogComponent', () => {
  let component: DeleteholidaydialogComponent;
  let fixture: ComponentFixture<DeleteholidaydialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteholidaydialogComponent]
    });
    fixture = TestBed.createComponent(DeleteholidaydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
