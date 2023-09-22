import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../services/facade.data.service';

@Injectable()
export class NotificationService {

    constructor ( private facadeDataService: FacadeDataService ) { }

    getNotifications (page:string, size:string): Observable<any> {
        const url = encodeURI('api/notification/get-list?filterParams={"page":"' + page + '","size":"' + size + '"}');
        return this.facadeDataService.get(url);
    }

    getAllNotifications (): Observable<any> {
        const url = encodeURI('api/notification/get-list?fetchMode=ALL');
        return this.facadeDataService.get(url);
    }

    deleteNotification( id: string ) {
        return this.facadeDataService.delete('api/notification/' + id );
    }

    countUncheckedNotifications(){
        const url = encodeURI('api/notification/count');
        return this.facadeDataService.get(url);
    }

    changeNotificationStatus(id: string){
        return this.facadeDataService.put('api/notification/' + id, id);
    }

}