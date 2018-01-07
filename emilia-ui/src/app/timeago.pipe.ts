import { OnDestroy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';

@Pipe({
  name: 'timeago',
  pure: false
})
export class TimeagoPipe implements PipeTransform, OnDestroy {
  private readonly async: AsyncPipe;

  private isDestroyed = false;
  private hasSeconds  = true;
  private value: any;
  private timer: Observable<string>;

  constructor(ref: ChangeDetectorRef) {
    this.async = new AsyncPipe(ref);
  }

  transform(timestamp: number): any {
    this.value = timestamp;

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

    if (timestamp >= currentTimestamp) {
      return 'Now';
    } else {
      let formatted = null;
      let timeDelta = Math.floor((currentTimestamp - timestamp) / 1000);

      if (timeDelta >= 3600) {
        this.hasSeconds = false;
        formatted = Math.floor(timeDelta / 3600) + 'H';
        timeDelta = timeDelta % 3600;
      }

      if (timeDelta >= 60 && !formatted) {
        this.hasSeconds = false;
        formatted = Math.floor(timeDelta / 60) + 'M';
        timeDelta = timeDelta % 60;
      }

      if (timeDelta > 0 && !formatted) {
        this.hasSeconds = true;
        formatted = Math.floor(timeDelta) + 'S';
      }

      return formatted || '';
    }
  }
}
