import { Injectable } from "@angular/core";
import * as endpoints from '../organization.endpoints';
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';

@Injectable()

export class OrganizationService {
    constructor ( private facadeDataService: FacadeDataService ) {
    }

    getOrganizationList (): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_ORGANIZATION_LIST );
    }

    getGitDirectoryList (): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_GIT_DIRECTORY_LIST );
    }
    getOrganizationDetail ( id ): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_ORGANIZATION_DETAIL + id );
    }


    createOrganization ( organization ): Observable<any> {
        return this.facadeDataService.post( endpoints.CREATE_ORGANIZATION, organization );
    }

    updateOrganization ( organization ): Observable<any> {
        return this.facadeDataService.put( endpoints.UPDATE_ORGANIZATION, organization );
    }

    deletOrganization( id: string ) {
        return this.facadeDataService.delete( endpoints.DELETE_ORGANIZATION + id );
    }
}
