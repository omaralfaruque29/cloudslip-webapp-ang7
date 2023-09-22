import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VpcComponent } from './components/vpc.component';
import { VpcFormComponent } from './components/form/vpc.form.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import { VpcRoutes } from './vpc.routes';
import { TeamService } from '../team/services/service-api/team.service';
import { MatStepperModule } from '@angular/material/stepper';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {CreateVpcComponent} from "./components/create/vpc.create.component";
import {Ng5SliderModule} from "ng5-slider";
import {VpcDetailComponent} from "./components/detail/vpc.detail.component";
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(VpcRoutes),
        NgbModule,
        MatStepperModule,
        NgMultiSelectDropDownModule,
        Ng5SliderModule,
        NgxEchartsModule
    ],
    declarations: [
        VpcComponent,
        VpcFormComponent,
        CreateVpcComponent,
        VpcDetailComponent
    ],
    entryComponents: [VpcFormComponent],
    providers: [
        NgbActiveModal,
        TeamService,
    ]
})

export class VpcModule { }
