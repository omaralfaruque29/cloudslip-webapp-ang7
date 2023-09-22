import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMemory'
})

export class FormatMemoryPipe implements PipeTransform {
  transform(memory: number): string {
    let unit = " MB";
    if (memory > 1024) {
        unit = " GB";
        memory = memory / 1024;
        if (memory > 1024) {
            unit = " TB";
            memory = memory / 1024;
        }
    }
    return memory.toFixed(2) + unit;
  }
}
