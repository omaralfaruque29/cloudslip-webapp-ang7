import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { TeamComponent } from './components/team.component';
import { TeamFormComponent } from './components/form/team.form.component';
import { TeamService } from './services/service-api/team.service';
import { teamRoutes } from './team.routes';
import { TeamDetailComponent } from './components/detail/team.detail.component';
import { TeamResolverService } from './services/service-api/team.resolver.service';


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(teamRoutes),
        NgbModule
    ],
    declarations: [
        TeamComponent,
        TeamFormComponent,
        TeamDetailComponent
    ],
    entryComponents: [TeamFormComponent],
    providers: [
        TeamService,
        TeamResolverService,
        NgbActiveModal
    ]
})

export class TeamModule { }