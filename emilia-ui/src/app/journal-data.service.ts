import { Injectable } from '@angular/core';

@Injectable()
export class JournalDataService {
  public journalData: any = {};

  constructor() { }

  // Set data by a key
  setData(key: string, data: any) {
    this.journalData[key] = data;
  }

  // Get data by key and optionally find a sub key
  getData(key: string, ...subKeys: any[]) {
    // Is the key set?
    if (this.journalData[key]) {
      // Do we need to find a sub key?
      if (subKeys && subKeys.length) {
        let returnData = this.journalData[key];

        // Loop wanted sub keys
        for (let i = 0; i < subKeys.length; i++) {
          if (typeof returnData[subKeys[i]] !== 'undefined') {
            returnData = returnData[subKeys[i]];
          } else {
            return null;
          }
        }

        return returnData;
      } else {
        return this.journalData[key];
      }
    }

    return null;
  }
}
