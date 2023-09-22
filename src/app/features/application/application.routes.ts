import { Routes } from '@angular/router';
import { ApplicationComponent } from './components/application.component';

export const ApplicationRoutes: Routes = [{
    path: '', component: ApplicationComponent,
},
{
    path: 'detail/:id', loadChildren: './modules/detail/application.detail.module#ApplicationDetailModule',
},
{
    path: 'create', loadChildren: './modules/form/application.form.module#ApplicationFormModule'
}
];
