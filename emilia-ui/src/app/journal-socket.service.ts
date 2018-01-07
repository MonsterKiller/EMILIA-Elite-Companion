import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { JournalDataService } from './journal-data.service';

@Injectable()
export class JournalSocketService {

  constructor(
    private socket: Socket,
    private journalData: JournalDataService
  ) {}

  // Open websocket connection
  connect() {
    // Listen for journal events
    this.socket.on('journalEvent', (data => {
      console.log('JournalSocketService -> Event "' + data.event + '"', data);
      if (data.event && data.payload) {
        // Store the data
        this.journalData.setData(data.event, data.payload);
      }
    }));

    // Listen for connect/disconnect events
    this.socket.on('connect', () => {
      console.log('JournalSocketService -> connected');
    });
    this.socket.on('disconnect', () => {
      console.log('JournalSocketService -> disconnect');
    });

    // Open the websocket connection
    this.socket.connect();
  }

  // Allow subscribing to certain events
  // Event type can be a string or array
  event(...eventType: any[]) {
    // Convert event type(s) to an array
    let eventTypes = [];
    if (typeof eventType === 'object') {
      eventTypes = [...eventTypes, ...eventType];
    } else {
      eventTypes.push(eventType);
    }

    // Return an observable
    return this.socket
      .fromEvent('journalEvent')
      .filter(function (data: any) {
        // Filter out unwanted events
        return Object.keys(data).includes('event') && (eventTypes.indexOf('*') > -1 || eventTypes.indexOf(data.event) > -1);
      })
      .map(data => data.payload);
  }
}
