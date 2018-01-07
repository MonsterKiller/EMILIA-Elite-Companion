import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(inputArray: any[], orderKey: string, orderDirection?: string): any {
    // Order direction ASC or DESC
    if (!orderDirection) {
      orderDirection = 'asc';
    } else {
      orderDirection = orderDirection.toLowerCase();
    }

    // Ensure input is an object
    if (typeof inputArray === 'object') {
      // Order direction
      if (orderDirection === 'desc') {
        inputArray.sort((a, b) => {
          if (a[orderKey] < b[orderKey]) {
            return 1;
          }
          if (a[orderKey] > b[orderKey]) {
            return -1;
          }
          return 0;
        });
      } else {
        inputArray.sort((a, b) => {
          if (a[orderKey] < b[orderKey]) {
            return -1;
          }
          if (a[orderKey] > b[orderKey]) {
            return 1;
          }
          return 0;
        });
      }
    }

    return inputArray;
  }

}
