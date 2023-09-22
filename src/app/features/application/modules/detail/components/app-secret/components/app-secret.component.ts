import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AppSecretFormComponent} from "./form/app-secret.form.component";
import {AppSecretService} from "../services/service-api/app-secret.service";
import {AppSecret} from "../services/domain/app-secret.model";
import {AlertService} from "../../../../../../../shared/services/alert.service";
import {ThemeService} from "../../../../../../../services/theme.service";
import {BaseClass} from "../../../../../../../shared/base.class";
import {SidebarService} from "../../../../../../../services/sidebar.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-secret',
    templateUrl: './app-secret.component.html',
    styleUrls: ['./app-secret.component.css']
})

export class AppSecretComponent extends BaseClass implements OnInit {

    modalRef: NgbModalRef;
    modalHeader: string;
    appId: any;
    deletingAppSecret: AppSecret;
    dataLoading: boolean;

    @Input('applicationId') set applicationId(value) {
        this.appId = value;
    }

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        public activeModal: NgbActiveModal,
        private themeService: ThemeService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private appSecretService: AppSecretService,
        private alertService: AlertService

    ) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.sidebarVisible = false;
        this.dataLoading = true;
        this.getAppSecretList();
    }

    getAppSecretList() {
        this.appSecretService.getAppSecretList(this.appId).subscribe(
            dataList => {
                if (dataList.data) { this.tableValue = dataList.data.content; }
                this.dataLoading = false;
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(AppSecretFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createAppSecretForm(this.appId);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getAppSecretList();
            modalRef.close();
        });
    }
    openEditModal(selectedAppSecret) {
        const modalRef = this.modalService.open(AppSecretFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editAppSecretForm(selectedAppSecret,this.appId);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getAppSecretList();
            modalRef.close();
        });
    }

    openDeleteModal(content, appSecret?) {
        this.deletingAppSecret = appSecret ? appSecret : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        this.deleteAppSecret();
    }

    deleteAppSecret() {
        this.appSecretService.deleteAppSecret(this.deletingAppSecret.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'App Secret Deleted');
                this.getAppSecretList();
                this.modalRef.dismiss();
            }
        );
    }

}
