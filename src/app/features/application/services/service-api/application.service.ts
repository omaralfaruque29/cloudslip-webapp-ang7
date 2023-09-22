import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';
import * as endpoints from '../create.app.endpoints';
import { ApplicationAdvancedConfig } from '../domain/application.model';

@Injectable({
    'providedIn': 'root'
})
export class ApplicationService {

    constructor(
        private facadeDataService: FacadeDataService,
    ) { }

    private applicationEnvironments = new BehaviorSubject<any>(null);

    appEnvironments$ = this.applicationEnvironments.asObservable();

    private commitList = new BehaviorSubject<any>(null);

    commitList$ = this.commitList.asObservable();

    createNewApplication(App): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_APP, App);
    }

    updateApplication(App): Observable<any> {
        return this.facadeDataService.post(endpoints.UPDATE_APP, App);
    }

    getApplicationList(): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_APPLICATION_LIST);

    }

    getApplicationDetail(id): Observable<any> {
        return this.facadeDataService.get(endpoints.GET_APP_DETAIL + id);
    }

    getCommitStates(id) {
        return this.facadeDataService.get(endpoints.GET_COMMIT_STATE_LIST + id);
    }

    getSyncCommits(id) {
        return this.facadeDataService.get(endpoints.GET_SYNCED_COMMITS + id);
    }

    setApplicationEnvironments(newValue) {
        this.applicationEnvironments.next(newValue);
    }

    setCommitList(newValue) {
        this.commitList.next(newValue);
    }

    updatePipelineStepSuccessor(body): Observable<any> {
        return this.facadeDataService.post(endpoints.UPDATE_PIPELINE_STEP_SUCCESSOR, body);
    }

    createTemplate(body): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_TEMPLATE, body);
    }

    createCustomPipelineStep(body): Observable<any> {
        return this.facadeDataService.post(endpoints.CREATE_CUSTOM_PIPELINE_STEP, body);
    }

    getLogs(queryParams) {
        return this.facadeDataService.get(endpoints.FETCH_LOGS, queryParams);
    }

    deleteApplication(appId, queryParams) {
        return this.facadeDataService.delete(endpoints.DELETE_APPLICATION + appId, queryParams);
    }

    triggerStep(step) {
        return this.facadeDataService.post(endpoints.TRIGGER_STEP, step);
    }

    addAdvancedConfigforApplication(body: ApplicationAdvancedConfig) {
        return this.facadeDataService.post(endpoints.ADD_ADVANCED_CONFIG, body);
    }

    getCompanyRepositories() {
        return this.facadeDataService.get(endpoints.FETCH_GIT_REPOSITORIES);
    }

    getBranches(reponame){
        return this.facadeDataService.get(endpoints.FETCH_GIT_BRANCHES + reponame);
    }

    getAppEnvironmentChecklist(queryParams) {
        return this.facadeDataService.get(endpoints.FETCH_APP_ENVIRONMENT_CHECKLIST, queryParams);
    }

    addAppEnvironmentChecklistItem(body): Observable<any> {
        return this.facadeDataService.post(endpoints.ADD_APP_ENVIRONMENT_CHECKLIST_ITEM, body);
    }

    updateAppEnvironmentChecklistItem(body): Observable<any> {
        return this.facadeDataService.post(endpoints.UPDATE_APP_ENVIRONMENT_CHECKLIST_ITEM, body);
    }

    deleteAppEnvironmentChecklistItem(body): Observable<any> {
        return this.facadeDataService.post(endpoints.DELETE_APP_ENVIRONMENT_CHECKLIST_ITEM, body);
    }


}
