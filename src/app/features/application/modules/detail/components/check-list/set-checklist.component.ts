import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBaseClass } from '../../../../../../shared/form.base.class';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../../../../../services/theme.service';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-set-checklist',
    templateUrl: './set-checklist.component.html',
    styleUrls: ['./set-checklist.component.css']
})

export class SetChecklistComponent extends FormBaseClass implements OnInit {

    themeClass = "theme-cyan";
    smallScreenMenu = "";

    appId: string;
    appEnvId: string;
    envName: string;

    checkListData: any;

    initialSelection = [];
    allowMultiSelect = true;

    newCheckItemMessage: string;
    newCheckItemAuthority: string;

    newCheckItemForm: FormGroup;

    editCheckItemForm: FormGroup;

    authorityList = [];
    dropdownSettings: any;

    addingCheckItem = false;
    updatingCheckItem = false;
    deletingCheckItem = false;

    currentEditingIndex = -1;


    @Input('applicationId') set applicationId(value) {
        this.appId = value;
    }

    @Input('appEnvironmentId') set appEnvironmentId(value) {
        this.appEnvId = value;
    }

    @Input('environmentName') set environmentName(value) {
        this.envName = value;
    }

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private themeService: ThemeService,
        private applicationService: ApplicationService,
        private alertService: AlertService

    ) {
        super();
        this.newCheckItemMessage = "";
        this.newCheckItemAuthority = "ROLE_ADMIN";
    }

    ngOnInit() {
        this.setThemeandShowMenu();
        this.getAppEnvChecklist();
        this.setDropDownSetting();
        this.setAuthorityList();
        this.initNewCheckItemForm();
    }

    getAppEnvChecklist() {
        const queryParams = { 'appId': this.appId, 'appEnvId': this.appEnvId };
        this.applicationService.getAppEnvironmentChecklist(queryParams).subscribe((response: any) => {
            console.log(response);
            this.checkListData = response.data == null ? [] : response.data;
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

    setAuthorityList() {
        this.authorityList = [
            { label: 'Admin', value: 'ROLE_ADMIN' },
            { label: 'Dev', value: 'ROLE_DEV' },
            { label: 'Ops', value: 'ROLE_OPS' },
        ];
    }

    initNewCheckItemForm() {
        this.newCheckItemForm = this.fb.group({
            message: ['', [Validators.required]],
            authorities: [[{ label: 'Admin', value: 'ROLE_ADMIN' }], [Validators.required]]
        });
    }

    initEditCheckItemForm(index) {
        if (this.currentEditingIndex > 0) {
            this.checkListData.checklist[this.currentEditingIndex]['editMode'] = false;
        }
        this.currentEditingIndex = index;
        this.checkListData.checklist[index]['editMode'] = true;

        const authorities = [];

        for (let i = 0; i < this.checkListData.checklist[index].authority.length; i++) {
            let authorityLabel = "";
            if (this.checkListData.checklist[index].authority[i] === "ROLE_ADMIN") {
                authorityLabel = "Admin";
            } else if (this.checkListData.checklist[index].authority[i] === "ROLE_DEV") {
                authorityLabel = "Dev";
            } else if (this.checkListData.checklist[index].authority[i] === "ROLE_OPS") {
                authorityLabel = "Ops";
            }
            authorities.push({
                    label: authorityLabel,
                    value: this.checkListData.checklist[index].authority[i]
                }
            );

        }

        this.editCheckItemForm = this.fb.group({
            id: [this.checkListData.checklist[index].id, [Validators.required]],
            message: [this.checkListData.checklist[index].message, [Validators.required]],
            authorities: [authorities, [Validators.required]]
        });
    }

    setThemeandShowMenu() {
        this.themeService.themeClassChange.subscribe(themeClass => {
            this.themeClass = themeClass;
        });

        this.themeService.smallScreenMenuShow.subscribe(showMenuClass => {
            this.smallScreenMenu = showMenuClass;
        });
    }

    addToChecklist() {
        this.markFormGroupasTouchedandDirty(this.newCheckItemForm);
        if (this.formInvalid(this.newCheckItemForm)) { return; }

        if (!this.addingCheckItem) {
            this.addingCheckItem = true;

            const formValue = this.newCheckItemForm.value;

            const checkItem = {
                "message": formValue.message,
                "authority": []
            };

            for (let i = 0; i < formValue.authorities.length; i++) {
                checkItem.authority.push(formValue.authorities[i].value);
            }

            const postBody = {
                "applicationId": this.appId,
                "appEnvironmentId": this.appEnvId,
                "checklists": [checkItem]
            };

            this.applicationService.addAppEnvironmentChecklistItem(postBody).subscribe(
                data => {
                    this.alertService.sendAlert(data);
                    if (data.status === "success") {
                        this.initNewCheckItemForm();
                        this.markFormGroupAsClean(this.newCheckItemForm);
                        this.getAppEnvChecklist();
                    } else {
                        console.log(data);
                    }
                    this.addingCheckItem = false;

                }, error => {
                    console.log(error);
                    this.addingCheckItem = false;
                    this.alertService.sendErrorAlert("Failed to add!");
                }
            );
        }
    }

    updateChecklistItem() {
        this.markFormGroupasTouchedandDirty(this.editCheckItemForm);
        if (this.formInvalid(this.editCheckItemForm)) { return; }

        if (!this.updatingCheckItem) {
            this.updatingCheckItem = true;

            const formValue = this.editCheckItemForm.value;

            const checkItem = {
                "id": formValue.id,
                "message": formValue.message,
                "authority": []
            };

            for (let i = 0; i < formValue.authorities.length; i++) {
                checkItem.authority.push(formValue.authorities[i].value);
            }

            const postBody = {
                "appEnvChecklistId": this.checkListData.id,
                "checkItemId": checkItem.id,
                "message": checkItem.message,
                "authority": checkItem.authority
            };

            this.applicationService.updateAppEnvironmentChecklistItem(postBody).subscribe(
                data => {
                    this.alertService.sendAlert(data);
                    if (data.status === "success") {
                        this.checkListData.checklist[this.currentEditingIndex]['editMode'] = false;
                        this.markFormGroupAsClean(this.editCheckItemForm);
                        this.getAppEnvChecklist();
                    } else {
                        console.log(data);
                    }
                    this.updatingCheckItem = false;

                }, error => {
                    console.log(error);
                    this.updatingCheckItem = false;
                    this.alertService.sendErrorAlert("Failed to update!");
                }
            );
        }
    }

    onEditInputKeydown(event) {
        console.log(event.key)
        if (event.key === "Escape") {
            this.checkListData.checklist[this.currentEditingIndex]['editMode'] = false;
        }
    }

    deleteChecklistItem(checkItemId, index) {
        if (!this.deletingCheckItem) {
            this.deletingCheckItem = true;
            const postBody = {
                "appEnvChecklistId": this.checkListData.id,
                "checkItemIds": [checkItemId]
            };

            this.applicationService.deleteAppEnvironmentChecklistItem(postBody).subscribe(
                data => {
                    this.alertService.sendAlert(data);
                    if (data.status === "success") {
                        this.checkListData.checklist.splice(index, 1);
                        this.getAppEnvChecklist();
                    } else {
                        console.log(data);
                    }
                    this.deletingCheckItem = false;

                }, error => {
                    console.log(error);
                    this.deletingCheckItem = false;
                    this.alertService.sendErrorAlert("Failed to delete!");
                }
            );
        }
    }

}
