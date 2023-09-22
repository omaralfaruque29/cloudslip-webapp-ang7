import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../shared/services/alert.service';


@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(req).pipe(
            catchError(
                (error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${error.error.message}`;
                    }
                    else {
                        errorMessage = `Error Code: ${error.status}
                        Message: ${error.error.message}`;
                    }
                    this.alertService.sendAlert({ status: 'error', message: errorMessage });
                    return throwError(errorMessage);
                })
        );
    }
}
