import { Component, ChangeDetectorRef, OnInit, } from "@angular/core";
import { RegionService } from '../services/service-api/region.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionFormComponent } from './form/region.form.component';
import { Region } from '../services/domain/region.model';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import {BaseClass} from "../../../../shared/base.class";
import {SidebarService} from "../../../../services/sidebar.service";

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.css']
})

export class RegionComponent extends BaseClass implements OnInit {

    regions = [];
    modalHeader: string;
    modalRef: NgbModalRef;
    deletingRegion: Region;
    public sidebarVisible: boolean;

    constructor(sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private regionService: RegionService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.sidebarVisible = true;
        this.getRegionList();
        this.selection = new SelectionModel<Region>(this.allowMultiSelect, this.initialSelection);
    }

    getRegionList() {
        this.regionService.getRegionList().subscribe(
            regionList => {
                if(regionList.data.content != null) {
                    this.tableValue = regionList.data.content;
                }
            },
            // TODO: needs to be removed after implementing global error handler
            err => {
                console.error(err);
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(RegionFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createRegionForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getRegionList();
            modalRef.close();
        });
    }

    openEditModal(selectedRegion) {
        const modalRef = this.modalService.open(RegionFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editRegionForm(selectedRegion);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getRegionList();
            modalRef.close();
        });
    }

    openDeleteModal(content, region?) {
        this.deletingRegion = region ? region : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteRegion();
        }
    }

    deleteRegion() {
        this.regionService.deletRegion(this.deletingRegion.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'Region Deleted');
                this.getRegionList();
                this.modalRef.dismiss();
            }
        );
    }

    detail(region) {
        this.router.navigate(['detail', region.id], { relativeTo: this.route });
    }

    batchDelete() {
        this.selection.selected.map(selectedRegion => {
            this.deletingRegion = selectedRegion;
            this.deleteRegion();
        });
    }
}
