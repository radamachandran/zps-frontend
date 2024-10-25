import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionDialogComponent } from './deduction-dialog.component';

describe('DeductionDialogComponent', () => {
  let component: DeductionDialogComponent;
  let fixture: ComponentFixture<DeductionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
