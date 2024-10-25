import { TestBed } from '@angular/core/testing';

import { SalaryadvmsService } from './salaryadvms.service';

describe('SalaryadvmsService', () => {
  let service: SalaryadvmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryadvmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
