import { NgModule } from '@angular/core';
import { SloppyTigerSharedModule } from '../../../../shared/sloppy-tiger.shared.module';
import { ApplicationFormComponent } from './components/application.form.component';
import { ApplicationDetailFormComponent } from './components/application-detail-form/application.detail.form.component';
import { MatStepperModule, MatCardModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ApplicationFormRoutes } from './application.form.routes';
import { IngressConfigurationComponent } from './components/ingress-configuration/ingress.configuration.form.component';
import { ApplicationSharedModule } from '../application.shared.module';
import { TitleCasePipe } from '@angular/common';


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        ApplicationSharedModule,
        MatStepperModule,
        RouterModule.forChild(ApplicationFormRoutes),
        
    ],
    declarations: [
        ApplicationFormComponent,
        ApplicationDetailFormComponent,
        IngressConfigurationComponent,
    ],
    providers:[TitleCasePipe]
})

export class ApplicationFormModule {

}
