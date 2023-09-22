import { Component, Input, OnInit, ViewChild, Output, EventEmitter, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { Vpc, ApplicationEnvironmentMapping, ChangedResource } from '../../../../../../main/settings/environment-settings/services/domain/environment-settings-model';
import { EnvironmentSettingsService } from '../../../../../../main/settings/environment-settings/services/service-api/environment-settings.service';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoScalingConfigFormComponent } from '../auto-scaling-form/auto.scaling.form.component';
import { throwError } from 'rxjs';
import { VpcService } from '../../../../../vpc/services/service-api/vpc.service';
import { ApplicationVPCMappingComponent } from '../vpc-mapping/vpc.mapping.component';


@Component({
    selector: 'app-resource-config',
    templateUrl: './resource.configuration.component.html',
    styleUrls: [
        '../vpc-mapping/vpc.mapping.component.scss',
        './resource.configuration.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})

export class ApplicationResourceConfigurationComponent implements OnInit {

    appId: string;
    appCompanyId: string;
    environmentList;
    vpcRemoveWarn = false;
    vpcRemoveWarning: string[];
    mapSource = '';
    currentVPCs = [];
    applicationEnvironments = [];
    sameVpcConfigChecker = false;
    developmentEnvironment;
    invalidVpcConfig = false;
    environmentMappingList: ApplicationEnvironmentMapping = new ApplicationEnvironmentMapping();
    generalAvailableReosurce = {};
    environmentListOptions = [];
    selectedEnvironmentId;
    defaultVPCs = [];
    selectedEnvironment = null;
    initialApplicationEnvironments = [];
    vpcListForMapping = [];

    @Input('applicationId') set applicationId(value) {
        this.appId = value;
        if (this.appId) {
            this.getEnvironmentListForApplication();
            // this.getEnvironmentListForApplication();
        }
    }


    @Output() onSave = new EventEmitter<ApplicationEnvironmentMapping>();

    // @ViewChild('removeVpcModal') removeChildModalContent;
    @ViewChild('vpcMappingModal') vpcMappingModalContent;
    @ViewChild('vpcMapping') vpcMappingComponent: ApplicationVPCMappingComponent;

    @ViewChildren(AutoScalingConfigFormComponent) autoScalingForms: QueryList<AutoScalingConfigFormComponent>;


    constructor(
        private _environmentSettingsService: EnvironmentSettingsService,
        private _applicationService: ApplicationService,
        private _alertService: AlertService,
        private _modal: NgbModal,
        private _vpcService: VpcService
    ) { }

    ngOnInit() {
        this.environmentMappingList.environmentList = [];
        // this.getEnvironmentListForCompany();
    }

    getEnvironmentListOptions() {
        this.applicationEnvironments = [];
        this._environmentSettingsService.getEnvironmentOptionsList().subscribe(
            res => {
                res.data.map((env: any) => env.checked = false);
                this.environmentListOptions = res.data;
                if (this.initialApplicationEnvironments.length === 1 &&
                    this.initialApplicationEnvironments[0].environment.shortName === 'Dev') {
                    this.setApplicationEnvironments(this.environmentListOptions.filter(env => env.shortName === 'Prod')[0]);
                }
                else {
                    this.initialApplicationEnvironments.map(
                        env => {
                            this.setApplicationEnvironments(env);
                            console.log(this.applicationEnvironments);
                        }
                    );
                }
                this.getVPCList();
            }
        );
    }

    getVPCList() {
        this._vpcService.getVpcList().subscribe(
            res => {
                this.defaultVPCs = JSON.parse(JSON.stringify(res.data));
                // this.defaultVPCs = tempDefaultArray;
                this.currentVPCs = JSON.parse(JSON.stringify(res.data));
                // finding vpc with maximum resource

                if (this.initialApplicationEnvironments.length === 1 &&
                    this.initialApplicationEnvironments[0].environment.shortName === 'Dev') {
                    this.currentVPCs.map(
                        vpc => {
                            vpc.points = vpc.availableCPU * 2000;
                            vpc.points += vpc.availableMemory * 0.5;
                            vpc.points += vpc.availableStorage * 0.01;

                            vpc.availableResouce = {
                                availableCPU: vpc.availableCPU,
                                availableMemory: vpc.availableMemory,
                                availableStorage: vpc.availableStorage
                            };
                        }
                    );
                    const tempCurrentVpcs = JSON.parse(JSON.stringify(this.currentVPCs));
                    const initialVpc = tempCurrentVpcs.sort((prev, next) => +next.points - +prev.points)[0];
                    initialVpc.vpcId = initialVpc.id;
                    this.applicationEnvironments[0].appVpcList.push(initialVpc);
                    this.applicationEnvironments[0].selectedVpcList.push(initialVpc);
                }
            }
        );
    }

    // getEnvironmentListForCompany() {
    //     this._environmentSettingsService.getEnvironmentOptionsForCompany().subscribe(
    //         res => {
    //             const tempEnvironmentList = res.data.content;
    //             tempEnvironmentList.map(env => {
    //                 if (env.vpcList) {
    //                     env.vpcList.map(vpc => { vpc.checked = false; });
    //                     if (this.currentVPCs.length <= 0) {
    //                         env.vpcList[0].environmentName = env.environment.shortName;
    //                         this.setInitialCurrentVPC(env);
    //                         this.setInitialApplicationEnvironments(env);
    //                         this.setInitialEnvironmentMapping(env);
    //                     }
    //                 }
    //             });
    //             this.environmentList = tempEnvironmentList;
    //             if (this.appId) {
    //                 this.getEnvironmentListForApplication();
    //             }
    //         }
    //     );
    // }

    // setInitialCurrentVPC(env) {
    //     env.vpcList[0].environmentName = env.environment.shortName;
    //     this.currentVPCs = [env.vpcList[0]];
    //     this.mapAutoScalingResource();
    // }

    setApplicationEnvironments(env) {
        const devEnvChecker = (env.environment ? env.environment.shortName === 'Dev' : env.shortName === 'Dev') &&
            (env.appVpcList ? env.appVpcList.length === 0 : true);
        if (!devEnvChecker) {
            this.environmentListOptions.find(envOption => envOption.id ===
                (env.environment ? env.environment.id : env.id)).checked = true;

            this.applicationEnvironments = [...this.applicationEnvironments, {
                'environment': env.environment ? env.environment : env,
                'environmentId': env.environment ? env.environment.id : env.id,
                'appVpcList': env.appVpcList ? env.appVpcList : [],
                'selectedVpcList': env.appVpcList ? env.appVpcList : []
            }];
        }
    }

    // setInitialEnvironmentMapping(env) {
    // let initialVpc: Vpc = new Vpc();
    // initialVpc = env.vpcList[0];
    // initialVpc.vpcId = env.vpcList[0].id;
    // this.environmentMappingList.environmentList = [{
    //     companyEnvironmentId: env.id,
    //     selectedVpcList: [initialVpc]
    // }];
    // }

    changeEnvironment(envToChange) {
        if (!envToChange.checked) {
            this.applicationEnvironments.push({
                'environment': envToChange,
                'environmentId': envToChange.id,
                'appVpcList': [],
                'selectedVpcList': []
            });
            this.applicationEnvironments =
                [...this.applicationEnvironments.sort((prevEnv, nextEnv) => +prevEnv.environment.orderNo - +nextEnv.environment.orderNo)];
        }
        else {
            const envtoChangeIndex = this.applicationEnvironments.findIndex(
                appEnv => appEnv.environmentId === envToChange.id
            );
            if (envtoChangeIndex >= 0) {
                const tempEnvs = [...this.applicationEnvironments];
                tempEnvs[envtoChangeIndex].appVpcList.map(
                    vpc => {
                        vpc.environmentId = tempEnvs[envtoChangeIndex].environmentId;
                        const tempDefaultVpcs = JSON.parse(JSON.stringify(this.defaultVPCs));
                        const defaultVpc = tempDefaultVpcs.find(defVpc => defVpc.id === vpc.vpcId);
                        this.mapResourseChange(vpc, defaultVpc, true);
                    }
                );
                tempEnvs.splice(envtoChangeIndex, 1);
                this.applicationEnvironments = tempEnvs;
            }
        }
        envToChange.checked = !envToChange.checked;
    }

    getEnvironmentListForApplication() {
        // TODO: Add store here
        const queryParams = { 'fetchMode': 'ALL', 'filterParams': `{"appId": "${this.appId}"}` };
        this._environmentSettingsService.getApplicationEnvironments(queryParams).subscribe(
            res => {
                if (res.data) {
                    if (res.data.appEnvironmentList) {
                        this._applicationService.setApplicationEnvironments(res.data.appEnvironmentList);
                        res.data.appEnvironmentList.map(
                            env => {
                                if (env.appVpcList && env.appVpcList.length > 0) {
                                    env.appVpcList.map(
                                        appVpc => {
                                            appVpc.availableCPU = appVpc.vpc.availableCPU;
                                            appVpc.availableMemory = appVpc.vpc.availableMemory;
                                            appVpc.availableStorage = appVpc.vpc.availableStorage;
                                            appVpc.availableResouce = {
                                                availableCPU: appVpc.vpc.availableCPU,
                                                availableMemory: appVpc.vpc.availableMemory,
                                                availableStorage: appVpc.vpc.availableStorage
                                            };
                                            appVpc.vpcId = appVpc.vpc.id;
                                            appVpc.name = appVpc.vpc.name;
                                        }
                                    );

                                    env.selectedVpcList = env.appVpcList;
                                }
                            }
                        );
                        this.initialApplicationEnvironments = res.data.appEnvironmentList;
                        this.getEnvironmentListOptions();
                    }
                }
            }
        );
    }

    // Old implementation of getEnvironmentListForApplication

    //         let tempAppEnvironments = [];
    //         let checker = 0;
    //         this.sameVpcConfigChecker = res.data.application.useSameConfigInAllAppVpc ?
    //             res.data.application.useSameConfigInAllAppVpc : false;

    //         /* Tackaling empty vpc list for the first time. The vpc list
    //        is null for the first application environment.So the list
    //        should not be update. It should be the initial list updated
    //        on setInitialApplicationEnvironments function
    //     */

    //         let i = 0;
    //         tempAppEnvironments = res.data.appEnvironmentList.map(env => {
    //             if (env.environment.shortName === 'Dev') {
    //                 this.developmentEnvironment = env;
    //             }
    //             if (env.appVpcList) {
    //                 this.currentVPCs = [];
    //                 const newMapping: ApplicationEnvironmentMapping = new ApplicationEnvironmentMapping();

    //                 newMapping.applicationId = this.appId;
    //                 newMapping.forceRemove = env.forceRemove;
    //                 newMapping.useSameConfig = env.useSameConfig;

    //                 newMapping.environmentList.push(env);
    //                 newMapping.environmentList[i].selectedVpcList = [];
    //                 env.appVpcList.map(
    //                     appVpc => {
    //                         appVpc.vpc.vpcId = appVpc.vpc.id;
    //                         newMapping.environmentList[i].selectedVpcList.push(appVpc.vpc);
    //                     }
    //                 );
    //                 this.environmentMappingList = newMapping;
    //                 return env;

    //             } else {
    //                 checker++;
    //             }
    //             i++;
    //         });

    //         /*
    //             Updating the list for editing time
    //         */
    //         if (checker !== res.data.appEnvironmentList.length) {
    //             this.applicationEnvironments = tempAppEnvironments;
    //             this.currentVPCs = [];
    //             res.data.appEnvironmentList.map(env => {
    //                 if (env.appVpcList) {
    //                     env.appVpcList.map(
    //                         appVpc => {
    //                             appVpc.vpc.environmentName = env.environment.shortName;
    //                             appVpc.vpc.resourceDetails = appVpc.resourceDetails;
    //                             this.currentVPCs.push(appVpc.vpc);
    //                         }
    //                     );
    //                 }
    //             });

    //         }
    //         setTimeout(() => {
    //             this.mapAutoScalingResource();
    //             this.mapAutoScalingForm();
    //         }, 1000);

    mapGeneralAvailableResource() {
        const allCurrentAppVpcs = [];
        this.applicationEnvironments.map(
            env => {
                env.appVpcList.map(
                    vpc => {
                        allCurrentAppVpcs.push(vpc);
                    }
                );
            }
        );

        if (this.sameVpcConfigChecker) {

            const generalAvailableCPU = allCurrentAppVpcs.sort((prev, next) => prev.availableCPU - next.availableCPU)[0].availableCPU;

            const generalAvailableMemory =
                allCurrentAppVpcs.sort((prev, next) => prev.availableMemory - next.availableMemory)[0].availableMemory;

            const generalAvailableStorage =

                allCurrentAppVpcs.sort((prev, next) => prev.availableStorage - next.availableStorage)[0].availableStorage;

            const generalAvaliableResource =
                ({ availableCPU: generalAvailableCPU, availableMemory: generalAvailableMemory, availableStorage: generalAvailableStorage });

            this.generalAvailableReosurce = generalAvaliableResource;
        }
        else {
            // tackling change in available resources of vpc
            this.applicationEnvironments.map(
                env => {
                    env.appVpcList.map(
                        (vpc, index) => {
                            // const defaultVpc = this.defaultVPCs.find(defVpc => defVpc.id === vpc.id);
                            vpc.availableCPU = vpc.availableResouce.availableCPU;
                            vpc.availableMemory = vpc.availableResouce.availableMemory;
                            vpc.availableStorage = vpc.availableResouce.availableStorage;
                            env.selectedVpcList[index] = { ...vpc };
                        }
                    );
                }
            );
            // const tempDefaultArray = [...this.defaultVPCs];
            this.currentVPCs = JSON.parse(JSON.stringify(this.defaultVPCs));

        }
    }

    mapAutoScalingForm() {
        this.autoScalingForms.map(
            (form, index) => {
                form.initForm(this.currentVPCs[index].resourceDetails);
                const temp = {
                    availableCPU: this.currentVPCs[index].availableCPU,
                    availableMemory: this.currentVPCs[index].availableMemory,
                    availableStorage: this.currentVPCs[index].availableStorage
                };
                form.vpcAvaliableResource = { ...temp };
                form.updateCeilingValues();
            }
        );
    }

    mapAutoScalingResource() {
        this.autoScalingForms.map(
            (form, index) => {
                const temp = {
                    availableCPU: this.currentVPCs[index].availableCPU,
                    availableMemory: this.currentVPCs[index].availableMemory,
                    availableStorage: this.currentVPCs[index].availableStorage
                };
                form.vpcAvaliableResource = { ...temp };
                form.updateCeilingValues();
            }
        );
    }

    openVPCMappingModal(selectedAppEnvironment) {
        this.vpcListForMapping = JSON.parse(JSON.stringify(this.currentVPCs));
        this.selectedEnvironment = JSON.parse(JSON.stringify(selectedAppEnvironment));
        this.selectedEnvironmentId = selectedAppEnvironment.environmentId;
        this._modal.open(this.vpcMappingModalContent, { centered: true, size: 'xl' as 'lg', backdrop: 'static' });
    }

    /* Function to construct new environment mapping and
       change application environments based on the selected vpcs */

    onMap(newVpcS: Vpc[]) {

        this._modal.dismissAll();
        this.selectedEnvironment.appVpcList.map(
            (vpc, index) => {
                if (!newVpcS.find(newVpc => newVpc.vpcId === vpc.vpcId)) {
                    const tempDefaultVpcs = JSON.parse(JSON.stringify(this.defaultVPCs));
                    const defaultVpc = tempDefaultVpcs.find(defVpc => defVpc.id === vpc.vpcId);
                    this.selectedEnvironment.appVpcList[index] = defaultVpc;
                    this.mapResourseChange(vpc, defaultVpc, false);
                    this.selectedEnvironment.appVpcList.slice(index, 1);
                    this.selectedEnvironment.selectedVpcList.slice(index, 1);
                }
            }
        );

        const appEnv = this.applicationEnvironments.find(appEnv => appEnv.environmentId === this.selectedEnvironmentId);
        appEnv.appVpcList = [...newVpcS];
        appEnv.selectedVpcList = [...newVpcS];




        // this._modal.dismissAll();
        // this.currentVPCs = [];

        // // change application environment as per new environment mapping
        // const tempApplicationEnvironmentList = [...data.environmentList];

        // // changing selectedVpcList to vpcList
        // this.applicationEnvironments = tempApplicationEnvironmentList.map(temp => ({
        //     companyEnvironmentId: temp.companyEnvironmentId,
        //     appVpcList: temp.selectedVpcList, shortName: temp.shortName
        // }));


        // // update environment mapping list and current VPCs
        // this.environmentMappingList = data;
        // data.environmentList.map(env =>
        //     env.selectedVpcList.map(
        //         vpc => {
        //             this.currentVPCs.push(vpc);
        //         }
        //     )
        // );

        // setting available resource to auto scaling forms
        // setTimeout(() => { this.mapAutoScalingResource(); }, 1000);

    }

    mapResourseChange(vpc, defaultVpc, checker) {
        this.onResourceChange({
            environmentId: vpc.environmentId,
            vpcId: vpc.vpcId,
            CPU: -(defaultVpc.availableCPU - vpc.availableCPU),
            memory: -(defaultVpc.availableMemory - vpc.availableMemory),
            storage: -(defaultVpc.availableStorage - vpc.availableStorage)
        }, checker);
    }

    onInitialResourceChange(resource: ChangedResource, initialChecker?: boolean) {
        const appEnvIndex = this.applicationEnvironments.findIndex(env => env.environmentId === resource.environmentId);
        // const appVpcIndex = null;
        let changedCurrentVpc: any;

        if (this.currentVPCs.length > 0) {
            const tempDefaultVpcs = JSON.parse(JSON.stringify(this.defaultVPCs));
            const defaultVpc = tempDefaultVpcs.find(vpc => vpc.id === resource.vpcId);
            changedCurrentVpc = this.currentVPCs.find(vpc => vpc.id === resource.vpcId);

            changedCurrentVpc.availableCPU = changedCurrentVpc.availableCPU - resource.CPU;
            // (changedCurrentVpc.availableCPU >= 0 ? defaultVpc.availableCPU : 0) -
            //     resource.CPU > defaultVpc.availableCPU ?
            //     defaultVpc.availableCPU : (changedCurrentVpc.availableCPU >= 0 ? defaultVpc.availableCPU : 0) - resource.CPU;

            changedCurrentVpc.availableMemory = changedCurrentVpc.availableMemory - resource.memory;
            // (changedCurrentVpc.availableMemory >= 0 ? defaultVpc.availableMemory : 0) -
            //     resource.memory > defaultVpc.availableMemory ? defaultVpc.availableMemory :
            //     (changedCurrentVpc.availableMemory >= 0 ? defaultVpc.availableMemory : 0) - resource.memory;

            changedCurrentVpc.availableStorage = changedCurrentVpc.availableStorage - resource.storage;
            // (changedCurrentVpc.availableStorage >= 0 ? defaultVpc.availableStorage : 0) -
            //     resource.storage > defaultVpc.availableStorage ?
            //     defaultVpc.availableStorage :
            //     (changedCurrentVpc.availableStorage >= 0 ? defaultVpc.availableStorage : 0) - resource.storage;
        }
    }

    onResourceChange(resource: ChangedResource, initialChecker?: boolean) {
        const appEnvIndex = this.applicationEnvironments.findIndex(env => env.environmentId === resource.environmentId);
        // const appVpcIndex = null;
        let changedCurrentVpc: any;

        if (this.currentVPCs.length > 0) {
            const tempDefaultVpcs = JSON.parse(JSON.stringify(this.defaultVPCs));
            const defaultVpc = tempDefaultVpcs.find(vpc => vpc.id === resource.vpcId);

            changedCurrentVpc = this.currentVPCs.find(vpc => vpc.id === resource.vpcId);
            changedCurrentVpc.availableCPU = (changedCurrentVpc.availableCPU >= 0 ? defaultVpc.availableCPU : 0) - resource.CPU > defaultVpc.availableCPU ?
                defaultVpc.availableCPU : (changedCurrentVpc.availableCPU >= 0 ? defaultVpc.availableCPU : 0) - resource.CPU;
            changedCurrentVpc.availableMemory = (changedCurrentVpc.availableMemory >= 0 ? defaultVpc.availableMemory : 0) - resource.memory > defaultVpc.availableMemory ? defaultVpc.availableMemory :
                (changedCurrentVpc.availableMemory >= 0 ? defaultVpc.availableMemory : 0) - resource.memory;
            changedCurrentVpc.availableStorage = (changedCurrentVpc.availableStorage >= 0 ? defaultVpc.availableStorage : 0) - resource.storage > defaultVpc.availableStorage ?
                defaultVpc.availableStorage :
                (changedCurrentVpc.availableStorage >= 0 ? defaultVpc.availableStorage : 0) - resource.storage;



            const tempAppEnvs = [...this.applicationEnvironments];

            tempAppEnvs.map((env, envIndex) => {
                const appVpcIndex = tempAppEnvs[envIndex].appVpcList.findIndex(vpc => vpc.vpcId === resource.vpcId);
                if (!initialChecker) {
                    if (appVpcIndex >= 0 && envIndex !== appEnvIndex) {
                        tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableCPU =
                            changedCurrentVpc.availableCPU;
                        tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableMemory =
                            changedCurrentVpc.availableMemory;
                        tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableStorage =
                            changedCurrentVpc.availableStorage;
                        tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableResouce = {
                            availableCPU: changedCurrentVpc.availableCPU,
                            availableMemory: changedCurrentVpc.availableMemory,
                            availableStorage: changedCurrentVpc.availableStorage
                        };
                    }
                }
                // else {
                //     if (appVpcIndex >= 0 && envIndex > appEnvIndex) {
                //         tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableCPU =
                //             changedCurrentVpc.availableCPU;
                //         tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableMemory =
                //             changedCurrentVpc.availableMemory;
                //         tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableStorage =
                //             changedCurrentVpc.availableStorage;
                //         tempAppEnvs[envIndex].appVpcList[appVpcIndex].availableResouce = {
                //             availableCPU: changedCurrentVpc.availableCPU,
                //             availableMemory: changedCurrentVpc.availableMemory,
                //             availableStorage: changedCurrentVpc.availableStorage
                //         };
                //     }
                // }
            });
            this.applicationEnvironments = tempAppEnvs;
        }



        // const changedCurrentVpc = this.currentVPCs.find(vpc => vpc.id === resource.vpcId);
        // changedCurrentVpc.availableCPU = changedCurrentVpc.availableCPU + resource.CPU;
        // changedCurrentVpc.availableMemory = changedCurrentVpc.availableMemory - resource.memory;
        // changedCurrentVpc.availableStorage = changedCurrentVpc.availableStorage - resource.storage;
    }

    submit() {

        const newEnvironmentMappingList = new ApplicationEnvironmentMapping();
        newEnvironmentMappingList.applicationId = this.applicationId;
        const tempAppEnvs = [...this.applicationEnvironments];
        newEnvironmentMappingList.environmentList = this.applicationEnvironments;

        this.environmentMappingList = newEnvironmentMappingList;
        this.invalidVpcConfig = false;
        this.environmentMappingList.applicationId = this.appId;
        // this.environmentMappingList.companyId = this.a
        if (this.vpcRemoveWarn) {
            this.environmentMappingList.forceRemove = true;
        }
        else {
            this.environmentMappingList.forceRemove = false;
        }

        if (this.sameVpcConfigChecker) {
            this.environmentMappingList.useSameConfig = true;

        }
        else {
            this.environmentMappingList.useSameConfig = false;
        }
        this.autoScalingForms.forEach(form => {
            form.submit();
        });
        if (!this.invalidVpcConfig) {
            this.addNewEnvironmentMapping();
        }

    }

    /// function to merge autoscaling information with basic information of each vpc's in Environment mapping
    onAutoScalingSave(data: Vpc) {
        if (this.sameVpcConfigChecker) {
            this.environmentMappingList.environmentList.map(
                env => {
                    if (env.selectedVpcList) {
                        const updated = env.selectedVpcList.map(
                            (appVpc: any) => {
                                this.checkAvailibility(appVpc, data);
                                appVpc = { ...appVpc, ...data };
                                appVpc.vpcId = appVpc.vpc ? appVpc.vpc.id : appVpc.id;
                                return appVpc;
                            }
                        );
                        env.selectedVpcList = updated;
                    }
                }
            );
        }
        else {
            this.environmentMappingList.environmentList.map(
                (envList, envIndex) => {
                    if (envList.selectedVpcList) {
                        const selectedVpcIndex = envList.selectedVpcList.findIndex(vpc => vpc.vpcId === data.vpcId);
                        if (selectedVpcIndex >= 0) {
                            const tempVpc = envList.selectedVpcList[selectedVpcIndex];
                            this.checkAvailibility(envList.selectedVpcList[selectedVpcIndex], data);
                            this.environmentMappingList.environmentList[envIndex].selectedVpcList[selectedVpcIndex] = {
                                ...tempVpc, ...data
                            };
                        }
                    }
                }
            );
        }
    }

    checkAvailibility(vpc, data) {
        if (vpc.availableCPU < data.maxCpu) {
            this._alertService.sendAlert({ status: 'error', message: `${vpc.name} has not enough available CPU` });
            throwError(new Error(`${vpc.name} has not enough available CPU`));
            this.invalidVpcConfig = true;
        }
        if (vpc.availableMemory < data.maxMemory) {
            this._alertService.sendAlert({ status: 'error', message: `${vpc.name} has not enough available memory` });
            throwError(new Error(`${vpc.name} has not enough available memory`));
            this.invalidVpcConfig = true;
        }
        if (vpc.availableStorage < data.maxStorage) {
            this._alertService.sendAlert({ status: 'error', message: `${vpc.name} has not enough available storage` });
            throwError(new Error(`${vpc.name} has not enough available storage`));
            this.invalidVpcConfig = true;
        }
    }

    removeVPC(vpc) {

        // update current vpcs
        // const vpcIndex = this.currentVPCs.findIndex(curr => curr.id === vpc.id);
        // const tempVpcs = [...this.currentVPCs];
        // tempVpcs.splice(vpcIndex, 1);
        // this.currentVPCs = tempVpcs;


        // update environment mapping
        // const environmentMappingEnvIndex =
        //     this.environmentMappingList.environmentList.findIndex(env => env.companyEnvironmentId === vpc.companyEnvironmentId);
        // if (environmentMappingEnvIndex >= 0) {
        //     const environmentMappingVpcIndex =
        //         this.environmentMappingList.environmentList[environmentMappingEnvIndex].selectedVpcList.findIndex(mappVpc =>
        //             mappVpc.vpcId === vpc.vpcId);

        //     if (environmentMappingVpcIndex >= 0) {
        //         const tempEnvMappingVpcs = [...this.environmentMappingList.environmentList[environmentMappingEnvIndex].selectedVpcList];
        //         tempEnvMappingVpcs.splice(environmentMappingVpcIndex, 1);
        //         if (tempEnvMappingVpcs.length > 0) {
        //             this.environmentMappingList.environmentList[environmentMappingEnvIndex].selectedVpcList = tempEnvMappingVpcs;
        //         }
        //         else {
        //             const tempEnvironmentMappingList = [...this.environmentMappingList.environmentList];
        //             tempEnvironmentMappingList.splice(environmentMappingEnvIndex, 1);
        //             this.environmentMappingList.environmentList = tempEnvironmentMappingList;
        //         }
        //     }
        // }

        // update application environments
        // const envIndex = this.applicationEnvironments.findIndex(env => env.companyEnvironmentId === vpc.companyEnvironmentId);
        // const appVpcIndex = this.applicationEnvironments[envIndex].appVpcList.findIndex(appVpc => appVpc.id === vpc.id);
        // const tempAppVpcs = [...this.applicationEnvironments];
        // tempAppVpcs[envIndex].appVpcList.splice(appVpcIndex, 1);

        // if (tempAppVpcs[envIndex].appVpcList.length > 0) {
        //     this.applicationEnvironments = tempAppVpcs;
        // }
        // else {
        //     const tempAppEnvironments = [...this.applicationEnvironments];
        //     tempAppEnvironments.splice(envIndex, 1);
        //     this.applicationEnvironments = tempAppEnvironments;
        // }
    }

    addNewEnvironmentMapping() {




        // const devEnvChecker = this.environmentMappingList.environmentList.find(env => env.companyEnvironmentId ===
        //     this.developmentEnvironment.companyEnvironmentId);
        // if (!devEnvChecker) {
        //     this.environmentMappingList.environmentList.push(this.developmentEnvironment);
        // }
        // else {

        // }
        this._environmentSettingsService.addEnvironmentToApplication(this.environmentMappingList).subscribe(
            res => {
                this._alertService.sendAlert(res);

                if (res.status !== 'warning' && res.status !== 'error') {
                    this.onSave.emit(this.environmentMappingList);
                    this.environmentMappingList = new ApplicationEnvironmentMapping();
                    this.environmentMappingList.environmentList = [];
                    this.applicationEnvironments = [];
                    this.getEnvironmentListForApplication();
                    // this.getEnvironmentListForCompany();
                    // if (this.vpcRemoveWarn) {
                    // this.vpcRemoveWarn = false;
                    // this._modal.dismissAll();
                    // } else {
                    // this.vpcRemoveWarning = res.data;
                    // TODO: remove child _modal operation
                    // this._modal.open(this.removeChildModalContent, { 'centered': true, backdrop: 'static' });
                    // }
                }
            });
    }
}
