import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';
import { SlimscrollCustomOptions } from '../slimscroll-custom-options';

@Component({
  selector: 'app-elite-missions',
  templateUrl: './elite-missions.component.html'
})
export class EliteMissionsComponent implements OnInit {
  missions = [];
  pendingRewards = 0;
  collectedRewards = 0;

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService,
    public slimscrollOptions: SlimscrollCustomOptions
  ) {}

  ngOnInit() {
    this.update();

    this.journalSocket.event('missions').subscribe(data => {
      this.update();
    });
  }

  update() {
    const missions = this.journalData.getData('missions');
    if (missions) {
      this.missions = missions.accepted || [];
      this.pendingRewards = (missions.acceptedRewards || 0).toLocaleString();
      this.collectedRewards = (missions.collectedRewards || 0).toLocaleString();
    } else {
      this.missions = [];
    }
  }

  trackByFn(index, item) {
    return index;
  }
}
