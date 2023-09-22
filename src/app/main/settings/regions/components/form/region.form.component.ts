import { Component, OnInit, Output } from '@angular/core';
import { Region } from '../../services/domain/region.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegionService } from '../../services/service-api/region.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBaseClass} from "../../../../../shared/form.base.class";

@Component({
    selector: 'app-region-form',
    templateUrl: './region.form.component.html'
})


export class RegionFormComponent extends FormBaseClass implements OnInit {

    @Output() onSave = new EventEmitter<boolean>();

    regionForm: FormGroup;

    modalHeader: string;
    modalActionButton: string;
    regionId: number = null;
    dataLoading: boolean;

    constructor(
        private fb: FormBuilder,
        private regionService: RegionService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
    ) { super(); }

    ngOnInit() {
        this.dataLoading = true;
    }

    createRegionForm() {
        this.modalHeader = 'Create new regions';
        this.modalActionButton = 'Create';
        this.initForm(new Region());

    }

    editRegionForm(selectedRegion) {
        this.modalHeader = 'Edit Region';
        this.modalActionButton = 'Update';
        this.regionId = selectedRegion.id;
        this.initForm(selectedRegion);
    }

    initForm(formData) {
        formData = formData ? formData : new Region();
        this.regionForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            description: [formData.description],
        });
    }

    submit() {

        this.markFormGroupasTouchedandDirty(this.regionForm);

        if (this.formInvalid()) { return; }

        const newRegion = this.regionForm.value;

        if (this.regionId) {
            this.updateRegion(newRegion);
        } else {
            this.createRegion(newRegion);
            console.log(newRegion);
        }
    }

    formInvalid() {
        return this.regionForm.invalid;
    }

    createRegion(newRegion) {
        this.regionService.createRegion(newRegion).subscribe(
            data => {
                this.toastr.success(data['message'], 'Region Created');
                this.onSave.emit(true);
            }
        );
    }

    updateRegion(newRegion) {
        this.regionService.updateRegion(newRegion).subscribe(
            data => {
                this.toastr.success(data['message'], 'Region Updated');
                this.onSave.emit(true);
            }
        );
    }
}
