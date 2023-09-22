import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { FormBaseClass } from '../../../../../../shared/form.base.class';
import { Vpc, ChangedResource } from '../../../../../../main/settings/environment-settings/services/domain/environment-settings-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Options } from 'ng5-slider';
import { CpuTypes, MaxRams } from '../../../../services/domain/application.enums';
import { pairwise, startWith, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-auto-scaling-form',
    templateUrl: './auto.scaling.form.component.html',
    styleUrls: ['./auto.scaling.form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AutoScalingConfigFormComponent extends FormBaseClass implements OnInit {

    newVpcMapping: Vpc = new Vpc();
    autoScalingForm: FormGroup = null;
    autoScalingChecker = false;
    currentVpcId = null;
    initialVpc = new Vpc();
    vpcEnvironmentId = null;

    @Input('vpcId') set vpcId(value) {
        this.currentVpcId = value;
    }
    @Input('availableResouce') set availableResouce(value) {
        if (value) {
            this.vpcAvaliableResource = value;
            if (this.vpcAvaliableResource.availableCPU === 0 ||
                this.vpcAvaliableResource.availableMemory === 0 ||
                this.vpcAvaliableResource.availableStorage === 0) {
                this.minCPUoptions.disabled = true;
                this.maxRamOptions.disabled = true;
                this.maxStorageOptions.disabled = true;
            }
            else {
                this.minCPUoptions.disabled = false;
                this.maxRamOptions.disabled = false;
                this.maxStorageOptions.disabled = false;
            }

            this.updateCeilingValues();
        }
    }
    @Input('environmentId') set environmentId(value) {
        this.vpcEnvironmentId = value;
    }

    vpcAvaliableResource = {
        availableCPU: 1000,
        availableMemory: 1024,
        availableStorage: 1024
    };

    minCPUoptions = {
        floor: 0.25,
        ceil: this.vpcAvaliableResource.availableCPU,
        step: .25,
        disabled: false
    };

    maxRamOptions = {
        floor: 0.5,
        ceil: this.vpcAvaliableResource.availableMemory,
        step: .5,
        disabled: false
    };

    maxStorageOptions = {
        floor: 1,
        ceil: 20,
        disabled: false
    };

    cpuThresholdOptions = {
        floor: 50,
        ceil: 100,
    };

    transactionPerSecondThresholdOptions = {
        floor: 500,
        ceil: 10000,
    };

    instanceOptions = {
        floor: 0,
        ceil: 1
    };

    @Output() onSave = new EventEmitter<Vpc>();
    @Output() onChange = new EventEmitter<ChangedResource>();
    @Output() onInitialChange = new EventEmitter<ChangedResource>();


    constructor(
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.initialVpc = new Vpc();
        this.initialVpc.desiredNumberOfInstance = 1;
        this.initialVpc.maxMemory = 512;
        this.initialVpc.maxStorage = 1024;
        this.initialVpc.maxCpu = 250;
        this.initialVpc.maxNumOfInstance = 1;

        // this.initialVpc.desiredNumberOfInstance = 1;
        this.initialVpc.transactionPerSecondThreshold = 500;
        this.initialVpc.cpuThreshold = 50;

        if (!this.autoScalingForm) {
            this.initForm(null);
        }
    }

    initForm(formData) {
        formData = formData ? formData : this.initialVpc;

        this.autoScalingForm = this.fb.group({
            minCpu: [(+formData.maxCpu / 1000) / 2],
            maxCpu: [(+formData.maxCpu / 1000), Validators.required],
            minMemory: [(+formData.maxMemory / 1024) / 2],
            maxMemory: [(+formData.maxMemory / 1024), Validators.required],
            maxStorage: [(+formData.maxStorage / 1024), Validators.required],
            cpuThreshold: [formData.cpuThreshold],
            transactionPerSecondThreshold: [formData.transactionPerSecondThreshold],
            minNumOfInstance: [formData.minNumOfInstance],
            maxNumOfInstance: [formData.maxNumOfInstance],
            desiredNumberOfInstance: [formData.desiredNumberOfInstance, Validators.required],
            autoScalingEnabled: [formData.autoScalingEnabled],
            canaryDeploymentEnabled: [formData.canaryDeploymentEnabled ? formData.canaryDeploymentEnabled : false]
        });

        this.autoScalingChecker = this.autoScalingForm.controls.autoScalingEnabled.value;
        setTimeout(() => {
            this.onInitialChange.emit({
                environmentId: this.vpcEnvironmentId,
                vpcId: this.currentVpcId,
                CPU: +this.autoScalingForm.controls.maxCpu.value * +this.autoScalingForm.controls.desiredNumberOfInstance.value * 1000,
                memory: +this.autoScalingForm.controls.maxMemory.value * +this.autoScalingForm.controls.desiredNumberOfInstance.value * 1024,
                storage: +this.autoScalingForm.controls.maxStorage.value * +this.autoScalingForm.controls.desiredNumberOfInstance.value * 1024
            }
            );
        }, 500);

        this.autoScalingForm.controls.maxCpu.valueChanges
            .pipe(distinctUntilChanged())
            // .pipe(startWith(this.autoScalingForm.controls.maxCpu.value), pairwise())
            .subscribe(
                (value) => {
                    this.calculateMaxInstance();
                    this.onChange.emit({
                        environmentId: this.vpcEnvironmentId,
                        vpcId: this.currentVpcId,
                        CPU: (+(value) * +this.autoScalingForm.controls.desiredNumberOfInstance.value * 1000),
                        memory: 0,
                        storage: 0
                    }
                    );
                }
            );

        this.autoScalingForm.controls.maxMemory.valueChanges
            .pipe(distinctUntilChanged())
            // .pipe(startWith(this.autoScalingForm.controls.maxMemory.value), pairwise())
            .subscribe(
                (value) => {
                    this.calculateMaxInstance();

                    this.onChange.emit({
                        environmentId: this.vpcEnvironmentId,
                        vpcId: this.currentVpcId,
                        CPU: 0,
                        memory: (+(value) * +this.autoScalingForm.controls.desiredNumberOfInstance.value * 1024),
                        storage: 0
                    }
                    );
                }
            );

        this.autoScalingForm.controls.maxStorage.valueChanges
            .pipe(distinctUntilChanged())
            // .pipe(startWith(this.autoScalingForm.controls.maxStorage.value), pairwise())
            .subscribe(
                (value) => {
                    this.calculateMaxInstance();

                    this.onChange.emit({
                        environmentId: this.vpcEnvironmentId,
                        vpcId: this.currentVpcId,
                        CPU: 0,
                        memory: 0,
                        storage: (+(value) * +this.autoScalingForm.controls.desiredNumberOfInstance.value * 1024)
                    }
                    );
                }
            );

        this.autoScalingForm.controls.desiredNumberOfInstance.valueChanges.subscribe(
            val => {
                if (val === 0) {
                    this.autoScalingForm.controls.desiredNumberOfInstance.setErrors({ 'minValue': true });
                }
            }
        );

        // this.autoScalingForm.controls.minNumOfInstance.valueChanges.subscribe(
        //     val => {
        //         if (val === 0) {
        //             this.autoScalingForm.controls.minNumOfInstance.setErrors({ 'minValue': true });
        //         }
        //     }
        // );

        this.updateCeilingValues();
        this.calculateMaxInstance();

    }

    onMinMaxInstanceChange() {
        if (this.autoScalingForm.controls.minNumOfInstance.value === 0) {
            this.autoScalingForm.controls.minNumOfInstance.setErrors({ 'minValue': true });
        }
        else {
            delete this.autoScalingForm.controls.minNumOfInstance.errors.minValue;
            this.autoScalingForm.controls.minNumOfInstance.clearValidators();
            this.autoScalingForm.controls.minNumOfInstance.updateValueAndValidity();
        }
    }

    submit() {
        this.markFormGroupasTouchedandDirty(this.autoScalingForm);



        if (this.autoScalingForm.controls.autoScalingEnabled.value) {
            this.autoScalingForm.controls.desiredNumberOfInstance.setValue(this.autoScalingForm.controls.minNumOfInstance.value);
        }
        else {
            this.autoScalingForm.controls.minNumOfInstance.setValue(this.autoScalingForm.controls.desiredNumberOfInstance.value);
            this.autoScalingForm.controls.maxNumOfInstance.setValue(this.autoScalingForm.controls.desiredNumberOfInstance.value);
        }

        if (this.formInvalid(this.autoScalingForm)) { return; }

        this.newVpcMapping = this.autoScalingForm.value;

        this.newVpcMapping.maxMemory = +this.newVpcMapping.maxMemory * 1024;
        this.newVpcMapping.maxCpu = +this.newVpcMapping.maxCpu * 1000;
        this.newVpcMapping.maxStorage = +this.newVpcMapping.maxStorage * 1024;

        this.newVpcMapping.minMemory = +this.newVpcMapping.maxMemory / 2;
        this.newVpcMapping.minCpu = +this.newVpcMapping.maxCpu / 2;
        this.newVpcMapping.vpcId = this.currentVpcId;


        this.onSave.emit(this.newVpcMapping);
    }

    updateCeilingValues() {
        if (this.autoScalingForm) {
            if (this.vpcAvaliableResource.availableCPU >= 0) {

                this.minCPUoptions.ceil = +(+this.vpcAvaliableResource.availableCPU / 1000 <
                    (+this.autoScalingForm.controls.maxCpu.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) ?
                    (+this.autoScalingForm.controls.maxCpu.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) :
                    +this.vpcAvaliableResource.availableCPU / 1000 >
                        (+this.autoScalingForm.controls.maxCpu.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) ?
                        +this.vpcAvaliableResource.availableCPU / 1000 :
                        (+this.autoScalingForm.controls.maxCpu.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) +
                        +this.vpcAvaliableResource.availableCPU / 1000).toFixed(2);
                this.minCPUoptions = { ...this.minCPUoptions };
            }

            if (this.vpcAvaliableResource.availableMemory >= 0) {
                this.maxRamOptions.ceil = +(+this.vpcAvaliableResource.availableMemory / 1024 <
                    (+this.autoScalingForm.controls.maxMemory.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) ?
                    (+this.autoScalingForm.controls.maxMemory.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) :
                    +this.vpcAvaliableResource.availableMemory / 1024 >
                        (+this.autoScalingForm.controls.maxMemory.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) ?
                        +this.vpcAvaliableResource.availableMemory / 1024 :
                        (+this.autoScalingForm.controls.maxMemory.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) +
                        +this.vpcAvaliableResource.availableMemory / 1024).toFixed(2);
                this.maxRamOptions = { ...this.maxRamOptions };
            }

            if (this.vpcAvaliableResource.availableStorage >= 0) {
                this.maxStorageOptions.ceil = +(+this.vpcAvaliableResource.availableStorage / 1024 <
                    (+this.autoScalingForm.controls.maxStorage.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) ?
                    (+this.autoScalingForm.controls.maxStorage.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) :
                    +this.vpcAvaliableResource.availableStorage / 1024 >
                        (+this.autoScalingForm.controls.maxStorage.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) ?
                        +this.vpcAvaliableResource.availableStorage / 1024 :
                        (+this.autoScalingForm.controls.maxStorage.value * this.autoScalingForm.controls.desiredNumberOfInstance.value) +
                        +this.vpcAvaliableResource.availableStorage / 1024).toFixed(2);
                this.maxStorageOptions = { ...this.maxStorageOptions };
            }

        }
    }

    changeAutoScalingValidation() {
        if (this.autoScalingForm.controls.autoScalingEnabled.value) {
            this.autoScalingForm.controls.maxNumOfInstance.setValidators([Validators.required]);
            this.autoScalingForm.controls.minNumOfInstance.setValidators([Validators.required]);
            this.autoScalingForm.controls.cpuThreshold.setValidators([Validators.required]);
            this.autoScalingForm.controls.transactionPerSecondThreshold.setValidators([Validators.required]);
            this.autoScalingForm.controls.desiredNumberOfInstance.clearValidators();
            if (this.autoScalingForm.controls.minNumOfInstance.value === 0 || !this.autoScalingForm.controls.minNumOfInstance.value) {
                this.autoScalingForm.controls.minNumOfInstance.setErrors({ 'minValue': true });
            }
        } else {
            this.autoScalingForm.controls.maxNumOfInstance.clearValidators();
            this.autoScalingForm.controls.maxNumOfInstance.updateValueAndValidity();
            this.autoScalingForm.controls.minNumOfInstance.clearValidators();
            this.autoScalingForm.controls.minNumOfInstance.updateValueAndValidity();
            this.autoScalingForm.controls.cpuThreshold.clearValidators();
            this.autoScalingForm.controls.cpuThreshold.updateValueAndValidity();
            this.autoScalingForm.controls.transactionPerSecondThreshold.clearValidators();
            this.autoScalingForm.controls.transactionPerSecondThreshold.updateValueAndValidity();
            this.autoScalingForm.controls.desiredNumberOfInstance.setValidators([Validators.required]);
            this.autoScalingForm.controls.desiredNumberOfInstance.updateValueAndValidity();
        }
    }

    calculateMaxInstance() {
        let maxForCPU = null;
        let maxForMemory = null;
        let maxForStorage = null

        if (Number.isInteger(+this.autoScalingForm.controls.maxCpu.value)) {
            maxForCPU = +this.minCPUoptions.ceil / +this.autoScalingForm.controls.maxCpu.value > 1 ?
                Math.floor(+this.minCPUoptions.ceil / +this.autoScalingForm.controls.maxCpu.value) :
                +this.minCPUoptions.ceil / +this.autoScalingForm.controls.maxCpu.value;
        }
        else {
            maxForCPU = +this.minCPUoptions.ceil * +this.autoScalingForm.controls.maxCpu.value > 1 ?
                Math.floor(+this.minCPUoptions.ceil * +this.autoScalingForm.controls.maxCpu.value) :
                +this.minCPUoptions.ceil * +this.autoScalingForm.controls.maxCpu.value;
        }

        if (Number.isInteger(+this.autoScalingForm.controls.maxMemory.value)) {
            maxForMemory = +this.maxRamOptions.ceil / +this.autoScalingForm.controls.maxMemory.value > 1 ?
                Math.floor(+this.maxRamOptions.ceil / +this.autoScalingForm.controls.maxMemory.value) :
                +this.maxRamOptions.ceil / +this.autoScalingForm.controls.maxMemory.value;
        }
        else {
            maxForMemory = +this.maxRamOptions.ceil * +this.autoScalingForm.controls.maxMemory.value > 1 ?
                Math.floor(+this.maxRamOptions.ceil * +this.autoScalingForm.controls.maxMemory.value) :
                +this.maxRamOptions.ceil * +this.autoScalingForm.controls.maxMemory.value;
        }

        if (Number.isInteger(+this.autoScalingForm.controls.maxStorage.value)) {
            maxForStorage = +this.maxStorageOptions.ceil / +this.autoScalingForm.controls.maxStorage.value > 1 ?
                Math.floor(+this.maxStorageOptions.ceil / +this.autoScalingForm.controls.maxStorage.value) :
                +this.maxStorageOptions.ceil / +this.autoScalingForm.controls.maxStorage.value;
        }
        else {
            maxForStorage = +this.maxStorageOptions.ceil * +this.autoScalingForm.controls.maxStorage.value > 1 ?
                Math.floor(+this.maxStorageOptions.ceil * +this.autoScalingForm.controls.maxStorage.value) :
                +this.maxStorageOptions.ceil * +this.autoScalingForm.controls.maxStorage.value;
        }
        // const maxForMemory = Math.floor(+this.maxRamOptions.ceil / +this.autoScalingForm.controls.maxMemory.value);
        // const maxForStorage = Math.floor(+this.maxStorageOptions.ceil / +this.autoScalingForm.controls.maxStorage.value);
        this.instanceOptions.ceil = Math.min(maxForCPU, maxForMemory, maxForStorage) > 1 ? Math.min(maxForCPU, maxForMemory, maxForStorage) : 1;
        this.instanceOptions = { ...this.instanceOptions };
    }

}

