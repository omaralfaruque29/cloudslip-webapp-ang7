import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import {BaseClass} from "../../../../shared/base.class";
import {KubeCluster} from "../services/domain/kube-cluster.model";
import {SidebarService} from "../../../../services/sidebar.service";
import {KubeClusterService} from "../services/service-api/kube-cluster.service";
import {KubeClusterFormComponent} from "./form/kube-cluster.form.component";

@Component({
    selector: 'app-environment-option',
    templateUrl: './kube-cluster.component.html',
    styleUrls: ['./kube-cluster.css']
})

export class KubeClusterComponent extends BaseClass implements OnInit {

    modalRef: NgbModalRef;
    modalHeader: string;
    deletingKubeCluster: KubeCluster;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private kubeClusterService: KubeClusterService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.getKubeClusterList();
        this.selection = new SelectionModel<KubeCluster>(this.allowMultiSelect, this.initialSelection);
    }

    getKubeClusterList() {
        this.kubeClusterService.getKubeClustersList().subscribe(
            kubeClusterList => {
                console.log(kubeClusterList);
                if (kubeClusterList.data) { this.tableValue = kubeClusterList.data; }
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(KubeClusterFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createKubeClusterForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getKubeClusterList();
            modalRef.close();
        });
    }

    openEditModal(selectedKubeCluster) {
        const modalRef = this.modalService.open(KubeClusterFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editKubeClusterForm(selectedKubeCluster);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getKubeClusterList();
            modalRef.close();
        });
    }

    openDeleteModal(content, kubeCluster) {
        this.deletingKubeCluster = kubeCluster ? kubeCluster : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteKubeCluster();
        }
    }

    deleteKubeCluster() {
        this.kubeClusterService.deleteEnvironmentOpton(this.deletingKubeCluster.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'Kube Cluster Deleted');
                this.getKubeClusterList();
                this.modalRef.dismiss();
            }
        );
    }

    batchDelete() {
        this.selection.selected.map(selectedKubeCluster => {
            this.deletingKubeCluster = selectedKubeCluster;
            this.deleteKubeCluster();
        });
    }

    detail(kubeCluster) {
        this.router.navigate(['detail', kubeCluster.id], { relativeTo: this.route });
    }
}
