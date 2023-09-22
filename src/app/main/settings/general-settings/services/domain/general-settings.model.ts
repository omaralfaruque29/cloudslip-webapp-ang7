export class GitSettings {
    id: string;
    gitProvider: string;
    username: string;
    apiUrl: string;
    secretKey: string;
}

export class DockerHubSettings {
    dockerRegistryType: string;
    dockerRegistryServer: string;
    dockerhubId: string;
    dockerhubEmail: string;
    dockerhubPassword: string;

    constructor() {}

    public setDefaultsForNew() {
        this.dockerRegistryType = "DOCKER_HUB";
        return this;
    }
}