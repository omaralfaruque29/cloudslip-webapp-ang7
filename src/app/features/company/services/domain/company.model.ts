export class GitInfo {
    apiUrl: string;
    secretKey: string;
}

export class DockerHubInfo {
    dockerhubId: string;
    dockerhubPassword: string;
}

export class Company {
    id: string;
    name: string;
    businessEmail: string;
    website: string;
    address: string;
    phoneNo: string;
    baseDomain: string;
    enabled: boolean;
    gitInfo: GitInfo;
    dockerHubInfo: DockerHubInfo;
    adminEmail: string;
    password: string;
    
    constructor() {
        this.gitInfo = new GitInfo();
        this.dockerHubInfo = new DockerHubInfo();
    }
}

