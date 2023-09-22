import { Injectable } from "@angular/core";
import * as endpoints from '../environment-settings.endpoints';
import { FacadeDataService } from '../../../../../services/facade.data.service';
import { Observable } from "rxjs";
import { DELETE_CLUSTER } from "../environment-settings.endpoints";

@Injectable({
    'providedIn': 'root'
})

export class EnvironmentSettingsService {
    constructor(private facadeDataService: FacadeDataService) {
    }
    createEnvironmentSettings(settings): Observable<any> {
        return this.facadeDataService.post(endpoints.SET_ENVIRONMENT_OPTIONS_FOR_COMPANY, settings);
    }
    getEnvironmentOptionsList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_ENVIRONMENT_OPTIONS_LIST);
    }

    getEnvironmentOptionsForCompany(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_ENVIRONMENT_OPTIONS_FOR_COMPANY);
    }
    deletEnvironmentClusterSettings(id: string, clusterId: string) {
        return this.facadeDataService.delete(endpoints.DELETE_ENVIRONMENT_CLUSTER_FOR_COMPANY + id + DELETE_CLUSTER + clusterId);
    }
    createEnvironmentClusterSettings(clusters): Observable<any> {
        return this.facadeDataService.post(endpoints.SET_ENVIRONMENT_CLUSTER_OPTIONS_FOR_COMPANY, clusters);
    }
    addEnvironmentToApplication(environmentList): Observable<any> {
        return this.facadeDataService.post(endpoints.ADD_ENVIRONMENT_TO_APPLICATION, environmentList);
    }
    getEnvironmentClusterOptionsList(environmentOptionId: string): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_SELECTED_CLUSTER_OPTION_LIST + environmentOptionId);
    }

    getEnvironmentClusterOptionsForCompany(environmentOptionId: string): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_ENVIRONMENT_CLUSTER_OPTIONS_FOR_COMPANY + environmentOptionId);
    }

    getApplicationEnvironments(queryParams): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_APPLICATION_ENVIRONMENTS, queryParams);
    }

    getAppVpcList(queryParams): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_APP_VPC_LIST, queryParams);
    }
}
