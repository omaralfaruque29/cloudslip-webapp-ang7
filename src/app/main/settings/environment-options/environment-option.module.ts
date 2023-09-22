import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../../shared/sloppy-tiger.shared.module';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {MatExpansionModule} from '@angular/material/expansion';
import {
    MatSelectModule, MatSliderModule,
} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRippleModule} from '@angular/material/core';
import {environmentOptionRoutes} from "./environment-option.routes";
import {EnvironmentOptionComponent} from "./components/environment-option.component";
import {EnvironmentOptionFormComponent} from "./components/form/environment-option.form.component";
import {EnvironmentOptionService} from "./services/service-api/environment-option.service";


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(environmentOptionRoutes),
        NgbAccordionModule,
        NgbModule,
        NgMultiSelectDropDownModule,
        MatExpansionModule,
        FormsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatRippleModule,
        MatSliderModule

    ],
    declarations: [
        EnvironmentOptionComponent,
        EnvironmentOptionFormComponent,
    ],
    entryComponents: [EnvironmentOptionFormComponent],
    providers: [
        EnvironmentOptionService,
        NgbActiveModal
    ]
})

export class EnvironmentOptionModule {}
