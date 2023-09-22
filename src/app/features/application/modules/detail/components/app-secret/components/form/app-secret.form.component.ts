import {Component, Input, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl,FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBaseClass} from "../../../../../../../../shared/form.base.class";
import {AppSecret} from "../../services/domain/app-secret.model";
import {ThemeService} from "../../../../../../../../services/theme.service";
import {AppSecretService} from "../../services/service-api/app-secret.service";

@Component({
    selector: 'app-secret-form',
    templateUrl: './app-secret.form.component.html'
})


export class AppSecretFormComponent extends FormBaseClass {

    @Output() onSave = new EventEmitter<boolean>();

    appSecretForm: FormGroup;
    modalHeader: string;
    modalActionButton: string;

    dropdownSettings: any;
    applicationId: string;
    appSecretId: string;
    environmentList: any;
    envList: any;
    editModal: boolean;
    unamePattern:string;

    themeClass: string = "theme-cyan";
    smallScreenMenu = "";


    constructor(
        private themeService: ThemeService,
        private fb: FormBuilder,
        private appSecretService: AppSecretService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        this.setThemeandShowMenu();
        this.setDropDownSetting();
        this.editModal = false;
        this.envList = [
            {
                label: "None",
                value: null
            }
        ];
    }

    setThemeandShowMenu() {
        this.themeService.themeClassChange.subscribe(themeClass => {
            this.themeClass = themeClass;
        });

        this.themeService.smallScreenMenuShow.subscribe(showMenuClass => {
            this.smallScreenMenu = showMenuClass;
        });
    }

    setDropDownSetting() {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'value',
            textField: 'label',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
        };
    }

    getAppSecretEnvironmentList(applicationId) {
        this.appSecretService.getAppSecretEnvironmentList(applicationId).subscribe(
            dataList => {
                if (dataList.data.length > 0) {
                    this.envList = [];
                    for(let i = 0; i < dataList.data.length; i++) {
                        this.envList.push({
                            label: dataList.data[i]['environmentName'],
                            value: dataList.data[i]['appEnvironmentId']
                        });
                    }
                }
            }
        );
    }

    createAppSecretForm(applicationId) {
        this.modalHeader = 'Create new app secret';
        this.modalActionButton = 'Save';
        this.applicationId = applicationId;
        this.getAppSecretEnvironmentList(applicationId);
        this.initForm(new AppSecret());
    }

    editAppSecretForm(selectedAppSecret,applicationId) {
        this.modalHeader = 'Edit app secret';
        this.modalActionButton = 'Update';
        this. ngOnInit();
        this.editModal = true;
        this.appSecretId = selectedAppSecret.id;
        this.applicationId = applicationId;
        this.getAppSecretEnvironmentList(applicationId);
        this.environmentList = selectedAppSecret.environmentList;
        selectedAppSecret.environmentList = [];
        for(let i = 0; i < this.environmentList.length; i++) {
            selectedAppSecret.environmentList.push({
                label: this.environmentList[i]['environmentName'],
                value: this.environmentList[i]['appEnvironmentId']
            });
        }

        this.initForm(selectedAppSecret);
    }
    
    initForm(formData) {
        this.unamePattern = "[a-zA-Z0-9_ -]*";
        formData = formData ? formData : new AppSecret();
        if(formData.id){
            let fbArray = [];
            for(var i =0; i < formData.dataList.length; i++){
                let fbGroup = this.fb.group({
                    name: new FormControl({value: formData.dataList[i]['name'], disabled: false}, Validators.required),
                    value: new FormControl({value: formData.dataList[i]['value'], disabled: false}, Validators.required)
                });
                fbArray.push(fbGroup);
            }
            this.appSecretForm = this.fb.group({
                id: [formData.id ? formData.id : null],
                secretName: [{value: formData.secretName, disabled: this.editModal}, Validators.required],
                useAsEnvironmentVariable: [formData.useAsEnvironmentVariable],
                environmentList: [formData.environmentList, [Validators.required]],
                dataList: this.fb.array(fbArray, Validators.required)

            });
        } else {
            this.appSecretForm = this.fb.group({
                secretName: [formData.secretName, [Validators.required , Validators.pattern(this.unamePattern)]],
                useAsEnvironmentVariable: [formData.useAsEnvironmentVariable ? formData.useAsEnvironmentVariable : true],
                environmentList: [formData.environmentList, [Validators.required]],
                dataList: this.fb.array([
                    this.fb.group({
                        name: new FormControl({value: '', disabled: false}, Validators.required),
                        value: new FormControl({value: '', disabled: false}, Validators.required)
                    }),
                ], Validators.required)
            });
        }
    }

    submit() {

        this.markFormGroupasTouchedandDirty(this.appSecretForm);
        for(let i=0; i < this.appSecretForm.controls['dataList']['controls'].length ; i++) {
            this.markFormGroupasTouchedandDirty(this.appSecretForm.controls['dataList']['controls'][i]);
        }

        if (this.formInvalid()) { return; }

        const newAppSecret = this.appSecretForm.getRawValue();
        newAppSecret['applicationId'] = this.applicationId;
        this.environmentList = newAppSecret['environmentList'];
        newAppSecret['environmentList'] = [];
        for(let i = 0; i < this.environmentList.length; i++) {
            newAppSecret['environmentList'].push({
                environmentName : this.environmentList[i]['label'],
                appEnvironmentId : this.environmentList[i]['value']
            })
        }
        if (this.appSecretId) {
            this.updateAppSecret(newAppSecret);
        }
        else {
            this.createAppSecret(newAppSecret);
        }
    }

    formInvalid() {
        return this.appSecretForm.invalid;
    }

    createAppSecret(newAppSecret) {
        this.appSecretService.createAppSecret(newAppSecret).subscribe(
            data => {
                this.toastr.success(data['message'], 'App secret Created');
                this.onSave.emit(true);
            }
        )
    }

    get addDynamicElement() {
        return this.appSecretForm.controls['dataList'] as FormArray;
    }

    addItems() {
        this.addDynamicElement.push(this.fb.group({
            name: new FormControl({value: '', disabled: false}, Validators.required),
            value: new FormControl({value: '', disabled: false}, Validators.required)
        }));
    }

    removeItem(i) {
        this.addDynamicElement.removeAt(i);
    }

    updateAppSecret(newAppSecret) {
        this.appSecretService.updateAppSecret(newAppSecret).subscribe(
            data => {
                this.toastr.success(data['message'], 'App Secret Updated');
                this.onSave.emit(true);
            }
        )
    }
}