import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoaderInterceptor } from './loader.interceptor';
import { ErrorInterceptor } from './error.interceptor';


export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];
