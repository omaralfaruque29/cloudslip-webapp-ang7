import { Injectable } from "@angular/core";
import * as endpoints from '../region.endpoints';
import { Observable } from 'rxjs';
import {FacadeDataService} from "../../../../../services/facade.data.service";


@Injectable()

export class RegionService {
    constructor ( private facadeDataService: FacadeDataService ) {
    }

    getRegionList (): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_REGION_LIST );
    }

    createRegion ( region ): Observable<any> {
        return this.facadeDataService.post( endpoints.CREATE_REGION, region );
    }

    updateRegion ( region ): Observable<any> {
        return this.facadeDataService.put( endpoints.UPDATE_REGION, region );
    }

    deletRegion( id: string ) {
        return this.facadeDataService.delete( endpoints.DELETE_REGION + id );
    }
}
