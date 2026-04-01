import { TestBed } from '@angular/core/testing';

import { FinancialIntake } from './financial-intake';

describe('FinancialIntake', () => {
  let service: FinancialIntake;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialIntake);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
