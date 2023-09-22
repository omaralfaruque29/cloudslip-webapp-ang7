import { Injectable } from "@angular/core";
import * as endpoints from '../environment-option.endpoints';
import { FacadeDataService } from '../../../../../services/facade.data.service';
import { Observable } from "rxjs";

@Injectable({
    'providedIn': 'root'
})

export class EnvironmentOptionService {
    constructor(private facadeDataService: FacadeDataService) {
    }
    createEnvironmentOption(environmentOption): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_ENVIRONMENT_OPTION, environmentOption);
    }
    getEnvironmentOptionsList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_ENVIRONMENT_OPTIONS_LIST);
    }

    getRegionList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_REGION_LIST);
    }
    deleteEnvironmentOpton(environmentOptionId: string): Observable<any> {
        return this.facadeDataService.delete(endpoints.DELETE_ENVIRONMENT_OPTION + environmentOptionId);
    }
    updateEnvironmentOption(environmentOption): Observable<any> {
        return this.facadeDataService.put(endpoints.UPDATE_ENVIRONMENT_OPTION, environmentOption);
    }

}
