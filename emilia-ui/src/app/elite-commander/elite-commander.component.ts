import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';

@Component({
  selector: 'app-elite-commander',
  template: 'CMDR {{ commanderName }}'
})
export class EliteCommanderComponent implements OnInit {
  commanderName = '';

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService
  ) {}

  ngOnInit() {
    this.update();

    this.journalSocket.event('commander').subscribe(data => {
      this.update();
    });
  }

  update() {
    const commanderName = this.journalData.getData('commander', 'name');
    if (commanderName) {
      this.commanderName = commanderName;
    } else {
      this.commanderName = 'Unknown';
    }
  }
}
