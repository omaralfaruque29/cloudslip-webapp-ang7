import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth/auth.component';
import { routing } from './auth.routing';
import { RegisterComponent } from './register/register.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenErrorComponent } from './forbidden-error/forbidden-error.component';
import { IsErrorComponent } from './is-error/is-error.component';
import { TryLaterComponent } from './try-later/try-later.component';
import { PagesModule } from '../pages/pages.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetDefaultCredentialsComponent } from './reset-default-credentials/reset-default-credentials';
import { SloppyTigerSharedModule } from '../shared/sloppy-tiger.shared.module';

@NgModule({
    declarations: [
        LoginComponent,
        AuthComponent,
        RegisterComponent,
        LockscreenComponent,
        ForgotPasswordComponent,
        NotFoundComponent,
        ForbiddenErrorComponent,
        IsErrorComponent,
        TryLaterComponent,
        ResetDefaultCredentialsComponent],
    imports: [
        CommonModule,
        routing,
        PagesModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SloppyTigerSharedModule
    ],
})
export class AuthModule { }
