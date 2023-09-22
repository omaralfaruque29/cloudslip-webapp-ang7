import { Component, ChangeDetectorRef, OnInit, } from "@angular/core";
import { SidebarService } from '../../../services/sidebar.service';
import { BaseClass } from '../../../shared/base.class';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VpcFormComponent } from './form/vpc.form.component';
import { VpcService } from '../services/service-api/vpc.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
    selector: 'app-vpc-pp',
    templateUrl: './vpc.component.html',
    styleUrls: ['./vpc.component.scss']
})

export class VpcComponent extends BaseClass implements OnInit {


    actionButtonChecker = false;
    vpcList = [];
    modalRef: NgbModalRef;
    deletingVpc: any;
    flagState = true;
    themeClass = "theme-cyan";
    smallScreenMenu = "";
    deleteModal: any;
    dataLoading: boolean;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private modalService: NgbModal,
        private vpcService: VpcService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService

    ) {
        super(sidebarService, cdr);
        this.dataLoading = true;
    }

    ngOnInit() {
        this.getVpcList();
    }

    getVpcList() {
        this.dataLoading = true;
        this.vpcService.getVpcList().subscribe(
            response => {
                this.vpcList = response.data != null ? response.data : [];
                this.dataLoading = false;
            }, (error) => {
                this.dataLoading = false;
                console.log(error);
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(VpcFormComponent, { size: 'xl' as 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.createNewAppForm('newApp');
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getVpcList();
        });
        modalRef.componentInstance.onSkip.subscribe(response => {
            this.getVpcList();
            modalRef.close();
        });
    }

    openAddFromRepoModal() {
        const modalRef = this.modalService.open(VpcFormComponent, { size: 'xl' as 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.createNewAppForm('fromRepo');
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getVpcList();
        });
        modalRef.componentInstance.onSkip.subscribe(response => {
            this.getVpcList();
            modalRef.close();
        });
    }

    openAddFromListModal() {
        const modalRef = this.modalService.open(VpcFormComponent, { size: 'xl' as 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.createNewAppForm('fromList');
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getVpcList();
        });
        modalRef.componentInstance.onSkip.subscribe(response => {
            this.getVpcList();
            modalRef.close();
        });
    }

    goToVpcDetail(vpc) {
        this.router.navigate(['detail', vpc.id], { relativeTo: this.route });
    }

    goToCreate() {
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    showActionButton() {
        this.actionButtonChecker = true;
    }

    showStartButton() {
        this.actionButtonChecker = false;
    }

    openDeleteModal(content, vpc?) {
        this.deletingVpc = vpc ? vpc : null;
        this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        this.vpcService.deleteVpc(this.deletingVpc.id).subscribe(
            res => {
                this.alertService.sendAlert(res);
                this.getVpcList();
                this.deleteModal.close();
            }
        );
    }

}
