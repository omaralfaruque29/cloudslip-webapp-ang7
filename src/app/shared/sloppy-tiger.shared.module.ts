import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationFormComponent } from '../features/organization/components/form/organization.form.component';
import { CompanyFormTemplateComponent } from '../features/company/components/form/form-template/company.form.template.component';
import { MatSlideToggleModule } from '@angular/material';
import {FormatMemoryPipe} from "../pipes/format-memory.pipe";
import {FormatMilliCorePipe} from "../pipes/format-milicore.pipe";
import {FormatAuthorityList} from "../pipes/format-authority-list";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule
    ],
    declarations: [
        OrganizationFormComponent,
        CompanyFormTemplateComponent,
        FormatMemoryPipe,
        FormatMilliCorePipe,
        FormatAuthorityList
    ],
    entryComponents: [
        OrganizationFormComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CompanyFormTemplateComponent,
        FormatMemoryPipe,
        FormatMilliCorePipe,
        FormatAuthorityList
    ]
})


export class SloppyTigerSharedModule { }