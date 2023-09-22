import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NotificationStoreService {
    newNotificationNumber: Subject<number> = new Subject<number>();
    newNotificationNumberSubject = this.newNotificationNumber.asObservable();

    setNewNotificationNumber(newValue: number = 0) {
        this.newNotificationNumber.next(newValue);
    }
}
