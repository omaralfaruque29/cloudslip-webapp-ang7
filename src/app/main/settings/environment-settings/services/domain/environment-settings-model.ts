export class EnvironmentSettings {
    id: string;
    name: string;
    shortName: string;
    description: string;
    orderNo: string;
}

export class ApplicationEnvironmentMapping {
    applicationId: string;
    forceRemove: boolean;
    useSameConfig: boolean;
    environmentList: ApplicationEnvironmentList[];
    constructor() {
        this.environmentList = [];
    }
}

export class ApplicationEnvironmentList {
    environmentId: string;
    shortName?: string;
    selectedVpcList: Vpc[];
}

export class Vpc {
    id: string;
    vpcId: string;
    autoScalingEnabled: boolean;
    desiredNumberOfInstance: number;
    minCpu: number;
    maxCpu: number;
    minMemory: number;
    maxMemory: number;
    maxNumOfInstance: number;
    minNumOfInstance: number;
    maxStorage: number;
    cpuThreshold: number;
    transactionPerSecondThreshold: number;
    name?: string;
    environmentName?: string;
    canaryDeployment: boolean;
    availableCPU: number;
    availableMemory: number;
    availableStorage: number;
    canaryDeploymentEnabled: boolean;
}

export interface ChangedResource {
    environmentId: string;
    vpcId: string;
    CPU: number;
    memory: number;
    storage: number;
}



// "applicationId" : "5d2c512a36b29653f09527d1",
// "useSameConfig" : false,
// "forceRemove" : false,
// "environmentList" : [
//     {
//         "companyEnvironmentId": "5cce945e9fe5d24b1c82f6a0",
//         "vpcList" : [
//             {
//                 "vpcId" : "5ccea2749fe5d226983e8943",
//                 "autoScalingEnabled" : true,
//                 "desiredNumberOfInstance" : 0,
//                 "minCpu" : 1.0,
//                 "maxMemory" : 10,
//                 "maxNumOfInstance" : 1,
//                 "minNumOfInstance" : 1,
//                 "cpuThreshold" : 2.33,
//                 "transactionPerSecondThreshold" : 2
//             }
//         ]
//     },