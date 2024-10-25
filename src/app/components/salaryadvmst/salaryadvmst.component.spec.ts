import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvmstComponent } from './salaryadvmst.component';

describe('SalaryadvmstComponent', () => {
  let component: SalaryadvmstComponent;
  let fixture: ComponentFixture<SalaryadvmstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryadvmstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryadvmstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
