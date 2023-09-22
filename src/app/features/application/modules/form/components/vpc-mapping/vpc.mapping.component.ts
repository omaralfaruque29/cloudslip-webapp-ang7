import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { EnvironmentSettingsService } from '../../../../../../main/settings/environment-settings/services/service-api/environment-settings.service';
import { ApplicationEnvironmentList, ApplicationEnvironmentMapping, Vpc } from '../../../../../../main/settings/environment-settings/services/domain/environment-settings-model';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";

@Component(
    {
        selector: 'app-application-vpc-mapping',
        templateUrl: './vpc.mapping.component.html',
        styleUrls: ['./vpc.mapping.component.scss']
    }
)


export class ApplicationVPCMappingComponent {

    // appId: string;
    // appCompanyId: string;
    // vpcLists = [{ id: '1', name: 'test' }];
    // environmentMappingList: ApplicationEnvironmentMapping = new ApplicationEnvironmentMapping();
    // environmentList = [];
    // vpcRemoveWarn = false;
    // vpcRemoveWarning: string[];
    // mapSource = '';
    appEnvironments = [];
    currentVpcs = [];
    selectedEnvironment = null;
    selectedVPCs: Vpc[] = [];
    // @Input('applicationId') set applicationId(value) {
    //     this.appId = value;
    // if (this.appId) {
    //     this.mapCompanyEnvironments();
    // }
    // }

    // @Input('companyId') set companyId(value) {
    //     this.appCompanyId = value;
    // }
    @Input('applicationEnvironments') set applicationEnvironments(value) {
        this.appEnvironments = value;
        // if (this.environmentList.length > 0 && this.appEnvironments.length > 0) {
        // this.mapEnvironmentListForApplication();
        // }
    }
    @Input('vpcList') vpcList;

    @Input('selectedEnvironmentId') set selectedEnvironmentId(value) {
        this.selectedVPCs = [];
        this.currentVpcs = [];
        this.configureVpcList(value);
    }

    configureVpcList(environmentId) {
        this.selectedEnvironment = this.appEnvironments.find(env => env.environmentId === environmentId);
        this.selectedVPCs = this.selectedEnvironment.appVpcList;
        console.log(this.vpcList);
        const tempVpcs = this.vpcList.filter((vpc: Vpc) => {
            if ((vpc.availableMemory > 0 && vpc.availableStorage > 0 && vpc.availableCPU > 0) ||
                this.selectedVPCs.findIndex((selectedVpc: any) => selectedVpc.id === vpc.id) >= 0) {
                return vpc;
            }
        });

        tempVpcs.map((vpc, index) => {
            vpc.checked = false;
            if (this.selectedVPCs.find(selVpc => selVpc.vpcId === vpc.id)) {
                // tempVpcs.splice(index, 1);
                tempVpcs[index].checked = true;
            }
        });
        this.currentVpcs = tempVpcs;
    }

    changeVpcStatus(vpc, index) {
        if (!vpc.checked) {
            this.addNewVPC(vpc, index);
        }
        else {
            this.removeVPC(vpc);
        }
        vpc.checked = !vpc.checked;
    }

    addNewVPC(vpc, index) {
        vpc.vpcId = vpc.id;
        this.selectedVPCs = [...this.selectedVPCs, vpc];
        // const tempVpcs = [...this.currentVpcs];
        // tempVpcs.splice(index, 1);
        // this.currentVpcs = tempVpcs;
    }

    removeVPC(vpc) {
        const index = this.selectedVPCs.findIndex((selVpc: any) => selVpc.id === vpc.id);
        const tempVpcs = [...this.selectedVPCs];
        tempVpcs.splice(index, 1);
        this.selectedVPCs = tempVpcs;
    }

    mapVPC() {
        console.log(this.selectedVPCs);
        this.selectedVPCs.map(
            (selectedVpc: any) => {
                if (!selectedVpc.availableResource) {
                    selectedVpc.availableResouce = {
                        availableCPU: selectedVpc.availableCPU,
                        availableMemory: selectedVpc.availableMemory,
                        availableStorage: selectedVpc.availableStorage
                    };
                }
            }
        );
        this.onMap.emit(this.selectedVPCs);
    }

    // @Input('companyEnvironmentList') set companyEnvironmentList(value) {
    //     this.mapCompanyEnvironments(value);
    // }


    // @Input('source') set source(value) {
    //     this.mapSource = value;
    // }

    @Output() onMap = new EventEmitter<Vpc[]>();

    // @ViewChild('removeVpcModal') removeChildModalContent;

    constructor(
        private environmentSettingsService: EnvironmentSettingsService,
        private toastr: ToastrService,
        private applicationService: ApplicationService,
        private alertService: AlertService,
        private modal: NgbModal,
        private router: Router
    ) { }













    // mapCompanyEnvironments(environments) {
    //     const tempEnvironmentList = environments;
    //     tempEnvironmentList.map(env => {
    //         env.checked = false;
    //         env.vpcList.map(vpc => { vpc.checked = false; });
    //     });
    //     this.environmentList = tempEnvironmentList;
    //     if (this.appEnvironments.length > 0) {
    //         this.mapEnvironmentListForApplication();
    //     }
    // }

    // mapEnvironmentListForApplication() {
    //     this.appEnvironments.map(
    //         env => {
    //             const filteredEnvironment = this.environmentList.find(currentEnv => currentEnv.id === env.companyEnvironmentId);
    //             if (env.appVpcList) {
    //                 env.appVpcList.map(
    //                     appVpc => {
    //                         const vpcId = appVpc.vpcId ? appVpc.vpcId : appVpc.vpc ? appVpc.vpc.id : appVpc.id;
    //                         const filteredVpc = filteredEnvironment.vpcList.find(
    //                             flivpc => flivpc.id === vpcId);
    //                         if (filteredVpc) {
    //                             this.changeVpcToEnvironment(filteredEnvironment.id, filteredVpc);
    //                         }
    //                     }
    //                 );
    //             }
    //         }
    //     );
    // }

    // addNewEnvironment(newVpc, envId) {
    //     const companyEnvironment = this.environmentList.find(env => env.id === envId);

    //     const newEnvironmentToadd: ApplicationEnvironmentList = new ApplicationEnvironmentList();
    //     newEnvironmentToadd.companyEnvironmentId = companyEnvironment.id;
    //     newEnvironmentToadd.shortName = companyEnvironment.environment.shortName;

    //     newVpc.environmentName = companyEnvironment.environment.shortName;
    //     newEnvironmentToadd.selectedVpcList = [newVpc];

    //     this.environmentMappingList.environmentList.push(newEnvironmentToadd);
    // }

    // changeVpcToEnvironment(envId, vpc) {
    //     if (!vpc.checked) {

    //         const newVpc: Vpc = vpc;
    //         newVpc.vpcId = vpc.id;
    //         const existingEnvironment = this.environmentMappingList.environmentList.find(env => env.companyEnvironmentId === envId);

    //         if (existingEnvironment) {
    //             newVpc.environmentName = existingEnvironment.shortName;
    //             existingEnvironment.selectedVpcList.push(newVpc);
    //         } else {
    //             this.addNewEnvironment(newVpc, envId);
    //         }
    //     } else {
    //         const envFromMappingList = this.environmentMappingList.environmentList.find(env => env.companyEnvironmentId === envId);

    //         const index = envFromMappingList.selectedVpcList.findIndex(mapping => mapping.vpcId === vpc.id);

    //         if (index > -1) {
    //             envFromMappingList.selectedVpcList.splice(index, 1);
    //         }

    //         if (envFromMappingList.selectedVpcList.length === 0) {
    //             const envIndex = this.environmentMappingList.environmentList.findIndex(env => env.companyEnvironmentId === envId);
    //             this.environmentMappingList.environmentList.splice(envIndex, 1);
    //         }
    //     }
    //     vpc.checked = !vpc.checked;

    // }

    // onRemoveConfirmation() {
    //     this.vpcRemoveWarn = true;
    //     this.addNewEnvironmentMapping();
    // }

    // addNewEnvironmentMapping() {
    //     this.onMap.emit(this.environmentMappingList);
    // }

    // onAutoScalingSave(scaling) {

    // }
}
