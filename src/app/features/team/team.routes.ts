import { Routes } from '@angular/router';
import { TeamComponent } from './components/team.component';
import { TeamDetailComponent } from './components/detail/team.detail.component';
import { TeamResolverService } from './services/service-api/team.resolver.service';

export const teamRoutes: Routes = [
    {
        path: '', component: TeamComponent
    },
    {
        path: 'detail/:id', resolve: { teamData: TeamResolverService }, component: TeamDetailComponent

    }]