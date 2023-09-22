import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { userRoutes } from './user.routes';
import { UserComponent } from './components/user.component';
import { UserFormComponent } from './components/form/user.form.component';
import { UserDetailComponent } from './components/detail/user.detail.component';
import { UserService } from './services/service-api/user.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TeamMappingComponent } from './components/team-mapping/team.mapping.component';
import { TeamService } from '../team/services/service-api/team.service';


@NgModule( {
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild( userRoutes ),
        NgbModule,
        NgMultiSelectDropDownModule
    ],
    declarations: [
        UserComponent,
        UserFormComponent,
        UserDetailComponent,
        TeamMappingComponent
    ],
    entryComponents: [ UserFormComponent, TeamMappingComponent ],
    providers: [
        UserService,
        NgbActiveModal,
        TeamService
    ]
} )

export class UserModule { }