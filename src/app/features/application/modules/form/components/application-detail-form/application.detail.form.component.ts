import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ApplicationBuildTypes, ApplicationTypes } from '../../../../services/domain/application.enums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../../../../team/services/service-api/team.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { CurrentUserService } from '../../../../../../services/current-user.service';
import { FormBaseClass } from '../../../../../../shared/form.base.class';
import { NewApplication } from '../../../../services/domain/application.model';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';


@Component({
    selector: 'app-application-detail-form',
    templateUrl: './application.detail.form.component.html',
    animations: [
        trigger('myInsertRemoveTrigger', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('.25s', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('.25s', style({ opacity: 0 }))
            ])
        ]),
    ]
})

export class ApplicationDetailFormComponent extends FormBaseClass implements OnInit {
    applicationDetailForm: FormGroup;
    packageName = "";
    repoChecker = false;
    // repoBranches = [];
    // appFromListChecker = false;
    dropdownSettings: any;
    // applicationId: string;
    applicationBuildTypes = ApplicationBuildTypes;
    teams = [{ name: "Select a team", id: null }];
    appTypes = ApplicationTypes;
    companyId: string;
    _unsubscribeAll: Subject<any>;
    repositoryName = null;
    appType = '';
    creationType = '';
    repoName = '';
    repoBranches = ['Select a branch'];
    applicationType = '';

    @Input() set applicationId(value) {
        if (value) {
            this.applicationDetailForm.controls.applicationId.setValue(value);
        }
    }

    @Input() set applicationFormData(value) {
        if (value) {
            this.initForm(value);
        }
    }

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private teamService: TeamService,
        private applicationService: ApplicationService,
        private alertService: AlertService,
        private currentUserService: CurrentUserService,
        private route: ActivatedRoute,
        private titlecasePipe: TitleCasePipe
    ) {
        super();
    }

    ngOnInit() {
        this.initForm(null);
        this.getTeamList();
        this.setInitialPackageName();
        // this.setDropDownSetting();
        this.handleQueryParmas();
    }

    handleQueryParmas() {
        this.route.queryParams.subscribe(
            param => {
                if (param.appCreationType) {
                    this.creationType = param.appCreationType === 'newApp' ? 'NEW_APP' : 'FROM_GIT_SOURCE';
                    this.applicationDetailForm.controls.appCreationType.setValue(this.creationType);
                }
                if (param.applicationType) {
                    this.appType = param.applicationType;
                    if (this.appType !== '') {
                        this.appType = this.titlecasePipe.transform(this.appType.split('_').join(' '));
                        this.applicationDetailForm.controls.applicationType.setValue(param.applicationType);
                    }
                }
                if (param.repoName) {
                    this.repoName = param.repoName;
                    this.applicationDetailForm.controls.name.setValue(param.repoName);
                    this.fetchBranches();
                }
                const source = param.appCreationType;
                switch (source) {
                    case 'fromRepo':
                        this.repoChecker = true;
                        break;
                    case 'newApp':
                        this.repoChecker = false;
                        // this.appFromListChecker = false;
                        break;

                }
            });
    }

    fetchBranches() {
        this.applicationService.getBranches(this.repoName).subscribe(
            (res: any) => {
                this.repoBranches = [this.repoBranches, ...res.data];
            });
    }


    // setDropDownSetting() {
    //     this.dropdownSettings = {
    //         singleSelection: false,
    //         idField: 'id',
    //         textField: 'name',
    //         selectAllText: 'Select All',
    //         unSelectAllText: 'UnSelect All',
    //     };
    // }

    getTeamList() {
        this.teamService.getTeamList().subscribe(teamList => {
            this.teams = this.teams.concat(teamList.data.content);
        });
    }

    setInitialPackageName() {
        const currentUser = this.currentUserService.get();
        this.applicationDetailForm.controls.packageName.setValue(
            "com." + currentUser.userInfo.company.name.toLowerCase().split(' ').join('')
        );
        this.packageName = this.applicationDetailForm.controls.packageName.value;
    }


    modifyPackageName(input) {
        // console.log(input);
        // if (input.key === 'Backspace') {
        //   this.packageName = this.packageName.slice(0, -1);
        //   this.applicationDetailForm.controls.packageName.setValue(this.packageName);
        // }
        // else if (input.target.value !== this.packageName) {
        //   this.packageName = (this.packageName + input.target.value[input.target.value.length - 1]).toLowerCase();
        //   this.applicationDetailForm.controls.packageName.setValue(this.packageName);
        // }
        // this.packageName = (this.packageName + input);
        this.applicationDetailForm.controls.packageName.setValue(this.packageName + "." +
            input.toLowerCase().replace(/[^a-z][^0-9]/gi, '.'));
    }


    initForm(formData: NewApplication) {
        formData = formData ? formData : new NewApplication();
        // formData.branchName = formData.branchName ? formData.branchName : "master";

        this.applicationDetailForm = this.fb.group({
            applicationId: [formData.id ? formData.id : formData.applicationId ? formData.applicationId : null],
            name: [formData.name, Validators.required],
            packageName: [formData.packageName],
            applicationType: [formData.type ? formData.type : this.appType, Validators.required],
            appCreationType: [formData.creationType ? formData.creationType : this.creationType],
            teamId: [formData.team.id, Validators.required],
            gitRepositoryName: [formData.gitRepositoryName],
            gitBranchName: [formData.gitBranchName],
            applicationBuildType: [formData.buildType]
        });
        if (this.repositoryName) {
            this.applicationDetailForm.controls.gitRepositoryName.setValue(this.repositoryName);
        }
        if (this.repoChecker) {
            this.applicationDetailForm.controls.gitBranchName.setValidators(Validators.required);
        }
        // this.applicationDetailForm.controls.ingressEnabled.setValue(true);
        // this.applicationDetailForm.controls.minNumOfInstance.setValue(1);
        // this.applicationDetailForm.controls.maxNumOfInstance.setValue(1);

        // this.applicationDetailForm.controls.istioEnabled.disable();
        // this.applicationDetailForm.controls.istioIngressGatewayEnabled.disable();
        // this.applicationDetailForm.controls.blueGreenDeploymentEnabled.valueChanges.subscribe(
        //   val => {
        //     this.applicationDetailForm.controls.istioEnabled.setValue(this.applicationDetailForm.controls.blueGreenDeploymentEnabled.value);
        //     if (val) {
        //       this.applicationDetailForm.controls.istioIngressGatewayEnabled.enable();
        //       this.applicationDetailForm.controls.ingressEnabled.clearValidators();

        //     } else{
        //       this.applicationDetailForm.controls.blueGreenDeploymentEnabled.clearValidators();
        //       this.applicationDetailForm.controls.ingressEnabled.setValidators([Validators.required]);

        //     }
        //   }
        // );

        this.applicationDetailForm.controls.applicationType.valueChanges.subscribe(
            value => {
                if (value === 'SPRING_BOOT') {
                    this.applicationDetailForm.controls.packageName.setValidators([Validators.required]);
                    this.applicationDetailForm.controls.applicationBuildType.setValidators([Validators.required]);
                }
                else {
                    this.applicationDetailForm.controls.packageName.clearValidators();
                    this.applicationDetailForm.controls.applicationBuildType.clearValidators();
                }
            }
        );
    }


    submit() {
        this.markFormGroupasTouchedandDirty(this.applicationDetailForm);

        if (this.formInvalid(this.applicationDetailForm)) { return; }

        let newApp = new NewApplication();
        newApp = this.applicationDetailForm.value;
        if (!this.applicationDetailForm.controls.applicationId.value) {
            this.applicationService.createNewApplication(newApp)
                .subscribe((res) => {
                    this.alertService.sendAlert(res);
                    res.data.creationType = this.creationType;
                    this.onSave.emit(res.data);
                });
        }
        else {
            this.applicationService.updateApplication(newApp)
                .subscribe((res) => {
                    this.alertService.sendAlert(res);
                    res.data.creationType = this.creationType;
                    this.onSave.emit(res.data);
                });
        }
    }

    // get formInvalid() {
    //     return this.applicationDetailForm.invalid;
    // }

    // ngOnDestroy() {
    //     this._unsubscribeAll.next();
    //     this._unsubscribeAll.complete();
    // }
}