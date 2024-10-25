import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalaryAdvdetComponent } from './monthly-salary-advdet.component';

describe('MonthlySalaryAdvdetComponent', () => {
  let component: MonthlySalaryAdvdetComponent;
  let fixture: ComponentFixture<MonthlySalaryAdvdetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlySalaryAdvdetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlySalaryAdvdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
