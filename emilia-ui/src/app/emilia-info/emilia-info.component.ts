import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';

@Component({
  selector: 'app-emilia-info',
  template: 'EMILIA - Last update: {{ lastUpdated | timeago }}'
})
export class EmiliaInfoComponent implements OnInit {
  lastUpdated = new Date();

  constructor(
    private journalSocket: JournalSocketService
  ) {}

  ngOnInit() {
    this.journalSocket.event('*').subscribe(data => {
      this.update();
    });
  }

  update() {
    this.lastUpdated = new Date();
  }
}
