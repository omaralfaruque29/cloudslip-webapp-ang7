import {Component, ChangeDetectorRef, OnInit, OnDestroy} from "@angular/core";

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from '../../../services/sidebar.service';
import {FormBuilder} from "@angular/forms";
import {CurrentUserService} from "../../../services/current-user.service";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BaseClass } from '../../../shared/base.class';

@Component({
    selector: 'app-settings',
    templateUrl: './websocket-test.component.html'
})

export class WebsocketTestComponent extends BaseClass implements OnInit, OnDestroy {
    modalHeader: string;
    sidebarVisible: boolean;
    stompClient;
    message: string;
    currentUser: any;
    targetUser: string;
    subscription: any;

    constructor(
        private fb: FormBuilder,
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private toast: ToastrService,
        public activeModal: NgbActiveModal,
        private currentUserService: CurrentUserService
    ) {
        super(sidebarService, cdr);
        this.currentUser = currentUserService.get();
    }

    ngOnInit() {
        this.connect(this);
    }

    ngOnDestroy() {
        this.unSubscribe();
    }

    connect(thatArg) {
        const that = thatArg;
        const token = that.currentUser['token'];
        const currentUserId = that.currentUser['id'];
        const ws = new SockJS('http://localhost:8080/web-socket?authToken=' + token);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = null;
        this.stompClient.connect({'x-auth-token': token}, function () {
            that.subscription = that.stompClient.subscribe("/topic/wst-app-5d19beeb3bc5e53344152b05", (message) => {
                const messagePayload = JSON.parse(message.body);
                if (messagePayload.type === 'PIPELINE_STEP_LOG') {
                    console.log(messagePayload.data.log);
                } else if (messagePayload.type === 'APP_INITIALIZATION_LOG') {
                    console.log(messagePayload.data);
                } else {
                    console.log(messagePayload);
                }
            }, {'x-auth-token': token});
        }, function (error) {
            console.log(error);
            setTimeout(function() {
                that.connect(that);
            }, 60000);
            console.log('STOMP: Reconnecting in 60 seconds');
        });
    }

    sendMessage() {
        const token = this.currentUser['token'];
        const currentUserId = this.currentUser['id'];
        if (this.message && this.targetUser) {
            this.stompClient.send("/app/send/message", {'x-auth-token': token, 'target-user': this.targetUser}, this.message);
            this.message = "";
        } else {
            alert("Fill the fields");
        }
    }


    subscribe() {
        const token = this.currentUser['token'];
        this.subscription = this.stompClient.subscribe("/topic/wst-app-5d11b8ce0f89f6d28ab77fd4", (message) => {
            console.log(message);
        }, {'x-auth-token': token});
    }


    unSubscribe() {
        this.subscription.unsubscribe(function (response) {
            console.log(response);
        });
    }

    disconnect() {
        this.stompClient.disconnect(function(response) {
            console.log(response);
        });
    }
}
