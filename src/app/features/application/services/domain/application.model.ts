import { Team } from '../../../team/services/domain/team.model';

export class NewApplication {
    applicationId: string;
    id: string;
    name: string;
    packageName: string;
    teamId: string;
    appCreationType: string;
    applicationType: string;
    buildType: string;
    gitRepositoryName: number;
    gitBranchName: string;
    applicationBuildType: string;
    nameSpace: string;
    istioEnabled: boolean;
    istioIngressGatewayEnabled: boolean;
    applicationState: string;
    appCreateStatus: string;
    webSocketTopic: string;
    lastJenkinsBuildIdForAppCreation: string;
    lastJenkinsBuildStartTime: string;
    lastJenkinsBuildEstimatedTime: number;
    type: string;
    creationType: string;
    team: Team;
    constructor() {
        this.team = new Team();
    }
}

export class PipelineSuccesorStep {
    id: string;
    triggerMode: string;
}

export class PipelineSuccesorStepMapping {
    pipelineStepId: string;
    successors: PipelineSuccesorStep[];
}


export class ApplicationAdvancedConfig {
    applicationId: string;
    tlsSecretName: string;
    ingressEnabled: boolean;
    blueGreenDeploymentEnabled: boolean;
    istioEnabled: boolean;
    istioIngressGatewayEnabled: boolean;
    healthCheckUrl: string;
    customIngressConfigList: CustomIngressConfiguration[];
    appPort: number;
    appMetricsPort: number;
}




export class CustomIngressConfiguration {
    vpcId: string;
    environmentId: string;
    customIngress: string;
}

// export class NewApplicationFromRepo {
//     name: string;
//     packageName: string;
//     teamId: string;
//     appCreationType: string;
//     applicationType: string;
//     minCpu: number;
//     maxMemory: number;
//     gitAppId: number;
//     gitAppName: string;
//     branchName: string;
//     maxNumOfInstance: number;
//     minNumOfInstance: number;
//     cpuThreshold: number;
//     transactionPerSecondThreshold: number;
// }
