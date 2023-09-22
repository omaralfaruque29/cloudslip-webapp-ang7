import { Injectable } from "@angular/core";
import * as endpoints from '../team.endpoints';
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';

@Injectable()

export class TeamService
{
    constructor ( private facadeDataService: FacadeDataService ) { }

    getTeamList (): Observable<any>
    {
        return this.facadeDataService.get( endpoints.FETCH_TEAM_LIST );
    }

    getTeamDetail ( id ): Observable<any>
    {
        return this.facadeDataService.get( endpoints.FETCH_TEAM_DETAIL + id );
    }

    createTeam ( Team ): Observable<any>
    {
        return this.facadeDataService.post( endpoints.CREATE_TEAM, Team );
    }

    updateTeam ( Team ): Observable<any>
    {
        return this.facadeDataService.put( endpoints.UPDATE_TEAM, Team );
    }

    deletTeam ( id: string )
    {
        return this.facadeDataService.delete( endpoints.DELETE_TEAM + id );
    }

    getOrganizationList (): Observable<any>
    {
        return this.facadeDataService.get( endpoints.FETCH_ORG_LIST );
    }


}