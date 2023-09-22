import { Injectable } from '@angular/core';
import * as endpoints from '../onboarding.endpoints'
import { FacadeDataService } from '../../../../services/facade.data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OnboardingService {
    constructor(
        private facadeDataService: FacadeDataService
    ) { }

    skipInitialSetting(): Observable<any> {
        return this.facadeDataService.post(endpoints.SKIP_INITIAL_SETTING, {});
    }

    completeInitialSetting(): Observable<any> {
        return this.facadeDataService.post(endpoints.COMPLETE_INITIAL_SETTING, {});
    }
}
