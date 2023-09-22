import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyFormTemplateComponent } from '../../features/company/components/form/form-template/company.form.template.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    @ViewChild('companyFormTemplate') companyFormTemplateComponent: CompanyFormTemplateComponent;

    constructor(private router: Router) { }

    ngOnInit() {
        this.companyFormTemplateComponent.fromRegister = true;
        this.companyFormTemplateComponent.modalActionButton = 'Create';

    }

    submit() {
        this.companyFormTemplateComponent.submit();
    }

    onSave() {
        this.router.navigate(['/auth/login']);
    }

}
