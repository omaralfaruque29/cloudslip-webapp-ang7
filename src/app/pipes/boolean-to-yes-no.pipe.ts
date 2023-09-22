import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo'
})

export class BooleanToYesNoPipe implements PipeTransform {
  transform(value: boolean): string {
    if (value === true) {
        return "Yes";
    } else {
        return "No";
    }
  }
}
