import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CurrentUserService } from '../../services/current-user.service';
import { FacadeDataService } from '../../services/facade.data.service';
import { Observable } from 'rxjs';
import { FormBaseClass } from '../../shared/form.base.class';

@Component({
  selector: 'app-reset-default-credentials',
  templateUrl: './reset-default-credentials.html',
  styleUrls: ['./reset-default-credentials.css']
})
export class ResetDefaultCredentialsComponent extends FormBaseClass implements OnInit {
  resetPasswordForm: FormGroup;
  passwordMatchChecker = false;
  confirmPassword = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private facadeDataService: FacadeDataService,
    private currentUserService: CurrentUserService,
    private toastr: ToastrService) { super(); }

  ngOnInit() {
    this.initNewPasswordForm();
  }

  initNewPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    this.markFormGroupasTouchedandDirty(this.resetPasswordForm);

    if (this.passwordMatchChecker || this.formInvalid()) {
      return;
    }

    const passwordBody = this.resetPasswordForm.value;
    this.resetDefaultPassword(passwordBody).subscribe(
      user => {
        this.toastr.success(user['message'], 'Credentials Changed');
        this.currentUserService.save(user.data);
        this.router.navigate(['/auth/login']);
      }
    );
  }

  resetDefaultPassword(passwordBody): Observable<any> {
    return this.facadeDataService.put('api/auth/change-password', passwordBody);
  }


  matchPassword() {
    if (this.resetPasswordForm.controls.newPassword.value.includes(this.confirmPassword, 0)) {
      this.passwordMatchChecker = false;
    } else {
      this.passwordMatchChecker = true;
    }
  }

  formInvalid() {
    return this.resetPasswordForm.invalid;
  }

}
