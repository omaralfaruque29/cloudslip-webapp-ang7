import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(private currentUser: CurrentUserService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const validRoles = route.data['authorities'];
    const token = localStorage.getItem('token');

    const currentUser = this.currentUser.get();

    if (!this.currentUser.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    } else if (!validRoles.some(r => currentUser.authorities.includes(r))) {
      this.router.navigate(['/auth/403']);
      return false;
    }
    else if (this.currentUser.isAuthenticated() && currentUser.needToResetPassword) {
      this.router.navigate(['/auth/reset-credentials']);
      return false;
    }
    // else if (this.currentUser.isAuthenticated() && currentUser.initialSettingStatus !== 'PENDING') {
    //   this.router.navigate(['']);
    //   return false;
    // }
    return true;
  }
}
