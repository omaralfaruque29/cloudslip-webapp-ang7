import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationComponent } from './components/application.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { ApplicationRoutes } from './application.routes';
import { TeamService } from '../team/services/service-api/team.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(ApplicationRoutes),
        NgbModule,
        NgMultiSelectDropDownModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        ApplicationComponent,
    ],
    providers: [
        NgbActiveModal,
        TeamService,
    ]
})

export class ApplicationModule { }
