import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrganizationRoutes } from './organization.routes';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {OrganizationComponent} from './components/organization.component';
import { OrganizationService } from './services/service-api/organization.service';
import { OrganizationFormComponent } from './components/form/organization.form.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { OrganizationDetailComponent } from './components/detail/organization.detail.component';


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(OrganizationRoutes),
        NgbAccordionModule,
        NgbModule
    ],
    declarations: [
        OrganizationComponent,
        // OrganizationFormComponent,
        OrganizationDetailComponent
    ],
    // entryComponents: [ OrganizationFormComponent ],
    providers: [
        OrganizationService,
        NgbActiveModal
    ]
})

export class OrganizationModule {}
