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
import {KubeClusterRoutes} from "./kube-cluster.routes";
import {KubeClusterComponent} from "./components/kube-cluster.component";
import {KubeClusterFormComponent} from "./components/form/kube-cluster.form.component";
import {KubeClusterService} from "./services/service-api/kube-cluster.service";
import {KubeClusterDetailComponent} from "./components/detail/kube-cluster.detail.component";
import {BooleanToYesNoPipe} from "../../../pipes/boolean-to-yes-no.pipe";
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(KubeClusterRoutes),
        NgbAccordionModule,
        NgbModule,
        NgMultiSelectDropDownModule,
        MatExpansionModule,
        FormsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatRippleModule,
        MatSliderModule,
        NgxEchartsModule
    ],
    declarations: [
        KubeClusterComponent,
        KubeClusterFormComponent,
        KubeClusterDetailComponent,
        BooleanToYesNoPipe
    ],
    entryComponents: [KubeClusterFormComponent],
    providers: [
        KubeClusterService,
        NgbActiveModal
    ]
})

export class KubeClusterModule {}
