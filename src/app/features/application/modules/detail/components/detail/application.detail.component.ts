import { Component, ChangeDetectorRef, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../../../services/sidebar.service';
import { BaseClass } from '../../../../../../shared/base.class';
import { NewApplication } from '../../../../services/domain/application.model';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { ApplicationPipelineSetupComponent } from '../pipeline-setup/pipeline.setup.component';
import { ApplicationCommitStateComponent } from '../commit-state/commit.state.component';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { CurrentUserService } from "../../../../../../services/current-user.service";
import { AlertService } from "../../../../../../shared/services/alert.service";
import { ApplicationResourceConfigurationComponent } from '../../../form/components/resource-configuration/resource.configuration.component';

@Component({
    selector: 'app-application-detail',
    templateUrl: './application.detail.component.html',
    styleUrls: ['./application.detail.component.scss']
})

export class ApplicationDetailComponent extends BaseClass implements OnInit, OnDestroy {

    application: NewApplication = new NewApplication();
    applicationId: string;
    panelOpenState = false;
    companyId: string;
    source = 'setting';
    dataLoading = true;
    stompClient;
    message: string;
    currentUser: any;
    subscription: any;
    connectedToWebSocket: boolean;
    webSocketConnectRetryTimeout: any;
    currentLog: string;
    appInitializationProgressValue: number;
    httpRequesting: boolean;
    wasAppInitializedOnPageOpen: boolean;
    isLogViewExpanded: boolean;
    estimatedTimeForAppInitialization: number;
    appInitializationStartTime: number;
    currentPipelineStepLog: string;
    spinnerValue = 0;
    currentPipelineStep: any;
    appInitializationProgressTimeout: any;
    consoleFullSize = false;

    @ViewChild('appInitLogContainer', { read: ElementRef }) private appInitLogContainer: ElementRef;
    @ViewChild('pipe') pipeLineSetupComponent: ApplicationPipelineSetupComponent;
    @ViewChild('commitState') commitStateComponent: ApplicationCommitStateComponent;
    @ViewChild('resourceConfigForm') resourceConfigFormComponent: ApplicationResourceConfigurationComponent;


    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private router: Router,
        private applicationService: ApplicationService,
        private route: ActivatedRoute,
        private currentUserService: CurrentUserService,
        private alertService: AlertService,
    ) {
        super(sidebarService, cdr);
        this.currentUser = currentUserService.get();
        this.connectedToWebSocket = false;
        this.currentLog = "";
        this.appInitializationProgressValue = 0;
        this.httpRequesting = false;
        this.wasAppInitializedOnPageOpen = false;
        this.isLogViewExpanded = false;
    }

    ngOnInit() {
        this.applicationId = this.route.snapshot.params.id;
        this.getApplicationDetail();
        this.connectToWebSocket(this);
        const time1 = (new Date()).getTime();
        this.changeToFullWidth();
        this.sidebarVisible = false;
    }

    ngOnDestroy() {
        this.unSubscribe();
        if (this.webSocketConnectRetryTimeout !== undefined) {
            clearTimeout(this.webSocketConnectRetryTimeout);
        }
        if (this.appInitializationProgressTimeout !== undefined) {
            clearTimeout(this.appInitializationProgressTimeout);
        }
        console.log("Web socket disconnected");
    }

    connectToWebSocket(thatArg) {
        const that = thatArg;
        const token = that.currentUser['token'];
        const currentUserId = that.currentUser['id'];
        const ws = new SockJS('http://localhost:8080/web-socket?authToken=' + token);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = null;
        this.stompClient.connect({ 'x-auth-token': token }, function () {
            console.log("Connected to websocket");
            that.connectedToWebSocket = true;
            that.subscribeToApplicationWebSocketTopic();
        }, function (error) {
            console.log(error);
            this.webSocketConnectRetryTimeout = setTimeout(function () {
                that.connect(that);
            }, 10000);
            console.log('STOMP: Reconnecting in 10 seconds');
        });
    }

    subscribeToApplicationWebSocketTopic() {
        const token = this.currentUser['token'];
        this.subscription = this.stompClient.subscribe("/topic/wst-app-" + this.applicationId, (message) => {
            this.processWebSocketMessage(message);
        }, { 'x-auth-token': token });
    }

    processWebSocketMessage(message) {
        const messagePayload = JSON.parse(message.body);
        if (messagePayload.type === 'APP_INITIALIZATION_LOG') {
            this.processAndAddToApplicationLog(messagePayload.data);
        } else if (messagePayload.type === 'PIPELINE_STEP_LOG') {
            this.processAndAddToApplicationLog(messagePayload.data.log);
        } else {
            console.log(messagePayload);
            if (messagePayload.type === 'APP_INITIALIZATION_RUNNING') {
                this.application.applicationState = 'INITIALIZATION_RUNNING';
                this.startProgressingAppInitialization(messagePayload.data.estimatedTime, (new Date()).getTime());
            } else if (messagePayload.type === 'APP_INITIALIZATION_FAILED') {
                this.application.applicationState = 'INITIALIZATION_FAILED';
            } else if (messagePayload.type === 'APP_INITIALIZATION_SUCCESS') {
                this.appInitializationProgressValue = 100;
                this.currentLog = '';
            } else if (messagePayload.type === 'STARTING_PIPELINE_FOR_GIT_COMMIT') {
                if (this.wasAppInitializedOnPageOpen === false) {
                    this.getApplicationDetail();
                }
                // else{
                this.currentPipelineStep = {
                    'gitCommitId': messagePayload.data.gitCommitId,
                    'appCommitPipelineStepId': messagePayload.data.appCommitPipelineStepId,
                    'estimatedTime': messagePayload.data.estimatedTime,
                    'type': 'STARTING_PIPELINE_FOR_GIT_COMMIT'
                };
                // }
            } else if (messagePayload.type === 'PIPELINE_STEP_RUNNING') {
                this.currentLog = '';
                this.currentPipelineStep = {
                    'gitCommitId': messagePayload.data.gitCommitId,
                    'appCommitPipelineStepId': messagePayload.data.appCommitPipelineStepId,
                    'estimatedTime': messagePayload.data.estimatedTime,
                    'type': 'PIPELINE_STEP_RUNNING'
                };

            } else if (messagePayload.type === 'PIPELINE_STEP_SUCCESS') {
                this.currentPipelineStep = {
                    'gitCommitId': messagePayload.data.gitCommitId,
                    'appCommitPipelineStepId': messagePayload.data.appCommitPipelineStepId,
                    'type': 'PIPELINE_STEP_SUCCESS'
                };
            } else if (messagePayload.type === 'PIPELINE_STEP_FAILED') {
                this.currentPipelineStep = {
                    'gitCommitId': messagePayload.data.gitCommitId,
                    'appCommitPipelineStepId': messagePayload.data.appCommitPipelineStepId,
                    'type': 'PIPELINE_STEP_FAILED'
                };
            }
        }
    }

    startProgressingAppInitialization(estimatedTime, startTime) {
        this.estimatedTimeForAppInitialization = estimatedTime;
        this.appInitializationStartTime = startTime;
        this.startAppInitializationProgressTimeout(0);
    }

    startAppInitializationProgressTimeout(progressPercentage) {
        this.appInitializationProgressTimeout = setTimeout(() => {
            if (this.appInitializationProgressValue < 100) {
                const now = (new Date()).getTime();
                if (now - this.appInitializationStartTime < this.estimatedTimeForAppInitialization) {
                    progressPercentage = Math.ceil(((now - this.appInitializationStartTime) * 100) /
                        this.estimatedTimeForAppInitialization);
                    if (progressPercentage > 96) {
                        progressPercentage = 96;
                    }
                } else {
                    progressPercentage = 96;
                }
                this.appInitializationProgressValue = progressPercentage;
                this.startAppInitializationProgressTimeout(progressPercentage);
            }
        }, 200);
        const l = 0;
    }

    processAndAddToApplicationLog(log) {
        const match = /\r|\n/.exec(log);
        if (match) {
            log = log.replace(/\n/g, "<br>");
            log = log.replace(/\r/g, "&emsp;");
        }
        this.currentLog += log;

        if (this.isLogViewExpanded) {
            setTimeout(() => {
                this.scrollLogContainerToBottom();
            }, 200);
        }
    }


    unSubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe(function (response) {
                console.log(response);
            });
        }
    }

    disconnect() {
        this.stompClient.disconnect(function (response) {
            console.log(response);
        });
    }

    getApplicationDetail() {
        this.applicationService.getApplicationDetail(this.applicationId).subscribe(
            application => {
                this.application = application.data;
                if (this.application.applicationState === 'PENDING_APP_DETAILS_ADDED' ||
                    this.application.applicationState === 'PENDING_APP_CLUSTER_AND_CONFIG_DETAILS_ADDED' ||
                    this.application.applicationState === 'PENDING_ADVANCE_CONFIGURATION_ADDED'
                ) {
                    this.router.navigate(['/main/application/create'], {
                        queryParams: {
                            applicationId: this.application.id, status: this.application.applicationState,
                            appCreationType: this.application.creationType, applicationType: this.application.type
                        },
                    });
                }
                else {
                    this.companyId = application.data.team.organization.company.id;
                    this.dataLoading = false;
                    if (this.application.appCreateStatus === 'SUCCESS' || this.application.appCreateStatus === 'COMPLETED') {
                        this.wasAppInitializedOnPageOpen = true;
                    }
                    setTimeout(() => {
                        if (this.application.applicationState === 'INITIALIZATION_SUCCESS') {
                            this.commitStateComponent.appName = this.application.name;
                            this.chageTab('commit', 'commit-tab');
                        } else if (this.application.applicationState === 'INITIALIZATION_RUNNING') {
                            const lastJenkinsBuildStartTimeAsTimestamp = (new Date(this.application.lastJenkinsBuildStartTime)).getTime();
                            this.startProgressingAppInitialization(this.application.lastJenkinsBuildEstimatedTime,
                                lastJenkinsBuildStartTimeAsTimestamp);
                        }
                    }, 500);
                }
            }
        );
    }

    createAppTemplate() {
        if (!this.httpRequesting && (this.application.appCreateStatus === 'PENDING' || this.application.appCreateStatus === 'FAILED')) {
            this.httpRequesting = true;
            this.applicationService.createTemplate({ "applicationId": this.applicationId }).subscribe(
                res => {
                    console.log(res);
                    this.httpRequesting = false;
                    if (res.status === 'success') {
                        this.application.appCreateStatus = 'IN_PROGRESS';
                        this.application.applicationState = 'STARTING_INITIALIZATION';
                    }
                }, error => {
                    this.httpRequesting = false;
                }
            );
        } else if (this.httpRequesting) {
            this.alertService.sendWarningAlert("A request is already in process");
        }
    }

    toggleLogViewExpansion() {
        this.consoleFullSize = false;
        this.isLogViewExpanded = !this.isLogViewExpanded;
        this.scrollLogContainerToBottom();
    }

    expandConsole() {
        this.consoleFullSize = !this.consoleFullSize;
    }


    scrollLogContainerToBottom(): void {
        try {
            this.appInitLogContainer.nativeElement.scrollTop = this.appInitLogContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    changeToPipelineSetup() {
        this.chageTab('pipeline-setup', 'pipeline-setup-tab');

        setTimeout(() => {
            this.pipeLineSetupComponent.mapSuccessors();
        }, 100);
    }


    toogleAccordion() {
        this.panelOpenState = !this.panelOpenState;
    }

    onResouceConfigsubmit() {
        this.resourceConfigFormComponent.submit();
    }

    onMap() {
        // this.pipeLineSetupComponent.onMapUpdate = true;
        this.commitStateComponent.getCommitStates();
        this.pipeLineSetupComponent.getApplicationEnvs();
    }

    syncCommits() {
        this.commitStateComponent.syncCommits();
    }

    mapAutoScaleData() {
        // this.resourceConfigFormComponent.getEnvironmentListForApplication();
    }


    back() {
        this.router.navigate(['/main/application']);
    }
}
