import { Injectable } from "@angular/core";
import * as endpoints from '../general-settings.endpoints';
import { FacadeDataService } from '../../../../../services/facade.data.service';
import {Observable} from "rxjs";

@Injectable()

export class GeneralSettingsService {
    constructor ( private facadeDataService: FacadeDataService ) {
    }
    saveGitInfoSettings ( settings ): Observable<any> {
        return this.facadeDataService.post( endpoints.SAVE_GIT_INFO_SETTINGS, settings );
    }
    saveDockerHubInfoSettings ( settings ): Observable<any> {
        return this.facadeDataService.post( endpoints.SAVE_DOCKER_HUB_INFO_SETTINGS, settings );
    }
    getCompanyDetail ( id: string  ): Observable<any> {
        return this.facadeDataService.get( endpoints.GET_COMPANY_DETAIL + id );
    }
}
