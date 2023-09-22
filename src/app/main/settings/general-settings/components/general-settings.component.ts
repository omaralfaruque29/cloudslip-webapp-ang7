import {Component, ChangeDetectorRef, OnInit, Output} from "@angular/core";
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from '../../../../services/sidebar.service';
import {GeneralSettingsService} from "../services/service-api/general-settings.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GitSettings, DockerHubSettings} from "../services/domain/general-settings.model";
import {FormBaseClass} from "../../../../shared/form.base.class";
import { EventEmitter } from '@angular/core';
import {CurrentUserService} from "../../../../services/current-user.service";

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.css']
})

export class GeneralSettingsComponent extends FormBaseClass  implements OnInit {
    @Output() onSave = new EventEmitter<boolean>();
    gitSettingsForm: FormGroup;
    dockerHubSettingsForm: FormGroup;
    modalHeader: string;
    modalActionButton: string;
    public sidebarVisible: boolean;


    constructor(
        private fb: FormBuilder,
        private sidebarService: SidebarService,
        private cdr: ChangeDetectorRef,
        private generalSettingsService: GeneralSettingsService,
        private toast: ToastrService,
        public activeModal: NgbActiveModal,
        private currentUserService: CurrentUserService
    ) { super(); }

    ngOnInit() {
        this.sidebarVisible = true;
        this.createGeneralSettingsForm();
        this.loadMyCompany();
    }

    loadMyCompany() {
        const currentUser = this.currentUserService.get();
        const myCompanyId = currentUser['userInfo']['company']['id'];
        this.getCompanyDetail(myCompanyId);
    }

    createGeneralSettingsForm() {
        this.modalHeader = 'Create new git settings';
        this.modalActionButton = 'Create';
        this.initGitSettingsForm(new GitSettings());
        this.initDockerHubSettingsForm(new DockerHubSettings());
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

    initDockerHubSettingsForm(formData) {
        formData = formData ? formData : new DockerHubSettings().setDefaultsForNew();

        this.dockerHubSettingsForm = this.fb.group({
            dockerRegistryType: [formData.dockerRegistryType, [Validators.required]],
            dockerRegistryServer: [formData.dockerRegistryServer, [Validators.required]],
            dockerhubId: [formData.dockerhubId, [Validators.required]],
            dockerhubEmail: [formData.dockerhubEmail, [Validators.required]],
            dockerhubPassword: [formData.dockerhubPassword, [Validators.required]]
        });
    }

    saveGitInfo() {
        if (this.gitSettingsFormInvalid()) { return; }
        const newGitInfo = this.gitSettingsForm.value;
        this.submitGitInfo(newGitInfo);
    }

    saveDockerHubInfo() {
        if (this.dockerHubSettingsForm.value.dockerRegistryType === 'DOCKER_HUB') {
            this.dockerHubSettingsForm.controls['dockerRegistryServer'].setValue("http://address@example.com");
            this.dockerHubSettingsForm.value.dockerRegistryServer = "http://someaddress.com";
        }
        if (this.dockerHubSettingsFormInvalid()) { return; }
        const newDockerHubInfo = this.dockerHubSettingsForm.value;
        this.submitDockerHubInfo(newDockerHubInfo);
    }

    gitSettingsFormInvalid() {
        return this.gitSettingsForm.invalid;
    }

    dockerHubSettingsFormInvalid() {
        return this.dockerHubSettingsForm.invalid;
    }

    submitGitInfo(newSettings) {
        this.generalSettingsService.saveGitInfoSettings(newSettings).subscribe(
            data => {
                this.toast.success(data['message'], 'Settings Updated');
                this.onSave.emit(true);
            }
        );
    }

    submitDockerHubInfo(newSettings) {
        this.generalSettingsService.saveDockerHubInfoSettings(newSettings).subscribe(
            data => {
                this.toast.success(data['message'], 'Settings Updated');
                this.onSave.emit(true);
            }
        );
    }

    getCompanyDetail(myCompanyId) {
        this.generalSettingsService.getCompanyDetail(myCompanyId).subscribe(
            res => {
                this.initGitSettingsForm(res.data.gitInfo);
                this.initDockerHubSettingsForm(res.data.dockerHubInfo);
            }
        );
    }
    /** Sidebar resize on button click */
    toggleFullWidth() {
        this.sidebarService.toggle();
        this.sidebarVisible = this.sidebarService.getStatus();
        this.cdr.detectChanges();
    }
}
