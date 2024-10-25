import { TestBed } from '@angular/core/testing';

import { DeparmentService } from './deparment.service';

describe('DeparmentService', () => {
  let service: DeparmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeparmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
