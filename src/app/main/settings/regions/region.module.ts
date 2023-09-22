import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegionRoutes } from './region.routes';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RegionComponent} from './components/region.component';
import { RegionFormComponent } from './components/form/region.form.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {SloppyTigerSharedModule} from "../../../shared/sloppy-tiger.shared.module";
import {RegionService} from "./services/service-api/region.service";



@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(RegionRoutes),
        NgbAccordionModule,
        NgbModule
    ],
    declarations: [
        RegionComponent,
        RegionFormComponent,
    ],
    entryComponents: [ RegionFormComponent ],
    providers: [
        RegionService,
        NgbActiveModal
    ]
})

export class RegionModule {}
