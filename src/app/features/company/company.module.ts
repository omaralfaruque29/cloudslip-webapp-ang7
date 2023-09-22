import { NgModule } from "@angular/core";
import { CompanyComponent } from './components/company.component';
import { RouterModule } from '@angular/router';
import { companyRoutes } from './company.routes';
import { CompanyService } from './services/service-api/company.service';
import { CompanyFormComponent } from './components/form/company.form.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { CompanyDetailComponent } from './components/detail/company.detail.component';
import { OrganizationService } from "../organization/services/service-api/organization.service";
import { OrganizationFormComponent } from "../organization/components/form/organization.form.component";


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(companyRoutes),
        NgbModule
    ],
    declarations: [
        CompanyComponent,
        CompanyFormComponent,
        CompanyDetailComponent
    ],
    entryComponents: [CompanyFormComponent],
    providers: [
        // CompanyService,
        NgbActiveModal,
        OrganizationService
    ]
})

export class CompanyModule { }
