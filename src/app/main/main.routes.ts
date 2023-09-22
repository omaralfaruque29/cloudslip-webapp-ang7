import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import {RoleGuardService as RoleGuard} from '../services/role-guard.service';

export const MainRoutes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'application' },
            {
                path: 'company',
                loadChildren: '../features/company/company.module#CompanyModule',
                data: {
                    title: ':: SloppyTiger :: Company ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS', 'ROLE_SUPER_ADMIN']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'team',
                loadChildren: '../features/team/team.module#TeamModule',
                data: {
                    title: ':: SloppyTiger :: Team ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'user',
                loadChildren: '../features/user/user.module#UserModule',
                data: {
                    title: ':: SloppyTiger :: User ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS', 'ROLE_SUPER_ADMIN']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'messages',
                loadChildren: './messages/messages.module#MessagesModule',
                data: {
                    title: ':: SloppyTiger :: Message ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'organization',
                loadChildren: '../features/organization/organization.module#OrganizationModule',
                data: {
                    title: ':: SloppyTiger :: Organization ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'general-settings',
                loadChildren: './settings/general-settings/general-settings.module#GeneralSettingsModule',
                data: {
                    title: ':: SloppyTiger :: General Settings ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            /*{
                path: 'environment-settings',
                loadChildren: './settings/environment-settings/environment-settings.module#EnvironmentSettingsModule',
                data: {
                    title: ':: SloppyTiger :: Environment Settings ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },*/
            {

                path: 'application',
                loadChildren: '../features/application/application.module#ApplicationModule',
                data: {
                    title: ':: SloppyTiger :: Application ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS', 'ROLE_SUPER_ADMIN']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'websocket-test',
                loadChildren: './websocket-test/websocket-test.module#WebsocketTestModule',
                data: {
                    title: ':: SloppyTiger :: Web-Socket Test ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'notification',
                loadChildren: '../features/notification/notification.module#NotificationModule',
                data: {
                    title: ':: SloppyTiger :: Notification ::',
                    authorities: ['ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'environment-options',
                loadChildren: './settings/environment-options/environment-option.module#EnvironmentOptionModule',
                data: {
                    title: ':: SloppyTiger :: Environment Options ::',
                    authorities: ['ROLE_SUPER_ADMIN']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'kube-clusters',
                loadChildren: './settings/kube-clusters/kube-cluster.module#KubeClusterModule',
                data: {
                    title: ':: SloppyTiger :: Kube Clusters ::',
                    authorities: ['ROLE_SUPER_ADMIN']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'vpc',
                loadChildren: '../features/vpc/vpc.module#VpcModule',
                data: {
                    title: ':: SloppyTiger :: VPC ::',
                    authorities: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_DEV', 'ROLE_OPS']
                },
                canActivate: [RoleGuard]
            },
            {
                path: 'regions',
                loadChildren: './settings/regions/region.module#RegionModule',
                data: {
                    title: ':: SloppyTiger :: Regions ::',
                    authorities: ['ROLE_SUPER_ADMIN']
                },
                canActivate: [RoleGuard]
            }

        ]
    }
];
