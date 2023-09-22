import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Company } from '../../../services/domain/company.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/service-api/company.service';
import { ToastrService } from 'ngx-toastr';
import { FormBaseClass } from '../../../../../shared/form.base.class';
import { AlertService } from '../../../../../shared/services/alert.service';



@Component({
    selector: 'app-company-form-template',
    templateUrl: './company.form.template.component.html'
})

export class CompanyFormTemplateComponent extends FormBaseClass implements OnInit {


    companyForm: FormGroup;
    companyId: number = null;
    modalActionButton: string;
    fromRegister = false;
    confirmPassword = '';
    passwordMatchChecker = false;

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private companyService: CompanyService,
        private alertService: AlertService,
    ) { super(); }

    ngOnInit(): void {
        this.initForm(new Company());
    }

    initForm(formData: Company) {
        formData = formData ? formData : new Company();

        this.companyForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            businessEmail: [formData.businessEmail, [Validators.required]],
            adminEmail: [formData.adminEmail],
            password: [formData.password, [Validators.required, Validators.minLength(8)]],
            website: [formData.website],
            address: [formData.address],
            phoneNo: [formData.phoneNo]
        });
    }

    submit() {

        this.removeAdminEmailonEdit();
        this.markFormGroupasTouchedandDirty(this.companyForm);

        if (this.formInvalid()) { return; }

        const newCompnay = this.companyForm.value;
        if (this.modalActionButton === 'Create') {
            newCompnay.adminEmail = this.companyForm.controls.businessEmail.value;
        }
        if (this.fromRegister) {
            this.registerCompany(newCompnay);
        }

        else {
            if (this.companyId) {
                this.updateCompany(newCompnay);
            }
            else {
                this.createCompany(newCompnay);
            }
        }
    }

    removeAdminEmailonEdit() {
        if (this.companyId) {
            this.companyForm.removeControl('adminEmail');
            this.companyForm.updateValueAndValidity();
        }
    }

    formInvalid() {
        return this.companyForm.invalid;
    }

    createCompany(newCompnay) {
        this.companyService.createCompany(newCompnay).subscribe(
            data => {
                this.alertService.sendAlert(data);
                if (data.status === 'success') {
                    this.onSave.emit(true);
                }
            }
        );
    }

    updateCompany(newCompnay) {
        this.companyService.updateCompany(newCompnay).subscribe(
            data => {
                this.alertService.sendAlert(data);
                if (data.status === 'success') {

                    this.onSave.emit(true);
                }
            }
        );
    }

    registerCompany(newCompnay) {
        this.companyService.registerCompany(newCompnay).subscribe(
            data => {
                this.alertService.sendAlert(data);
                if (data.status === 'success') {
                    this.onSave.emit(true);
                }
            }
        );
    }

    matchPassword() {
        if (this.companyForm.controls.password.value.includes(this.confirmPassword, 0)) {
            this.passwordMatchChecker = false;
        } else {
            this.passwordMatchChecker = true;
        }
    }
}
