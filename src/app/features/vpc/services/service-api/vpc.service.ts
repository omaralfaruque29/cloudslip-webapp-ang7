import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';
import * as endpoints from '../vpc.api.endpoints';

@Injectable({
    'providedIn': 'root'
})
export class VpcService {

    constructor(private facadeDataService: FacadeDataService) {
    }

    getVpcList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_VPC_LIST);
    }

    getVpc(id: string): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_VPC_DETAILS + id);
    }

    createVpc(vpc): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_VPC, vpc);
    }

    updateVpc(vpc): Observable<any> {
        return this.facadeDataService.put(endpoints.UPDATE_VPC, vpc);
    }

    deleteVpc(id: string) {
        return this.facadeDataService.delete(endpoints.DELETE_VPC + id);
    }

    getEnvironmentOptionsList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_ENVIRONMENT_OPTIONS_LIST);
    }

    getCompanyEnvironmentList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_COMPANY_ENVIRONMENT_LIST);
    }
    getRegionList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_REGION_LIST);
    }
}
