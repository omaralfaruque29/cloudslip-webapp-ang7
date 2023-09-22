import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAuthorityList'
})

export class FormatAuthorityList implements PipeTransform {
  transform(authorities: any): string {
      let authoritiesStr = "";
      if (authorities != null && authorities.length > 0) {
          for (let i = 0; i < authorities.length; i++) {
              authoritiesStr += this.jsUcfirst(authorities[i].substring(5).toLowerCase()) + "    ";
          }
      }
      return authoritiesStr;
  }

    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}