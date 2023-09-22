import { Routes } from '@angular/router';

import {OrganizationComponent} from './components/organization.component';
import {OrganizationDetailComponent} from './components/detail/organization.detail.component';

export const OrganizationRoutes: Routes = [{
    path: '', component: OrganizationComponent,
    },
    {
        path: 'detail/:id', component: OrganizationDetailComponent

    }
];
