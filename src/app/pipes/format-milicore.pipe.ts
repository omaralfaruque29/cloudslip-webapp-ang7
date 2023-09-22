import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMilliCore'
})

export class FormatMilliCorePipe implements PipeTransform {
  transform(cpu: number): string {
    cpu = cpu / 1000;
    return cpu.toFixed(2);
  }
}
