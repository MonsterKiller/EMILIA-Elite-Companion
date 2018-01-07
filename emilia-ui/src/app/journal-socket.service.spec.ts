import { TestBed, inject } from '@angular/core/testing';

import { JournalSocketService } from './journal-socket.service';

describe('JournalSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JournalSocketService]
    });
  });

  it('should be created', inject([JournalSocketService], (service: JournalSocketService) => {
    expect(service).toBeTruthy();
  }));
});
