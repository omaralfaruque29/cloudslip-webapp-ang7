export class EnvironmentOption {
    id: string;
    name: string;
    shortName: string;
    description: string;
    orderNo: string;
}

export class Vpc {
    id: string;
    name: string;
    vpcStatus: string;
    dashboardUrl: string;
    region: any;
    enabled: boolean;
    totalCPU: number;
    totalMemory: number;
    bandwidth: string;
    totalStorage: number;
    availableCPU: number;
    availableMemory: number;
    availableStorage: number;
    autoScalingEnabled: boolean;

    constructor() {}

    public setDefaultsForNew() {
        this.id = null;
        this.totalCPU = 2.0;
        this.totalMemory = 4;
        this.totalStorage = 60;
        this.bandwidth = 'Medium';
        return this;
    }
}
