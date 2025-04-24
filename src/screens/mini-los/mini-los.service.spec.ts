import { TestBed } from '@angular/core/testing';

import { MiniLosService } from './mini-los.service';

describe('MiniLosService', () => {
  let service: MiniLosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniLosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
