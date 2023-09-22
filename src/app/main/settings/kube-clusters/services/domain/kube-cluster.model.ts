export class KubeCluster {
    id: string;
    name: string;
    region: string;
    clusterType: string;
    defaultNamespace: string;
    dashboardUrl: string;
    enabled: boolean;
    totalCPU: number;
    totalMemory: number;
    totalStorage: number;
    availableCPU: number;
    availableMemory: number;
    availableStorage: number;

    constructor() {
        this.defaultNamespace = "default";
        this.enabled = true;
        this.totalCPU = 4.0;
        this.availableCPU = 4.0;
        this.totalMemory = 4096;
        this.availableMemory = 4096;
        this.totalStorage = 10240;
        this.availableStorage = 10240;
    }

}
