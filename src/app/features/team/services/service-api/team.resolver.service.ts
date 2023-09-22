import { Resolve, RouterStateSnapshot, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { TeamService } from './team.service';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '../../../user/services/service-api/user.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable()

export class TeamResolverService implements Resolve<any> {
    constructor(private teamService: TeamService, private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const teamId = route.paramMap.get('id');
        return this.teamService.getTeamDetail(teamId).pipe(
            switchMap(team => {
                const queryParams = { 'fetchMode': 'ALL', 'filterParams': `{"teamId":"${team.data.id}"}` };
                return this.userService.getUserListbyTeam(queryParams).pipe(
                    map(user => ({ team: team, users: user }))
                );
            })
        );

        // for only team
        // return this.teamService.getTeamDetail(teamId);

        // team and user in parallel
        // return forkJoin([this.teamService.getTeamDetail(teamId), this.userService.getUserListbyTeam(teamId)]).pipe(
        //     map(result => ({
        //         team: result[0],
        //         users: result[1]
        //     })
        //     ));
    }
}
