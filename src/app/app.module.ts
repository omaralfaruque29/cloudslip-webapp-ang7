import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { LightboxModule } from 'ngx-lightbox';
import { FullCalendarModule } from 'ng-fullcalendar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import * as $ from 'jquery';
import { FacadeDataService } from "./services/facade.data.service";
import { LocalStorageService } from "ngx-webstorage";
import { CurrentUserService } from "./services/current-user.service";
import { RoleGuardService } from "./services/role-guard.service";
import { HttpClientModule } from "@angular/common/http";
import { httpInterceptorProviders } from './core/interceptors';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { Ng5SliderModule } from "ng5-slider";

@NgModule({
    declarations: [
        AppComponent
        ],
    imports: [
        BrowserModule,
        routing,
        NgbModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        RichTextEditorAllModule,
        LightboxModule,
        FullCalendarModule,
        NgMultiSelectDropDownModule.forRoot(),
        HttpClientModule,
        LoadingBarModule,
        Ng5SliderModule,
   ],
    providers: [
        FacadeDataService,
        LocalStorageService,
        CurrentUserService,
        RoleGuardService,
        httpInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
