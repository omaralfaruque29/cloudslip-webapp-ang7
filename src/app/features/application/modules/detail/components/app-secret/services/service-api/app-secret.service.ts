import { Injectable } from "@angular/core";
import * as endpoints from '../app-secret.endpoints';
import { Observable } from 'rxjs';
import {FacadeDataService} from "../../../../../../../../services/facade.data.service";

@Injectable()

export class AppSecretService {
    constructor ( private facadeDataService: FacadeDataService ) {
    }

    getAppSecretList ( id: string ): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_APP_SECRET_LIST + id );
    }

    getAppSecretEnvironmentList ( id: string ): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_APP_SECRET_ENVIRONMENT_LIST + id );
    }

    createAppSecret ( appSecret ): Observable<any> {
        return this.facadeDataService.post( endpoints.CREATE_APP_SECRET, appSecret );
    }

    updateAppSecret ( appSecret ): Observable<any> {
        return this.facadeDataService.put( endpoints.UPDATE_APP_SECRET, appSecret );
    }

    deleteAppSecret( id: string ) {
        return this.facadeDataService.delete( endpoints.DELETE_APP_SECRET + id );
    }
}
