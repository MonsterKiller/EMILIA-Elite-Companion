import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';

@Component({
  selector: 'app-elite-balance',
  template: '{{ balance }} Credits'
})
export class EliteBalanceComponent implements OnInit {
  balance = 0;

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService
  ) {}

  ngOnInit() {
    this.update();

    this.journalSocket.event('balance').subscribe(data => {
      this.update();
    });
  }

  update() {
    const balance = this.journalData.getData('balance', 'credits');
    if (balance) {
      this.balance = balance.toLocaleString();
    } else {
      this.balance = 0;
    }
  }
}
