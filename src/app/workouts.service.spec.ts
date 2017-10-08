import { TestBed, inject } from '@angular/core/testing';

import { WorkoutsService } from './workouts.service';

describe('WorkoutsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkoutsService]
    });
  });

  it('should be created', inject([WorkoutsService], (service: WorkoutsService) => {
    expect(service).toBeTruthy();
  }));
});
