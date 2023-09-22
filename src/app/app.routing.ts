import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { RoleGuardService } from './services/role-guard.service';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' },
    { path: 'authentication', loadChildren: 'app/authentication/authentication.module#AuthenticationModule' },
    { path: 'auth', loadChildren: 'app/auth/auth.module#AuthModule' },
    {
        path: 'main', loadChildren: './main/main.module#MainModule', data: {
            title: ':: SloppyTiger :: Main ::'
        },
    },
    {
        path: 'onboarding',
        loadChildren: './main/onboarding/onboarding.module#OnboardingModule',
        data: {
            title: ':: SloppyTiger :: Onboarding ::',
            authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
        },
        canActivate: [RoleGuardService]
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled' });