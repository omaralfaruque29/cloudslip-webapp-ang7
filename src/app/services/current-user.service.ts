import { LocalStorageService } from 'ngx-webstorage';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CurrentUserService {

  private userIdentity: any;
  private authenticationState = new Subject<any>();

  constructor(private $localStorage: LocalStorageService) {}

  get() {
    const currentUser = this.$localStorage.retrieve('currentUser');
    return currentUser;
  }

  save(user) {
    this.$localStorage.store('currentUser', user);
    this.authenticate(user);
  }

  clear() {
    this.$localStorage.clear('currentUser');
    this.authenticate(null);
  }

  authenticate(identity) {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[]): boolean {
    const currentUser = this.get();
    if (currentUser === undefined || currentUser === null || currentUser.token === undefined || currentUser.token == null) {
      return false;
    } else if (authorities.some(r => currentUser.authorities.includes(r))) {
      return true;
    }
    return false;
  }

  hasAuthority(authority: string): boolean {
    const currentUser = this.get();
    if (currentUser === undefined || currentUser === null || currentUser.token === undefined || currentUser.token == null) {
      return false;
    } else if (currentUser.authorities.includes(authority)) {
      return true;
    }
    return false;
  }

  public isAuthenticated(): boolean {
    const currentUser = this.$localStorage.retrieve('currentUser');
    if (currentUser === undefined || currentUser === null || currentUser.token === undefined || currentUser.token == null) {
      return false;
    }
    return true;
  }

  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }
}
