import { NgModule } from "@angular/core";
import { AutoScalingConfigFormComponent } from './form/components/auto-scaling-form/auto.scaling.form.component';
import { ApplicationResourceConfigurationComponent } from './form/components/resource-configuration/resource.configuration.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MatExpansionModule } from '@angular/material';
import { SloppyTigerSharedModule } from '../../../shared/sloppy-tiger.shared.module';
import { ApplicationVPCMappingComponent } from './form/components/vpc-mapping/vpc.mapping.component';


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        Ng5SliderModule,
        MatExpansionModule    ],
    declarations: [
        AutoScalingConfigFormComponent,
        ApplicationResourceConfigurationComponent,
        ApplicationVPCMappingComponent
    ],
    exports: [
        AutoScalingConfigFormComponent,
        ApplicationResourceConfigurationComponent,
        ApplicationVPCMappingComponent
    ]
})


export class ApplicationSharedModule { }