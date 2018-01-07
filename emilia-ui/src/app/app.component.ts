import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from './journal-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private journalSocket: JournalSocketService) {}

  ngOnInit() {
    this.journalSocket.connect();
  }
}
