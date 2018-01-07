import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';

@Component({
  selector: 'app-elite-location',
  templateUrl: './elite-location.component.html'
})
export class EliteLocationComponent implements OnInit {
  location = {};

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService
  ) {}

  ngOnInit() {
    this.update();

    this.journalSocket.event('location').subscribe(data => {
      this.update();
    });
  }

  update() {
    const location = this.journalData.getData('location');
    if (location) {
      this.location = location;
    } else {
      this.location = {};
    }
  }
}
