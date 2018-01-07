import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';

@Component({
  selector: 'app-elite-instance',
  template: '{{ instance }}'
})
export class EliteInstanceComponent implements OnInit {
  instance = '';

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService
  ) {}

  ngOnInit() {
    this.update();

    this.journalSocket.event('instance').subscribe(data => {
      this.update();
    });
  }

  update() {
    const instanceInfo = this.journalData.getData('instance');
    if (instanceInfo) {
      this.instance = instanceInfo.mode + (instanceInfo.group ? ' - ' + instanceInfo.group : '');
    } else {
      this.instance = 'Main Menu';
    }
  }
}
