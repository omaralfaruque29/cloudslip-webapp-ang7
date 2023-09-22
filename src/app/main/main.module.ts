import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainRoutes } from './main.routes';
import { MainComponent } from './main.component';
import { SloppyTigerSharedModule } from '../shared/sloppy-tiger.shared.module';
import { LayoutModule } from '../layout/layout.module';
import {FormatMemoryPipe} from "../pipes/format-memory.pipe";
import { OnboardingComponent } from './onboarding/components/onboarding.component';

@NgModule( {
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild( MainRoutes ),
        LayoutModule
    ],
    declarations: [
        MainComponent
    ]
} )

export class MainModule { }