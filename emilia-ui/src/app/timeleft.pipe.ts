import { OnDestroy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';

@Pipe({
  name: 'timeleft',
  pure: false
})
export class TimeleftPipe implements PipeTransform, OnDestroy {
  private readonly async: AsyncPipe;

  private isDestroyed = false;
  private hasSeconds  = false;
  private value: any;
  private pastText: string;
  private timer: Observable<string>;

  constructor(ref: ChangeDetectorRef) {
    this.async = new AsyncPipe(ref);
  }

  transform(timestamp: number, pastText?: string): any {
    this.value = timestamp;
    this.pastText = pastText || 'Past';

    if (!this.timer) {
      this.timer = this.getObservable();
    }

    return this.async.transform(this.timer);
  }

  ngOnDestroy() {
    this.isDestroyed = true;
  }

  getObservable() {
    return Observable
      .of(1)
      .repeatWhen(notifications => {
        // for each next raised by the source sequence, map it to the result of the returned observable
        return notifications.flatMap(() => {
          const sleep = this.hasSeconds ? 1000 : 5000;
          return Observable.timer(sleep);
        });
      })
      .takeWhile(_ => !this.isDestroyed)
      .map((x, i) => this.getTimeDiff());
  }

  getTimeDiff() {
    const currentTimestamp = Date.now();
    const timestamp = this.value;

    this.hasSeconds = false;

    if (timestamp <= currentTimestamp) {
      this.isDestroyed = true;
      return this.pastText;
    } else {
      const formatted = [];
      let timeDelta = Math.floor((timestamp - currentTimestamp) / 1000);

      if (timeDelta >= 3600) {
        formatted.push(Math.floor(timeDelta / 3600) + 'H');
        timeDelta = timeDelta % 3600;
      }

      if (timeDelta >= 60) {
        formatted.push(Math.floor(timeDelta / 60) + 'M');
        timeDelta = timeDelta % 60;
      }

      if (timeDelta > 0 && formatted.length < 2) {
        this.hasSeconds = true;
        formatted.push(Math.floor(timeDelta) + 'S');
      }

      return formatted.join(' ');
    }
  }
}
