import { Component, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EnvironmentOptionService} from "../../services/service-api/environment-option.service";
import {FormBaseClass} from "../../../../../shared/form.base.class";
import {EnvironmentOption} from "../../services/domain/environment-option.model";

@Component({
    selector: 'app-environment-option-form',
    templateUrl: './environment-option.form.component.html'
})


export class EnvironmentOptionFormComponent extends FormBaseClass implements OnInit {

    @Output() onSave = new EventEmitter<boolean>();

    environmentOptionForm: FormGroup;

    modalHeader: string;
    modalActionButton: string;
    organizationList = [{ name: 'Select a organization', id: null }];
    environmentOptionId: number = null;

    constructor(
        private fb: FormBuilder,
        private environmentOptionService: EnvironmentOptionService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
    ) { super(); }

    ngOnInit() {

    }

    createEnvironmentOptionForm() {
        this.modalHeader = 'Create new environmentOption';
        this.modalActionButton = 'Create';
        this.initForm(new EnvironmentOption());
    }

    editEnvironmentOptionForm(selectedenvironmentOption) {
        this.modalHeader = 'Edit environmentOption';
        this.modalActionButton = 'Update';
        this.environmentOptionId = selectedenvironmentOption.id;
        this.initForm(selectedenvironmentOption);
    }

    initForm(formData) {
        formData = formData ? formData : new EnvironmentOption();
        this.environmentOptionForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            shortName: [formData.shortName, [Validators.required]],
            description: [formData.description]
        });
    }


    submit() {
        this.removeAdminEmailonEdit();
        this.markFormGroupasTouchedandDirty(this.environmentOptionForm);

        if (this.formInvalid()) { return; }

        const newCompnay = this.environmentOptionForm.value;

        if (this.environmentOptionId) {
            this.updateEnvironmentOption(newCompnay);
        } else {
            this.createEnvironmentOption(newCompnay);
        }
    }

    removeAdminEmailonEdit() {
        if (this.environmentOptionId) {
            this.environmentOptionForm.removeControl('adminEmail');
            this.environmentOptionForm.updateValueAndValidity();
        }
    }

    formInvalid() {
        return this.environmentOptionForm.invalid;
    }

    createEnvironmentOption(newCompnay) {
        this.environmentOptionService.createEnvironmentOption(newCompnay).subscribe(
            data => {
                this.toastr.success(data['message'], 'environmentOption Created');
                this.onSave.emit(true);
            }
        );
    }

    updateEnvironmentOption(newCompnay) {
        this.environmentOptionService.updateEnvironmentOption(newCompnay).subscribe(
            data => {
                this.toastr.success(data['message'], 'environmentOption Updated');
                this.onSave.emit(true);
            }
        );
    }
}
