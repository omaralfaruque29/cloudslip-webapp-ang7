import { Routes } from '@angular/router';
import { UserComponent } from './components/user.component';
import { UserDetailComponent } from './components/detail/user.detail.component';

export const userRoutes: Routes = [
    {
        path: '', component: UserComponent,
    },
    {
        path: 'detail/:id', component: UserDetailComponent

    } ]