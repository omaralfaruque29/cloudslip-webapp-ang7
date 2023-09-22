import { CompanyComponent } from "./components/company.component";
import { Routes } from '@angular/router';
import { CompanyDetailComponent } from './components/detail/company.detail.component';

export const companyRoutes: Routes = [
    {
        path: '', component: CompanyComponent,
    },
    {
        path: 'detail/:id', component: CompanyDetailComponent

    }]