import { NgModule } from '@angular/core';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { RouterModule, Routes } from '@angular/router';
import { GitSetupFormComponent } from '../settings/general-settings/components/git-setup/git.setup.form.component';
import { OnboardingComponent } from './components/onboarding.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { GeneralSettingsService } from '../settings/general-settings/services/service-api/general-settings.service';
import { DockerSetupFormComponent } from '../settings/general-settings/components/docker-setup/docker.setup.form.component';

const route: Routes = [
    { path: '', component: OnboardingComponent }
]

@NgModule({
    imports: [
        SloppyTigerSharedModule,
        SlickCarouselModule,
        RouterModule.forChild(route)
    ],
    declarations: [
        OnboardingComponent,
        GitSetupFormComponent,
        DockerSetupFormComponent
    ],
    providers: [
        GeneralSettingsService
    ]
})

export class OnboardingModule { }
