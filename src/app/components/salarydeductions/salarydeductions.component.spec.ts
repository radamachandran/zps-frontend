import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarydeductionsComponent } from './salarydeductions.component';

describe('SalarydeductionsComponent', () => {
  let component: SalarydeductionsComponent;
  let fixture: ComponentFixture<SalarydeductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarydeductionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarydeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
