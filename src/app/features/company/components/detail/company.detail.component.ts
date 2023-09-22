import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CompanyService } from '../../services/service-api/company.service';
import { Company } from '../../services/domain/company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { BaseClass } from '../../../../shared/base.class';
import { Organization } from "../../../organization/services/domain/organization.model";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationService } from "../../../organization/services/service-api/organization.service";
import { ToastrService } from "ngx-toastr";
import { SelectionModel } from '@angular/cdk/collections';
import { OrganizationFormComponent } from "../../../organization/components/form/organization.form.component";

@Component({
    selector: 'app-company-detail',
    templateUrl: './company.detail.component.html'
})

export class CompanyDetailComponent extends BaseClass implements OnInit {
    company: Company = new Company();
    companyId: string;
    sidebarVisible = true;
    deletingOrganization: Organization;
    modalRef: NgbModalRef;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private modalService: NgbModal,
        private router: Router,
        private companyService: CompanyService,
        private organizationService: OrganizationService,
        private toastr: ToastrService,
        private route: ActivatedRoute) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.companyId = this.route.snapshot.params.id;
        this.fetchCompanyDetail();
        this.getOrganizationList();
        this.selection = new SelectionModel<Organization>(this.allowMultiSelect, this.initialSelection);
    }

    fetchCompanyDetail() {
        this.companyService.getCompanyDetail(this.companyId).subscribe(
            company => {
                this.company = company.data;
            }
        );
    }

    getOrganizationList() {
        this.companyService.getOrganizationList(this.companyId).subscribe(
            organizationList => {
                if (organizationList.data) { this.tableValue = organizationList.data.content; }
                // console.log(this.tableValue);
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(OrganizationFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createOrganizationFormBySuperAdmin(this.companyId);
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

    back() {
        this.router.navigate(['/main/company']);
    }
}
