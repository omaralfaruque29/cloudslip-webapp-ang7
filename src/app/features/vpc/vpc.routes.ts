import { Routes } from '@angular/router';
import { VpcComponent } from './components/vpc.component';
import {CreateVpcComponent} from "./components/create/vpc.create.component";
import {VpcDetailComponent} from "./components/detail/vpc.detail.component";


export const VpcRoutes: Routes = [{
    path: '', component: VpcComponent,
    },
    {
        path: 'create', component: CreateVpcComponent

    },
    {
        path: 'detail/:id', component: VpcDetailComponent

    }
];
