import { Injectable } from "@angular/core";
import * as endpoints from '../message.endpoints';
import { Observable } from 'rxjs';
import { FacadeDataService } from '../../../../services/facade.data.service';

@Injectable()

export class MessageService {

    constructor ( private facadeDataService: FacadeDataService ) { }

    getMessageList (filterParams: string): Observable<any> {
        if (filterParams == null) {
            filterParams = "";
        }
        return this.facadeDataService.get( endpoints.FETCH_MESSAGE_LIST + filterParams );
    }

    getMessageThread ( id ): Observable<any> {
        return this.facadeDataService.get( endpoints.FETCH_MESSAGE_THREAD + id );
    }

    sendMessage ( message ): Observable<any> {
        return this.facadeDataService.post( endpoints.SEND_MESSAGE, message );
    }

    deleteMessage ( id: string ) {
        return this.facadeDataService.delete( endpoints.DELETE_MESSAGE + id );
    }
}