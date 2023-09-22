import { Component, Output, ViewChild } from '@angular/core';
import { Company } from '../../services/domain/company.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from '../../services/service-api/company.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBaseClass } from '../../../../shared/form.base.class';
import { CompanyFormTemplateComponent } from './form-template/company.form.template.component';

@Component({
    selector: 'app-company-form',
    templateUrl: './company.form.component.html'
})


export class CompanyFormComponent extends FormBaseClass {

    @Output() onSave = new EventEmitter<boolean>();

    @ViewChild('formTemplate') companyFormTempateComponent: CompanyFormTemplateComponent;


    modalHeader: string;

    constructor(
        public activeModal: NgbActiveModal,
    ) {
        super();
    }

    createCompanyForm() {
        this.modalHeader = 'Create new company';
        this.companyFormTempateComponent.modalActionButton = 'Create';
        this.companyFormTempateComponent.initForm(new Company());
    }

    editCompanyForm(selectedCompany) {
        this.modalHeader = 'Edit company';
        this.companyFormTempateComponent.modalActionButton = 'Update';
        this.companyFormTempateComponent.companyId = selectedCompany.id;
        this.companyFormTempateComponent.initForm(selectedCompany);
    }

    save() {
        this.onSave.emit(true);
    }

    submit() {
        this.companyFormTempateComponent.submit();
    }
}
