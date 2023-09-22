import { Injectable } from "@angular/core";
import * as endpoints from '../company.endpoints';
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';

@Injectable({
    'providedIn': 'root'
})

export class CompanyService {
    constructor(private facadeDataService: FacadeDataService) { }

    getCompanyList(): Observable<any> {
        return this.facadeDataService.get(endpoints.FETCH_COMPANY_LIST);
    }

    getCompanyDetail(id): Observable<any> {
        return this.facadeDataService.get(endpoints.FETCH_COMPANY_DETAIL + id);
    }

    getOrganizationList(id): Observable<any> {
        return this.facadeDataService.get(endpoints.FETCH_ORGANIZATION_LIST);
    }

    createCompany(company): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_COMPANY, company);
    }

    updateCompany(company): Observable<any> {
        return this.facadeDataService.put(endpoints.UPDATE_COMPANY, company);
    }

    registerCompany(company): Observable<any> {
        return this.facadeDataService.post(endpoints.REGISTER_COMPANY, company);
    }

    deletCompany(id: string) {
        return this.facadeDataService.delete(endpoints.DELETE_COMPANY + id);
    }
}
