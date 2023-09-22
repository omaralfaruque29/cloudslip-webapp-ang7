import { Component, Output, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {KubeClusterService} from "../../services/service-api/kube-cluster.service";
import {FormBaseClass} from "../../../../../shared/form.base.class";
import {KubeCluster} from "../../services/domain/kube-cluster.model";

@Component({
    selector: 'app-environment-option-form',
    templateUrl: './kube-cluster.form.component.html'
})


export class KubeClusterFormComponent extends FormBaseClass implements OnInit {

    @Output() onSave = new EventEmitter<boolean>();

    kubeClusterForm: FormGroup;

    modalHeader: string;
    modalActionButton: string;
    regionList = [{ name: 'Select a region', id: null }];
    kubeClusterId: number = null;
    isEnabled: boolean;

    constructor(
        private fb: FormBuilder,
        private kubeClusterService: KubeClusterService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
    ) { super(); }

    ngOnInit() {
        this.getRegionList();
    }

    getRegionList() {
        this.kubeClusterService.getRegionList().subscribe(
            response => {
                this.regionList = this.regionList.concat(response.data);
            }
        );
    }

    createKubeClusterForm() {
        this.modalHeader = 'Create new Kube Cluster';
        this.modalActionButton = 'Create';
        this.initForm(new KubeCluster());
    }

    editKubeClusterForm(selectedkubeCluster) {
        this.modalHeader = 'Edit Kube Cluster';
        this.modalActionButton = 'Update';
        this.kubeClusterId = selectedkubeCluster.id;
        this.initForm(selectedkubeCluster);
    }

    initForm(formData) {
        formData = formData ? formData : new KubeCluster();
        this.isEnabled = true;
        this.kubeClusterForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            dashboardUrl: [formData.dashboardUrl],
            defaultNamespace: [formData.defaultNamespace, [Validators.required]],
            regionId: [formData.region ? formData.region.id : formData.regionId, [Validators.required]],
            totalCPU: [formData.totalCPU, [Validators.required]],
            totalMemory: [formData.totalMemory, [Validators.required]],
            totalStorage: [formData.totalStorage, [Validators.required]],
            availableCPU: [formData.availableCPU, [Validators.required]],
            availableMemory: [formData.availableMemory, [Validators.required]],
            availableStorage: [formData.availableStorage, [Validators.required]],
            enabled: [formData.enabled]
        });
    }

    toggleIsEnabled() {
        //this.isEnabled = !this.isEnabled;
    }


    submit() {
        this.removeAdminEmailonEdit();
        this.markFormGroupasTouchedandDirty(this.kubeClusterForm);

        if (this.formInvalid()) { return; }

        const kubeCluster = this.kubeClusterForm.value;

        if (this.kubeClusterId) {
            this.updateKubeCluster(kubeCluster);
        } else {
            this.createKubeCluster(kubeCluster);
        }
    }

    removeAdminEmailonEdit() {
        if (this.kubeClusterId) {
            this.kubeClusterForm.removeControl('adminEmail');
            this.kubeClusterForm.updateValueAndValidity();
        }
    }

    formInvalid() {
        return this.kubeClusterForm.invalid;
    }

    createKubeCluster(kubeCluster) {
        this.kubeClusterService.createKubeCluster(kubeCluster).subscribe(
            data => {
                this.toastr.success(data['message'], 'kubeCluster Created');
                this.onSave.emit(true);
            }
        );
    }

    updateKubeCluster(kubeCluster) {
        this.kubeClusterService.updateKubeCluster(kubeCluster).subscribe(
            data => {
                this.toastr.success(data['message'], 'kubeCluster Updated');
                this.onSave.emit(true);
            }
        );
    }
}
