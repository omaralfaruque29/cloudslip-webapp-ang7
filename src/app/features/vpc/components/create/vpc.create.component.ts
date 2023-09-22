import {Component, ChangeDetectorRef, OnInit, EventEmitter, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { Vpc } from '../../services/domain/vpc.model';
import { VpcService } from '../../services/service-api/vpc.service';
import { BaseClass } from '../../../../shared/base.class';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-vpc-detail',
    templateUrl: './vpc.create.component.html'
})

export class CreateVpcComponent extends BaseClass implements OnInit {

    @Output() onSave = new EventEmitter<boolean>();
    newVpcForm: FormGroup;
    vpc: Vpc = new Vpc();
    modalRef: NgbModalRef;
    regionList = [{ name: 'Select a Region for your VPC', id: null }];
    regionsLoaded: boolean;
    environmentOptionsLoaded: boolean;
    creatingVpc: boolean;
    autoScaling: boolean;

    cpuOptions = {
        showTicksValues: true,
        stepsArray: [
            {value: 0.5, legend: 'Low'},
            {value: 1},
            {value: 2, legend: 'Medium'},
            {value: 3},
            {value: 4, legend: 'Standard'},
            {value: 5},
            {value: 6, legend: 'High'},
            {value: 8},
            {value: 10, legend: 'Super'}
        ]
    };

    memoryOptions = {
        showTicksValues: true,
        stepsArray: [
            {value: 1, legend: 'Low'},
            {value: 2},
            {value: 4, legend: 'Medium'},
            {value: 6},
            {value: 8, legend: 'Standard'},
            {value: 10},
            {value: 12, legend: 'High'},
            {value: 14},
            {value: 16, legend: 'Super'}
        ]
    };

    bandwidthOptions = {
        showTicksValues: true,
        stepsArray: [
            {value: 'Low'},
            {value: 'Medium'},
            {value: 'High'},
        ]
    };

    storageOptions = {
        floor: 10,
        ceil: 500
    };

    constructor(
        private fb: FormBuilder,
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private router: Router,
        private modalService: NgbModal,
        private vpcService: VpcService,
        private toastr: ToastrService,
        private route: ActivatedRoute) {
        super(sidebarService, cdr);
        this.regionsLoaded = false;
        this.environmentOptionsLoaded = false;
        this.creatingVpc = false;
    }

    ngOnInit() {
        this.getRegionList();
        this.autoScaling = false;
    }


    getRegionList() {
        this.vpcService.getRegionList().subscribe(
            response => {
                if (response.data) {
                    this.regionList = this.regionList.concat(response.data);
                    this.regionsLoaded = true;
                    this.initForm();
                }
            }
        );
    }

    initForm() {
        if (this.regionsLoaded) {
            const formData = new Vpc().setDefaultsForNew();
            this.newVpcForm = this.fb.group({
                name: [null, [Validators.required]],
                regionId: [this.regionList[1].id, [Validators.required]],
                totalCPU: [formData.totalCPU, [Validators.required]],
                totalMemory: [formData.totalMemory, [Validators.required]],
                bandwidth: [formData.bandwidth, [Validators.required]],
                totalStorage: [formData.totalStorage, [Validators.required]],
                autoScalingEnabled: [formData.autoScalingEnabled],
            });
        }
    }

    createVpc() {
        if (!this.creatingVpc) {
            this.markFormGroupAsTouchedandDirty(this.newVpcForm);
            if (this.formInvalid()) { return; }
            console.log(this.autoScaling);
            this.creatingVpc = true;
            const postData = Object.assign(new Vpc(), this.newVpcForm.value);
            postData.totalCPU = postData.totalCPU * 1000;
            postData.totalMemory = postData.totalMemory * 1024;
            postData.totalStorage = postData.totalStorage * 1024;
            postData.autoScalingEnabled = this.autoScaling;

            this.vpcService.createVpc(postData).subscribe(
                data => {
                    this.creatingVpc = false;
                    if (data.status === 'success') {
                        this.toastr.success(data.message, "");
                        this.back();
                    } else  {
                        this.toastr.error(data.message, "");
                    }
                }, error => {
                    this.creatingVpc = false;
                    this.toastr.success("Error occurred!", "");
                    console.log(error);
                }
            );
        }
    }

    changeAutoScaling(autoScalingChecker) {
       this.autoScaling = autoScalingChecker;
    }
    markFormGroupAsTouchedandDirty(formToMakeTouchedandDirty: FormGroup) {
        Object.keys(formToMakeTouchedandDirty.controls).forEach(key => {
            formToMakeTouchedandDirty.get(key).markAsDirty();
            formToMakeTouchedandDirty.get(key).markAsTouched();
        });
    }

    formInvalid() {
        return this.newVpcForm.invalid;
    }

    back() {
        this.router.navigate(['/main/vpc']);
    }
}
