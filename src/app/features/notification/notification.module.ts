import { RouterModule } from "@angular/router";
import { notificationRoutes } from "./notification.routes";
import { NgModule } from "@angular/core";
import { SloppyTigerSharedModule } from "../../shared/sloppy-tiger.shared.module";
import { NotificationDetailComponent } from "./components/detail/notification.detail.component";
import { NotificationService } from './services/notification.service';

@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(notificationRoutes)
    ],
    declarations: [
        NotificationDetailComponent
    ],
    entryComponents: [NotificationDetailComponent],
    providers: [
        NotificationService
    ]
})

export class NotificationModule { }