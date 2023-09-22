import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { FacadeDataService } from "./services/facade.data.service";
import { CurrentUserService } from "./services/current-user.service";
import { HttpErrorResponse } from "@angular/common/http";
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  allowedRoutes = ["/auth/login", "/auth/register"];

  constructor(private facadeDataService: FacadeDataService,
    public currentUserService: CurrentUserService,
    private loadingBar: LoadingBarService,
    private router: Router) {
    // subscribing to routing event for showing spinner
    router.events.subscribe((event: RouterEvent) => { this.checkRouterEvent(event); });

  }

  checkRouterEvent(event: RouterEvent) {
    if (event instanceof NavigationStart) {
      // showing the spinner when the route change event starts
      this.loadingBar.start();
      //Do your code here.

      if (event.url === "/auth/login") {
        console.log(event.url);
      }
      if (!this.allowedRoutes.includes(event.url)) {
        this.facadeDataService.get('api/user/check-myself-if-active').subscribe(
          data => {
            if (!data) {
              this.currentUserService.save(null);
              this.router.navigate(['/auth/login']);
            }
          },
          err => {
            console.error(err);
            this.currentUserService.save(null);
            this.router.navigate(['/auth/login']);
          },
          () => {

          }
        )
      }
    }
    if (event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError) {
      this.loadingBar.complete();
    }
  }



}
