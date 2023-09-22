import { Component, OnInit, Output } from '@angular/core';
import { Organization } from '../../services/domain/organization.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationService } from '../../services/service-api/organization.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBaseClass } from '../../../../shared/form.base.class';

@Component({
    selector: 'app-organization-form',
    templateUrl: './organization.form.component.html'
})


export class OrganizationFormComponent extends FormBaseClass implements OnInit {

    @Output() onSave = new EventEmitter<boolean>();

    organizationForm: FormGroup;

    modalHeader: string;
    modalActionButton: string;
    organizationId: number = null;
    gitDirectoryList: any;
    dataLoading: boolean;

    constructor(
        private fb: FormBuilder,
        private organizationService: OrganizationService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
    ) { super(); }

    ngOnInit() {
        this.dataLoading = true;
        this.getGitHubOrganizations();
    }

    createOrganizationForm() {
        this.modalHeader = 'Create new organization';
        this.modalActionButton = 'Create';
        this.initForm(new Organization());

    }

    getGitHubOrganizations() {
        this.organizationService.getGitDirectoryList().subscribe(
            data => {
                this.gitDirectoryList = data['data'];
                this.dataLoading = false;
            }
        );
    }

    createOrganizationFormBySuperAdmin(companyId) {
        this.modalHeader = 'Create new organization';
        this.modalActionButton = 'Create';
        let org =  new Organization();
        org.companyId = companyId;
        this.initFormBySuperAdmin(org);
    }

    editOrganizationForm(selectedOrganization) {
        this.modalHeader = 'Edit Organization';
        this.modalActionButton = 'Update';
        this.organizationId = selectedOrganization.id;
        this.initForm(selectedOrganization);
    }

    initForm(formData) {
        formData = formData ? formData : new Organization();
        this.organizationForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            description: [formData.description],
            gitDirectory: [formData.gitDirectory]

        });
    }

    initFormBySuperAdmin(formData) {
        formData = formData ? formData : new Organization();

        this.organizationForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            description: [formData.description],
            companyId: [formData.companyId]
        });
    }

    submit() {

        this.markFormGroupasTouchedandDirty(this.organizationForm);

        if (this.formInvalid()) { return; }

        const newOrganization = this.organizationForm.value;

        if (this.organizationId) {
            this.updateOrganization(newOrganization);
        } else {
            this.createOrganization(newOrganization);
            console.log(newOrganization);
        }
    }

    formInvalid() {
        return this.organizationForm.invalid;
    }

    createOrganization(newOrganization) {
        this.organizationService.createOrganization(newOrganization).subscribe(
            data => {
                this.toastr.success(data['message'], 'Organization Created');
                this.onSave.emit(true);
            }
        );
    }

    updateOrganization(newOrganization) {
        this.organizationService.updateOrganization(newOrganization).subscribe(
            data => {
                this.toastr.success(data['message'], 'Organization Updated');
                this.onSave.emit(true);
            }
        );
    }
}
