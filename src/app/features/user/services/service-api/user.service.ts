import { Injectable } from "@angular/core";
import * as endpoints from '../user.endpoints';
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';
import { User } from '../domain/user.model';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private facadeDataService: FacadeDataService) { }

    getUserList(filterParams: string): Observable<any> {
        if (filterParams == null) {
            filterParams = "";
        }
        return this.facadeDataService.get(endpoints.FETCH_USER_LIST + filterParams);
    }

    getUserListbyTeam(queryParmas): Observable<any> {
        return this.facadeDataService.get(endpoints.FETCH_USER_LIST, queryParmas);
    }

    getUserListByCompany(companyId: string): Observable<any> {
        return this.facadeDataService.get(endpoints.FETCH_USER_LIST + `?companyId=${companyId}`);
    }

    getUserDetail(id): Observable<any> {
        return this.facadeDataService.get(endpoints.FETCH_USER_DETAIL + id);
    }

    createUser(User): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_USER, User);
    }

    updateUser(User): Observable<any> {
        return this.facadeDataService.put(endpoints.UPDATE_USER, User);
    }

    deleteUser(id: string) {
        return this.facadeDataService.delete(endpoints.DELETE_USER + id);
    }

    deleteUserFromTeam(users) {
        return this.facadeDataService.post(endpoints.DELETE_USERS_FROM_TEAM, users);
    }

    addUsersToTeam(TeamandUsers): Observable<any> {
        return this.facadeDataService.post(endpoints.ADD_USER_TO_TEAM, TeamandUsers);
    }
}