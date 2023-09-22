import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBaseClass } from '../../../../../shared/form.base.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SidebarService } from '../../../../../services/sidebar.service';
import { GeneralSettingsService } from '../../services/service-api/general-settings.service';
import { CurrentUserService } from '../../../../../services/current-user.service';
import { GitSettings } from '../../services/domain/general-settings.model';
import { AlertService } from '../../../../../shared/services/alert.service';

@Component({
    selector: 'app-git-setup',
    templateUrl: './git.setup.component.html'
})

export class GitSetupFormComponent extends FormBaseClass implements OnInit{
    @Output() onSave = new EventEmitter<boolean>();
    gitSettingsForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private sidebarService: SidebarService,
        private cdr: ChangeDetectorRef,
        private generalSettingsService: GeneralSettingsService,
        private alertService: AlertService,
        // private toast: ToastrService,
        // public activeModal: NgbActiveModal,
        private currentUserService: CurrentUserService
    ) { super(); }

    ngOnInit() {
        // this.sidebarVisible = true;
        // this.createGeneralSettingsForm();
        // this.loadMyCompany();
        this.initGitSettingsForm(new GitSettings());

    }

    loadMyCompany() {
        const currentUser = this.currentUserService.get();
        const myCompanyId = currentUser['userInfo']['company']['id'];
        // this.getGeneralSettings(myCompanyId);
    }

    createGeneralSettingsForm() {
        // this.modalHeader = 'Create new git settings';
        // this.modalActionButton = 'Create';
        this.initGitSettingsForm(new GitSettings());
        // this.initDockerHubSettingsForm(new DockerHubSettings());
    }

    initGitSettingsForm(formData) {
        formData = formData ? formData : new GitSettings();

        this.gitSettingsForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            gitProvider: [formData.gitProvider, [Validators.required]],
            username: [formData.username, [Validators.required]],
            secretKey: [formData.secretKey, [Validators.required]],
        });
    }

    saveGitInfo() {
        this.markFormGroupasTouchedandDirty(this.gitSettingsForm);
        if (this.gitSettingsFormInvalid()) { return; }
        const newGitInfo = this.gitSettingsForm.value;
        this.submitGitInfo(newGitInfo);
    }

   gitSettingsFormInvalid() {
        return this.gitSettingsForm.invalid;
    }


    submitGitInfo(newSettings) {
        this.generalSettingsService.saveGitInfoSettings(newSettings).subscribe(
            data => {
                this.alertService.sendAlert(data);
                this.onSave.emit(true);
            }
        );
    }
}
