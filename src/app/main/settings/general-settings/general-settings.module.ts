import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../../shared/sloppy-tiger.shared.module';
import {GeneralSettingsService} from "./services/service-api/general-settings.service";
import {GeneralSettingsComponent} from "./components/general-settings.component";
import {generalSettingsRoutes} from "./general-settings.routes";


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(generalSettingsRoutes),
        NgbAccordionModule,
        NgbModule
    ],
    declarations: [
        GeneralSettingsComponent
    ],
    entryComponents: [ GeneralSettingsComponent ],
    providers: [
        GeneralSettingsService,
        NgbActiveModal
    ]
})

export class GeneralSettingsModule {}
