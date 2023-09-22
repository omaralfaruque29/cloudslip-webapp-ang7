import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import {BaseClass} from "../../../../shared/base.class";
import {EnvironmentOption} from "../services/domain/environment-option.model";
import {SidebarService} from "../../../../services/sidebar.service";
import {EnvironmentOptionService} from "../services/service-api/environment-option.service";
import {EnvironmentOptionFormComponent} from "./form/environment-option.form.component";

@Component({
    selector: 'app-environment-option',
    templateUrl: './environment-option.component.html',
    styleUrls: ['./environment-option.css']
})

export class EnvironmentOptionComponent extends BaseClass implements OnInit {

    modalRef: NgbModalRef;
    modalHeader: string;
    deletingEnvironmentOption: EnvironmentOption;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private environmentOptionService: EnvironmentOptionService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.getEnvironmentOptionList();
        this.selection = new SelectionModel<EnvironmentOption>(this.allowMultiSelect, this.initialSelection);
    }

    getEnvironmentOptionList() {
        this.environmentOptionService.getEnvironmentOptionsList().subscribe(
            environmentOptionList => {
                console.log(environmentOptionList);
                if (environmentOptionList.data) { this.tableValue = environmentOptionList.data; }
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(EnvironmentOptionFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createEnvironmentOptionForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getEnvironmentOptionList();
            modalRef.close();
        });
    }

    openEditModal(selectedEnvironmentOption) {
        const modalRef = this.modalService.open(EnvironmentOptionFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editEnvironmentOptionForm(selectedEnvironmentOption);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getEnvironmentOptionList();
            modalRef.close();
        });
    }

    openDeleteModal(content, environmentOption) {
        this.deletingEnvironmentOption = environmentOption ? environmentOption : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteEnvironmentOption();
        }
    }

    deleteEnvironmentOption() {
        this.environmentOptionService.deleteEnvironmentOpton(this.deletingEnvironmentOption.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'EnvironmentOption Deleted');
                this.getEnvironmentOptionList();
                this.modalRef.dismiss();
            }
        );
    }

    batchDelete() {
        this.selection.selected.map(selectedEnvironmentOption => {
            this.deletingEnvironmentOption = selectedEnvironmentOption;
            this.deleteEnvironmentOption();
        });
    }

    detail(environmentOption) {
        this.router.navigate(['detail', environmentOption.id], { relativeTo: this.route });
    }
}
