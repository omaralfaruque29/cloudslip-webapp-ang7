import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';

import { SloppyTigerSharedModule } from '../../../../shared/sloppy-tiger.shared.module';
import { ApplicationDetailComponent } from './components/detail/application.detail.component';
import { ApplicationCommitStateComponent } from './components/commit-state/commit.state.component';
import { ApplicationPipelineSetupComponent } from './components/pipeline-setup/pipeline.setup.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StepSuccessorUpdateComponent } from './components/step-successor-update/step.successor.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { ApplicationSharedModule } from '../application.shared.module';
import {SetChecklistComponent} from "./components/check-list/set-checklist.component";
import {AppSecretComponent} from "./components/app-secret/components/app-secret.component";
import {AppSecretService} from "./components/app-secret/services/service-api/app-secret.service";
import {AppSecretFormComponent} from "./components/app-secret/components/form/app-secret.form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";

export const ApplicationDetailRoutes: Routes = [{
    path: '', component: ApplicationDetailComponent,
}
];

@NgModule({
    imports: [
        RoundProgressModule,
        SloppyTigerSharedModule,
        ApplicationSharedModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(ApplicationDetailRoutes),
        NgbModule,
        NgMultiSelectDropDownModule,
        ContextMenuModule.forRoot(),
    ],
    declarations: [
        ApplicationDetailComponent,
        ApplicationCommitStateComponent,
        ApplicationPipelineSetupComponent,
        StepSuccessorUpdateComponent,
        SetChecklistComponent,
        AppSecretComponent,
        AppSecretFormComponent
    ],
    entryComponents: [StepSuccessorUpdateComponent, SetChecklistComponent,AppSecretFormComponent],
    providers: [
        AppSecretService,
        NgbActiveModal,
        ReactiveFormsModule
    ]
})

export class ApplicationDetailModule { }
