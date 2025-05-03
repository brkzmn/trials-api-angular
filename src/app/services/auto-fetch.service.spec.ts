import { TestBed } from '@angular/core/testing';

import { AutoFetchService } from './auto-fetch.service';

describe('AutoFetchService', () => {
  let service: AutoFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
