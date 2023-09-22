import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { BaseClass } from '../../../../shared/base.class';
import { SidebarService } from '../../../../services/sidebar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NotificationDomain } from "../../services/domain/notification.model";
import { NotificationService } from '../../services/notification.service';


@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification.detail.component.html'
})
export class NotificationDetailComponent extends BaseClass implements OnInit {

    tableValue = [];
    modalRef: NgbModalRef;
    deletingNotification: NotificationDomain;
    private page: string = '0';
    private size: string = '10';
    private pages: Array<number>;

    constructor(
        private modalService: NgbModal,
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private notificationService: NotificationService,
        private toastr: ToastrService
    ) { super(sidebarService, cdr); }

    ngOnInit() {
        this.getNotifications();
        this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);
    }

    getNotifications() {
        this.notificationService.getNotifications(this.page, this.size).subscribe(
            JSONobj => {
                if (JSONobj.data) {
                    this.tableValue = JSONobj.data['content'];
                    this.pages = new Array(JSONobj.data['totalPages']);
                }
            }
        );
    }

    setPage(i, event: any) {
        event.preventDefault();
        this.page = i;
        this.getNotifications();
    }

    openDeleteModal(content, notification?) {
        this.deletingNotification = notification ? notification : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteOrganization();
        }
    }

    batchDelete() {
        this.selection.selected.map(selectedNotification => {
            this.deletingNotification = selectedNotification;
            this.deleteOrganization();
        });
    }

    deleteOrganization() {
        this.notificationService.deleteNotification(this.deletingNotification.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'Notification Deleted');
                if (this.tableValue.length <= 1) {
                    this.page = (Number(this.page) - 1).toLocaleString();
                }
                this.getNotifications();
                this.modalRef.dismiss();
            }
        );
    }

}