import { Component, ChangeDetectorRef, OnInit, } from "@angular/core";
import { OrganizationService } from '../services/service-api/organization.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationFormComponent } from './form/organization.form.component';
import { Organization } from '../services/domain/organization.model';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseClass } from '../../../shared/base.class';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html'
})

export class OrganizationComponent extends BaseClass implements OnInit {

    organizations = [];
    modalHeader: string;
    modalRef: NgbModalRef;
    deletingOrganization: Organization;
    public sidebarVisible: boolean;

    constructor(sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private organizationService: OrganizationService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.sidebarVisible = true;
        this.getOrganizationList();
        this.selection = new SelectionModel<Organization>(this.allowMultiSelect, this.initialSelection);
    }

    getOrganizationList() {
        this.organizationService.getOrganizationList().subscribe(
            organizationList => {
                this.tableValue = organizationList.data.content;
            },
            // TODO: needs to be removed after implementing global error handler
            err => {
                console.error(err);
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(OrganizationFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createOrganizationForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getOrganizationList();
            modalRef.close();
        });
    }

    openEditModal(selectedOrganization) {
        const modalRef = this.modalService.open(OrganizationFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editOrganizationForm(selectedOrganization);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getOrganizationList();
            modalRef.close();
        });
    }

    openDeleteModal(content, organization?) {
        this.deletingOrganization = organization ? organization : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteOrganization();
        }
    }

    deleteOrganization() {
        this.organizationService.deletOrganization(this.deletingOrganization.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'Organization Deleted');
                this.getOrganizationList();
                this.modalRef.dismiss();
            }
        );
    }

    detail(organization) {
        this.router.navigate(['detail', organization.id], { relativeTo: this.route });
    }

    batchDelete() {
        this.selection.selected.map(selectedOrganization => {
            this.deletingOrganization = selectedOrganization;
            this.deleteOrganization();
        });
    }
}
