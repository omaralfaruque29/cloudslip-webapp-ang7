import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CompanyService } from '../services/service-api/company.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyFormComponent } from './form/company.form.component';
import { Company } from '../services/domain/company.model';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseClass } from '../../../shared/base.class';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html'
})

export class CompanyComponent extends BaseClass implements OnInit {

    // companies = [];
    companyData: Company;
    deletingCompany: Company;

    modalRef: NgbModalRef;
    modalHeader: string;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private companyService: CompanyService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.getCompanyList();
        this.selection = new SelectionModel<Company>(this.allowMultiSelect, this.initialSelection);
    }

    getCompanyList() {
        this.companyService.getCompanyList().subscribe(
            companyList => {
                if (companyList.data) { this.tableValue = companyList.data.content; }
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(CompanyFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createCompanyForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getCompanyList();
            modalRef.close();
        });
    }

    openEditModal(selectedCompany) {
        const modalRef = this.modalService.open(CompanyFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editCompanyForm(selectedCompany);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getCompanyList();
            modalRef.close();
        });
    }

    openDeleteModal(content, company?) {
        this.deletingCompany = company ? company : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteCompany();
        }
    }

    deleteCompany() {
        this.companyService.deletCompany(this.deletingCompany.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'Company Deleted');
                this.getCompanyList();
                this.modalRef.dismiss();
            }
        );
    }

    detail(company) {
        this.router.navigate(['detail', company.id], { relativeTo: this.route })
    }

    batchDelete() {
        this.selection.selected.map(selectedCompany => {
            this.deletingCompany = selectedCompany;
            this.deleteCompany();
        });
    }
}