import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CurrentUserService } from "../../services/current-user.service";
import { FacadeDataService } from "../../services/facade.data.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public form: FormGroup;
    public invalidCredential: boolean;
    public errorMessage: string;
    constructor(
        private fb: FormBuilder, private router: Router,
        public currentUserService: CurrentUserService,
        private facadeDataService: FacadeDataService) { }

    ngOnInit() {
        if (this.currentUserService.get() !== undefined && this.currentUserService.get() != null) {
            this.router.navigate(['/']);
        }
        this.form = this.fb.group({
            username: [null, Validators.compose([Validators.required])], password: [null, Validators.compose([Validators.required])]
        });
        this.invalidCredential = false;
        this.errorMessage = "Invalid Credentials!";
    }

    onSubmit() {
        const body = { username: this.form.value['username'], password: this.form.value['password'] };

        this.facadeDataService.post('api/auth/login', body).subscribe(
            data => {
                console.log(data);
                if (data['token'] && data['token'] != null) {
                    this.invalidCredential = false;
                    data['user']['token'] = data['token'];
                    this.currentUserService.save(data['user']);
                    if (data['user']['initialSettingStatus'] && data['user']['initialSettingStatus'] === 'PENDING') {
                        // === 'PENDING'
                        this.router.navigate(['/onboarding']);
                    } else {
                        this.router.navigate(['/']);
                    }
                } else {
                    this.invalidCredential = true;
                }
            },
            err => {
                console.error(err);
                this.invalidCredential = true;
            },
            () => {

            }
        );
    }
}
