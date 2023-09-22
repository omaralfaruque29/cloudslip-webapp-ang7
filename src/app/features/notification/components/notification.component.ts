import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from '../services/notification.service';
import { NotificationStoreService } from '../services/notification.store.service';
import { interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';


@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class NotificationComponent implements OnInit {

    tableValue = [];
    numberOfUncheckedNotifications: number;
    intervalForPulling = 5 * 60 * 1000;
    statusClassChecked = 'checked';
    statusClassNotChecked = 'not-checked';
    private page: string = '0';
    private size: string = '10';
    private notifications: Array<any>;

    constructor(
        private notificationService: NotificationService,
        private router: Router,
        private notificationStoreService: NotificationStoreService
    ) { }

    ngOnInit() {
        this.countUncheckedNotifications();
        this.getNotifications();
    }

    // this is the first notifications fetch call
    getNotifications() {
        this.notificationService.getNotifications(this.page, this.size).subscribe(
            JSONobj => {
                if (JSONobj.data) {
                    this.tableValue = JSONobj.data['content'];
                    this.pullNotifications();
                }
            }
        );
    }

    // after fetching notification for the first time
    // this will pull notifications after every 20 seconds

    pullNotifications() {
        interval(this.intervalForPulling).pipe(
            flatMap(() => this.notificationService.getNotifications(this.page, this.size))
        ).subscribe(
            JSONobj => {
                if (JSONobj.data) {
                    this.tableValue = JSONobj.data['content'];
                }
            }
        );
    }

    // this is the first fetch call for UncheckedNotifications
    countUncheckedNotifications() {
        this.notificationService.countUncheckedNotifications().subscribe(
            obj => {
                if (obj['data']) {
                    this.numberOfUncheckedNotifications = obj['data'];
                    if (this.numberOfUncheckedNotifications > 0) {
                        this.notificationStoreService.setNewNotificationNumber(this.numberOfUncheckedNotifications);
                        this.pullUncheckedNotifications();
                    }
                }
            }
        );
    }

    // after fetching unchecked notifications for the first time
    // this will pull number of unchecked notifications after every 20 seconds
    pullUncheckedNotifications() {
        interval(this.intervalForPulling).pipe(
            flatMap(() => this.notificationService.countUncheckedNotifications())
        ).subscribe(
            obj => {
                if (obj['data']) {
                    this.numberOfUncheckedNotifications = obj['data'];
                    if (this.numberOfUncheckedNotifications > 0) {
                        this.notificationStoreService.setNewNotificationNumber(this.numberOfUncheckedNotifications);
                    }
                }
            }
        );
    }


    changeNotificationStatus(id: string) {
        this.notificationService.changeNotificationStatus(id).subscribe(
            obj => {
                if (obj['status'] = 'success') {
                    this.countUncheckedNotifications();
                    this.getNotifications();
                }
            }
        )
    }

    seeAll() {
        this.router.navigate(['/main', 'notification']);
    }
}
