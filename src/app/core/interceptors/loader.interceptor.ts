import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(private loadingBar: LoadingBarService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.loadingBar.start();

        return next.handle(req).pipe(
            finalize(() => {
                this.loadingBar.complete();
            })
        );
    }
}
