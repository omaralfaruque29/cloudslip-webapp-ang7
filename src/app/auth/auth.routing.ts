import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenErrorComponent } from './forbidden-error/forbidden-error.component';
import { IsErrorComponent } from './is-error/is-error.component';
import { TryLaterComponent } from './try-later/try-later.component';
import { PageMaintananceComponent } from '../pages/page-maintanance/page-maintanance.component';
import { ResetDefaultCredentialsComponent } from './reset-default-credentials/reset-default-credentials';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, data: { title: 'Login :: Sloppy Tiger' } },
            { path: 'register', component: RegisterComponent, data: { title: 'Register :: Sloppy Tiger' } },
            { path: 'lockscreen', component: LockscreenComponent, data: { title: 'Lock Screen :: Sloppy Tiger' } },
            { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'Forgot Password :: Sloppy Tiger' } },
            { path: '404', component: NotFoundComponent, data: { title: '404 :: Sloppy Tiger' } },
            { path: '403', component: ForbiddenErrorComponent, data: { title: '403 :: Sloppy Tiger' } },
            { path: '500', component: IsErrorComponent, data: { title: '500 :: Sloppy Tiger' } },
            { path: '503', component: TryLaterComponent, data: { title: '503 :: Sloppy Tiger' } },
            { path: 'maintanance', component: PageMaintananceComponent, data: { title: 'maintanance :: Sloppy Tiger' } },
            { path: 'reset-credentials', component: ResetDefaultCredentialsComponent, data: { title: 'reset :: Sloppy Tiger' } }
        ]
    }
];

export const routing = RouterModule.forChild(routes);