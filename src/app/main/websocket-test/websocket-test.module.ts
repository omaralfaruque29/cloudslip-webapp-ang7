import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SloppyTigerSharedModule } from '../../shared/sloppy-tiger.shared.module';
import {websocketTestRoutes} from "./websocket-test.routes";
import {WebsocketTestComponent} from "./components/websocket-test.component";


@NgModule({
    imports: [
        SloppyTigerSharedModule,
        RouterModule.forChild(websocketTestRoutes),
        NgbAccordionModule,
        NgbModule
    ],
    declarations: [
        WebsocketTestComponent
    ],
    entryComponents: [ WebsocketTestComponent ],
    providers: [
        NgbActiveModal
    ]
})

export class WebsocketTestModule {}
