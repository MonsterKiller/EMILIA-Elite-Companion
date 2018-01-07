import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';

@Component({
  selector: 'app-elite-ship-name',
  template: '{{ shipName }}'
})
export class EliteShipNameComponent implements OnInit {
  shipName = 'Unknown';

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService
  ) {}

  ngOnInit() {
    this.update();

    this.journalSocket.event('ship').subscribe(data => {
      this.update();
    });
  }

  update() {
    const shipInfo = this.journalData.getData('ship');
    if (shipInfo && shipInfo.name) {
      this.shipName = shipInfo.name;
    } else if (shipInfo && shipInfo.type) {
      this.shipName = shipInfo.type;
    } else {
      this.shipName = 'Unknown';
    }
  }
}
