import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBaseClass } from '../../../../../shared/form.base.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SidebarService } from '../../../../../services/sidebar.service';
import { GeneralSettingsService } from '../../services/service-api/general-settings.service';
import { CurrentUserService } from '../../../../../services/current-user.service';
import { GitSettings, DockerHubSettings } from '../../services/domain/general-settings.model';
import { AlertService } from '../../../../../shared/services/alert.service';

@Component({
    selector: 'app-docker-setup',
    templateUrl: './docker.setup.component.html'
})

export class DockerSetupFormComponent extends FormBaseClass implements OnInit {


    dockerHubSettingsForm: FormGroup;

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private generalSettingsService: GeneralSettingsService,
        private alertService: AlertService,
        // private toast: ToastrService,
        // public activeModal: NgbActiveModal,
        private currentUserService: CurrentUserService
    ) { super(); }

    ngOnInit() {
        // this.sidebarVisible = true;
        this.initDockerHubSettingsForm(new DockerHubSettings());

        // this.createGeneralSettingsForm();
        // this.loadMyCompany();
    }

    // loadMyCompany() {
    //     const currentUser = this.currentUserService.get();
    //     const myCompanyId = currentUser['userInfo']['company']['id'];
    //     this.getGeneralSettings(myCompanyId);
    // }

    // createGeneralSettingsForm() {
    //     this.modalHeader = 'Create new git settings';
    //     this.modalActionButton = 'Create';
    //     this.initGitSettingsForm(new GitSettings());
    //     this.initDockerHubSettingsForm(new DockerHubSettings());
    // }

    // initGitSettingsForm(formData) {
    //     formData = formData ? formData : new GitSettings();

    //     this.gitSettingsForm = this.fb.group({
    //         id: [formData.id ? formData.id : null],
    //         gitProvider: [formData.gitProvider, [Validators.required]],
    //         username: [formData.username, [Validators.required]],
    //         secretKey: [formData.secretKey, [Validators.required]],
    //     });
    // }

    initDockerHubSettingsForm(formData) {
        formData = formData ? formData : new DockerHubSettings();

        this.dockerHubSettingsForm = this.fb.group({
            dockerRegistryType: [formData.dockerRegistryType, [Validators.required]],
            dockerRegistryServer: [formData.dockerRegistryServer, [Validators.required]],
            dockerhubId: [formData.dockerhubId, [Validators.required]],
            dockerhubEmail: [formData.dockerhubEmail, [Validators.required]],
            dockerhubPassword: [formData.dockerhubPassword, [Validators.required]]
        });
        this.dockerHubSettingsForm.controls.dockerRegistryType.setValue('DOCKER_HUB');
    }

    // saveGitInfo() {
    //     if (this.gitSettingsFormInvalid()) { return; }
    //     const newGitInfo = this.gitSettingsForm.value;
    //     this.submitGitInfo(newGitInfo);
    // }

    saveDockerHubInfo() {
        if (this.dockerHubSettingsForm.value.dockerRegistryType === 'DOCKER_HUB') {
            this.dockerHubSettingsForm.controls['dockerRegistryServer'].setValue("http://address@example.com");
            this.dockerHubSettingsForm.value.dockerRegistryServer = "http://someaddress.com";
        }
        if (this.dockerHubSettingsFormInvalid()) { return; }
        const newDockerHubInfo = this.dockerHubSettingsForm.value;
        this.submitDockerHubInfo(newDockerHubInfo);
    }

    // gitSettingsFormInvalid() {
    //     return this.gitSettingsForm.invalid;
    // }

    dockerHubSettingsFormInvalid() {
        return this.dockerHubSettingsForm.invalid;
    }

    // submitGitInfo(newSettings) {
    //     this.generalSettingsService.saveGitInfoSettings(newSettings).subscribe(
    //         data => {
    //             this.toast.success(data['message'], 'Settings Updated');
    //             this.onSave.emit(true);
    //         }
    //     );
    // }

    submitDockerHubInfo(newSettings) {
        this.generalSettingsService.saveDockerHubInfoSettings(newSettings).subscribe(
            data => {
                // this.toast.success(data['message'], 'Settings Updated');
                this.alertService.sendAlert(data);
                this.onSave.emit(true);
            }
        );
    }

    // getGeneralSettings(myCompanyId) {
    //     this.generalSettingsService.getGeneralSettings(myCompanyId).subscribe(
    //         data => {
    //             this.initGitSettingsForm(data.data.gitInfo);
    //             this.initDockerHubSettingsForm(data.data.dockerHubInfo);
    //             console.log(data);
    //         }
    //     );
    // }
    /** Sidebar resize on button click */
    // toggleFullWidth() {
    //     this.sidebarService.toggle();
    //     this.sidebarVisible = this.sidebarService.getStatus();
    //     this.cdr.detectChanges();
    // }
}
