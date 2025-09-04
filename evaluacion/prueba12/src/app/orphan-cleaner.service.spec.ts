import { TestBed } from '@angular/core/testing';

import { OrphanCleanerService } from './orphan-cleaner.service';

describe('OrphanCleanerService', () => {
  let service: OrphanCleanerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrphanCleanerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
