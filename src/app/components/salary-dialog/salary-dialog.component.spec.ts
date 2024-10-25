import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDialogComponent } from './salary-dialog.component';

describe('SalaryDialogComponent', () => {
  let component: SalaryDialogComponent;
  let fixture: ComponentFixture<SalaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
