import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import {MessagesRoute} from "./messages.routes";
import {NgxEchartsModule} from "ngx-echarts";
import {RichTextEditorAllModule} from "@syncfusion/ej2-angular-richtexteditor";
import {InboxComponent} from "./inbox/inbox.component";
import {ComposeComponent} from "./compose/compose.component";
import { TagInputModule } from 'ngx-chips';
import {MessageService} from "./services/service-api/message.service";
import {SentComponent} from "./sent/sent.component";
import {MessageDetailsComponent} from "./details/message-details.component";


@NgModule( {
    imports: [
        TagInputModule,
        SloppyTigerSharedModule,
        RouterModule.forChild( MessagesRoute ),
        NgbModule,
        NgxEchartsModule,
        RichTextEditorAllModule,
    ],
    declarations: [
        ComposeComponent,
        InboxComponent,
        SentComponent,
        MessageDetailsComponent
    ],
    entryComponents: [ ],
    providers: [
        NgbActiveModal,
        MessageService,
    ]
} )

export class MessagesModule {}