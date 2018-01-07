import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  set(dataKey: string, storageData: any) {
    localStorage.setItem(dataKey, storageData);
  }

  get(dataKey: string, defaultValue?: any) {
    const storageData = localStorage.getItem(dataKey);
    if (storageData === null && typeof defaultValue !== 'undefined') {
      return defaultValue;
    }

    return storageData;
  }

  remove(dataKey: string) {
    localStorage.removeItem(dataKey);
  }
}
