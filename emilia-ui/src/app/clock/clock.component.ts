import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-clock',
  template: '{{ currentDate | async | date:\'H:mm:ss\' }}'
})
export class ClockComponent implements OnInit {
  currentDate;
  constructor() { }

  ngOnInit() {
    this.currentDate = Observable
      .interval(1000)
      .map(() => new Date());
  }
}
