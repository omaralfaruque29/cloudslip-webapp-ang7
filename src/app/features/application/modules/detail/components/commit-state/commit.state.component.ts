import { Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../../../shared/services/alert.service';
import {isLineBreak} from "codelyzer/angular/sourceMappingVisitor";
import {SidebarService} from "../../../../../../services/sidebar.service";
import {EnvironmentSettingsService} from "../../../../../../main/settings/environment-settings/services/service-api/environment-settings.service";


@Component({
    selector: 'app-commit-state',
    templateUrl: './commit.state.component.html',
    styleUrls: ['../detail/application.detail.component.scss', './commit.state.component.scss']
})

export class ApplicationCommitStateComponent implements OnInit, OnChanges {
    commitList = [];
    // currentEnvironments = [];
    appId: string;
    currentAppEnvironments = [];
    currentMappingEnvironment: any;
    logOnModal = '';
    // currentCommit: any;
    appName = '';
    logFullScreen = false;
    currentCommitIndex = 0;
    runningSteps = [];
    deploymentConfirmationMessage: string;
    deploymentConfirmationModal: any;
    newRunPipelineStepParams: any;
    pipelineStepRunning: boolean;
    runningPipelineStepRunType: string;
    sidebarVisible: boolean;
    showPipelineStepDescription: boolean;
    currentShowingPipelineStep: any;
    appVpcList: any;


    @Input('applicationId') set applicationId(value) {
        this.appId = value;
        this.getCommitStates();
    }
    @Input('currentPipelineStep') currentPipelineStep: any;

    @ViewChild('logModal') logModal: any;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
    @ViewChild('logModal') logModalContent;

    constructor(
        private environmentSettingsService: EnvironmentSettingsService,
        private sidebarService: SidebarService,
        private applicationService: ApplicationService,
        private modal: NgbModal,
        private alertService: AlertService
    ) {
        this.deploymentConfirmationMessage = "";
        this.pipelineStepRunning = false;
        this.runningPipelineStepRunType = null;
        this.showPipelineStepDescription = false;
        this.appVpcList = [];
    }

    ngOnInit() {
        this.sidebarVisible = this.sidebarService.getStatus();
        this.sidebarService.sidebarVisibleObs.subscribe((value: boolean) => {
            this.sidebarVisible = value;
        });

        this.getEnvironmentListForApplication();
        // this.getCommitStates();
    }

    getEnvironmentListForApplication() {
        // TODO: Add store here
        const queryParams = { 'fetchMode': 'ALL', 'filterParams': `{"appId": "${this.appId}"}` };
        this.environmentSettingsService.getAppVpcList(queryParams).subscribe(
            res => {
                if (res.status === 'success' && res.data != null) {
                    this.appVpcList = res.data;
                }
            }
        );
    }


    ngOnChanges(changes: SimpleChanges) {

        if (changes.currentPipelineStep && changes.currentPipelineStep.currentValue &&
            changes.currentPipelineStep.currentValue.type === 'STARTING_PIPELINE_FOR_GIT_COMMIT') {
            this.applicationService.getCommitStates(this.appId).subscribe(
                (res: any) => {
                    this.commitList = res != null ? res.data : this.commitList;
                    this.applicationService.setCommitList(this.commitList);
                    if (res.data.length > 0) {
                        this.commitList[0].active = true;
                        setTimeout(() => { this.mapSuccessors(this.commitList[0].environmentStateList); }, 100);

                        let stepIndex = 0;

                        const commitIndex = this.commitList.findIndex(commit => commit.appCommit.gitCommitId ===
                            changes.currentPipelineStep.currentValue.gitCommitId);

                        this.commitList[commitIndex].running = true;

                        for (let i = 0; i < this.commitList[commitIndex].environmentStateList.length; i++) {
                            const index = this.commitList[commitIndex].environmentStateList[i].steps.findIndex(step =>
                                step.id === changes.currentPipelineStep.currentValue.appCommitPipelineStepId);
                            if (index >= 0) {
                                stepIndex = index;
                                // const step = this.commitList[commitIndex].environmentStateList[i].steps[stepIndex];

                                // step.status = 'pending';
                                // step.progressValue = 0;
                                console.log('TYPE' + this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].type);
                                this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].progressValue = 0;
                                this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].starting = true;
                                break;
                            }
                        }
                    }
                });
        }



        if (changes.currentPipelineStep && changes.currentPipelineStep.currentValue &&
            changes.currentPipelineStep.currentValue.type === 'PIPELINE_STEP_RUNNING') {

            this.applicationService.commitList$.subscribe(
                (resList: any) => {
                    this.commitList = resList != null ? resList : this.commitList;

                    const commitIndex = this.commitList.findIndex(commit => commit.appCommit.gitCommitId ===
                        changes.currentPipelineStep.currentValue.gitCommitId);

                    if (commitIndex >= 0) {
                        this.updateState(commitIndex, changes);
                    }
                    else {
                        this.applicationService.getCommitStates(this.appId).subscribe(
                            (res: any) => {
                                this.commitList = res.data;
                                if (res.data.length >= 0) {
                                    const commitIndex = this.commitList.findIndex(commit => commit.appCommit.gitCommitId ===
                                        changes.currentPipelineStep.currentValue.gitCommitId);
                                    if (commitIndex > 0) {
                                        this.updateState(commitIndex, changes);
                                    }
                                }
                            }
                        );
                    }
                }
            );
        } else if (changes.currentPipelineStep && changes.currentPipelineStep.currentValue &&
            changes.currentPipelineStep.currentValue.type === 'PIPELINE_STEP_SUCCESS') {
            this.applicationService.commitList$.subscribe(
                (resList: any) => {
                    this.commitList = resList != null ? resList : this.commitList;
                    if (this.commitList) {
                        const commitIndex = this.commitList.findIndex(commit => commit.appCommit.gitCommitId ===
                            changes.currentPipelineStep.currentValue.gitCommitId);

                        if (commitIndex >= 0) {
                            this.finishState(commitIndex, changes);
                        }
                        else {
                            this.applicationService.getCommitStates(this.appId).subscribe(
                                (res: any) => {
                                    this.commitList = res.data;
                                    if (res.data.length >= 0) {
                                        const commitIndex = this.commitList.findIndex(commit => commit.appCommit.gitCommitId ===
                                            changes.currentPipelineStep.currentValue.gitCommitId);
                                        if (commitIndex > 0) {
                                            this.finishState(commitIndex, changes);
                                        }
                                    }
                                }
                            );
                        }
                    }
                }
            );
        } else if (changes.currentPipelineStep && changes.currentPipelineStep.currentValue &&
            changes.currentPipelineStep.currentValue.type === 'PIPELINE_STEP_FAILED') {
            this.pipelineStepRunning = false;
            const runningSuccessStep = this.runningSteps.filter(step => step.gitCommitId ===
                changes.currentPipelineStep.currentValue.gitCommitId)[0];

            window.clearInterval(this.commitList[runningSuccessStep.commitIndex].environmentStateList[runningSuccessStep.envIndex]
                .steps[runningSuccessStep.stepIndex].timer)
            this.commitList[runningSuccessStep.commitIndex].environmentStateList[runningSuccessStep.envIndex]
                .steps[runningSuccessStep.stepIndex].progressValue = -100;
            this.commitList[runningSuccessStep.commitIndex].running = false;
            this.commitList[runningSuccessStep.commitIndex].failed = true;
        }

    }


    finishState(commitIndex, changes) {
        let stepIndex = 0;

        console.log(changes);

        for (let i = 0; i < this.commitList[commitIndex].environmentStateList.length; i++) {
            const index = this.commitList[commitIndex].environmentStateList[i].steps.findIndex(step =>
                step.id === changes.currentPipelineStep.currentValue.appCommitPipelineStepId);
            if (index >= 0) {
                stepIndex = index;

                window.clearInterval(this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].timer);
                this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].progressValue = 100;
                this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].starting = false;

                if (this.runningPipelineStepRunType != null) {
                    if (this.runningPipelineStepRunType === 'CANARY') {
                        this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].runningAsCanary = true;
                    } else {
                        this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].runningAsCanary = false;
                    }
                    if (changes.currentPipelineStep.currentValue.type === 'PIPELINE_STEP_SUCCESS') {
                        this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].type = "SUCCESS";
                    }
                } else {
                    if (changes.currentPipelineStep.currentValue.type === 'PIPELINE_STEP_SUCCESS') {
                        this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].type = "PIPELINE_SUCCESS";
                    } else {
                        this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].type = changes.currentPipelineStep.currentValue.type;
                    }
                }

                this.commitList[commitIndex].running = false;
                break;
            }
        }
        this.pipelineStepRunning = false;
    }

    updateState(commitIndex, changes) {

        setTimeout(() => { this.mapSuccessors(this.commitList[0].environmentStateList); }, 100);
        this.commitList[0].active = true;

        let stepIndex = 0;

        this.commitList[commitIndex].running = true;

        for (let i = 0; i < this.commitList[commitIndex].environmentStateList.length; i++) {
            const index = this.commitList[commitIndex].environmentStateList[i].steps.findIndex(step =>
                step.id === changes.currentPipelineStep.currentValue.appCommitPipelineStepId);
            if (index >= 0) {
                stepIndex = index;
                const step = this.commitList[commitIndex].environmentStateList[i].steps[stepIndex];
                // step.status = 'pending';
                step.progressValue = 0;
                const remainingTime = changes.currentPipelineStep.currentValue.estimatedTime;

                this.runningSteps.push({
                    gitCommitId: this.commitList[commitIndex].appCommit.gitCommitId,
                    commitIndex: commitIndex,
                    envIndex: i,
                    stepIndex: stepIndex,
                    startTime: step.pipelineStartTime,
                    step: step,
                    estimatedTime: remainingTime
                });

                let value = 0;
                // console.log(this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].status);
                this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].starting = false;
                // console.log(this.commitList[commitIndex].environmentStateList[i].steps[stepIndex].type);
                // increasing value from 0-99 in estimeeted seconds.
                // Increases 99/5 progress in every seconds
                this.setTimer(commitIndex, step, i, stepIndex, remainingTime);
                break;
            }
        }
    }

    setTimer(commitIndex, step, envIndex, stepIndex, remainingTime) {
        const timer = window.setInterval(() => {
            // console.log(this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex]);
            // console.log(this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].progressValue);
            step.progressValue =
                +step.progressValue + (95 /
                    +(remainingTime / 1000));
            //console.log(step.progressValue);
            if (step.progressValue > 95) { window.clearInterval(timer); }
            if (step.progressValue <= 95) {
                this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].progressValue = step.progressValue;
            }
        }, 1000);
        this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].timer = timer;
        // stop incresing after estimeeted seconds
        setTimeout(() => { window.clearInterval(timer); }, remainingTime);
    }

    getCommitStates() {
        this.applicationService.getCommitStates(this.appId).subscribe(
            (res: any) => {
                this.commitList = res.data;
                if (res.data.length > 0) {
                    // this.currentEnvironments = res.data[0].environmentStateList;
                    this.commitList[0].active = true;
                    // this.currentCommit = this.commitList[0];
                    this.currentCommitIndex = 0;
                    setTimeout(() => { this.mapSuccessors(this.commitList[0].environmentStateList); }, 500);
                    let envIndex = 0;
                    let stepIndex = 0;
                    this.commitList[0].environmentStateList.map(
                        env => {
                            env.steps.map(
                                step => {
                                    const subStr = ['SUCCESS', 'NONE', 'FAILED', 'PENDING']
                                    const runningChecker = subStr.some((element) => step.type.includes(element));

                                    if (!runningChecker && step.estimatedTime && step.pipelineStartTime) {

                                        console.log('estimeted', step.estimatedTime);
                                        console.log('now', (new Date()).getTime() / 1000);
                                        console.log('startTime', new Date(step.pipelineStartTime).getTime() / 1000);
                                        console.log('difference', ((new Date()).getTime() - new Date(step.pipelineStartTime).getTime()) / 1000);
                                        console.log('remaining', step.estimatedTime - ((new Date()).getTime() - new Date(step.pipelineStartTime).getTime()) / 1000);

                                        const remainingTime = step.estimatedTime -
                                            ((new Date()).getTime() - new Date(step.pipelineStartTime).getTime()) / 1000;
                                        step.progressValue = (((new Date()).getTime() - new Date(step.pipelineStartTime).getTime()) / 1000) *
                                            (95 / +(step.estimatedTime / 1000));
                                        this.setTimer(0, step, envIndex, stepIndex, remainingTime);
                                    }
                                    stepIndex++;
                                }
                            );
                            envIndex++;
                        }
                    );
                }
            }
        );
    }

    syncCommits() {
        this.applicationService.getSyncCommits(this.appId).subscribe(
            (res: any) => {
                this.commitList = res.data;
                // this.currentEnvironments = res.data[0].environmentStateList;
                this.commitList[0].active = true;
                // this.currentCommit = this.commitList[0];
                this.alertService.sendAlert(res);
                this.currentCommitIndex = 0;
                setTimeout(() => { this.mapSuccessors(this.commitList[0].environmentStateList); }, 100);
            }
        );
    }

    mapSuccessors(currentEnvironments) {
        const wrapper = document.getElementById('pwrapper');
        const currentSvg = wrapper.querySelectorAll('#svg');
        currentSvg.forEach(currSvg => wrapper.removeChild(currSvg));

        currentEnvironments.map(env => {
            this.currentMappingEnvironment = env;
            env.steps.map(
                step => {
                    if (step.appPipelineStep.successors) {
                        step.appPipelineStep.successors.map(
                            succ => {
                                this.add(step.appPipelineStep, succ.appPipelineStep, currentEnvironments);
                            }
                        );
                    }
                }
            );
        });
    }

    updatePipeline(index) {
        // this.currentCommit = this.commitList[index];
        // this.currentEnvironments = this.commitList[index].environmentStateList;
        this.commitList[this.currentCommitIndex].active = false;
        this.currentCommitIndex = index;
        this.commitList[this.currentCommitIndex].active = true;
        setTimeout(() => { this.mapSuccessors(this.commitList[index].environmentStateList); }, 100);
    }

    add(parent, succ, currentEnvironments) {
        const parentIndex = this.currentMappingEnvironment.steps.findIndex(step => step.appPipelineStep.id === parent.id);

        if (parent.appEnvironmentId === succ.appEnvironmentId) {
            const succIndex = this.currentMappingEnvironment.steps.findIndex(step => step.appPipelineStep.id === succ.id);
            if (+(parentIndex + 1) === succIndex) {
                document.getElementById(succ.id).getElementsByTagName('div')[0].classList.add('topIcon');
            }
            else {
                const parentElementSameEnv = document.getElementById(parent.id);
                const childElementSameEnv = document.getElementById(succ.id);

                parentElementSameEnv.classList.add('leftcon');
                childElementSameEnv.classList.add('leftcon');


                const x1 = parentElementSameEnv.getBoundingClientRect().left -
                    document.getElementById('pwrapper').getBoundingClientRect().left - 14;
                const x2 = childElementSameEnv.getBoundingClientRect().left -
                    document.getElementById('pwrapper').getBoundingClientRect().left - 14;
                let y1 = 0;
                let y2 = 0;

                y1 = parentElementSameEnv.getBoundingClientRect().top -
                    document.getElementById('pwrapper').getBoundingClientRect().top +
                    parentElementSameEnv.getBoundingClientRect().height / 2;
                y2 = childElementSameEnv.getBoundingClientRect().top -
                    document.getElementById('pwrapper').getBoundingClientRect().top +
                    childElementSameEnv.getBoundingClientRect().height / 2;


                const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg1.setAttribute('id', 'svg');

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('stroke-width', '2px');
                line.setAttribute('stroke', '#45e5c3');
                line.setAttribute('marker-end', 'url(#triangle)');

                svg1.appendChild(line);


                svg1.style.position = 'absolute';
                svg1.style.top = '0';
                svg1.style.left = '0';
                svg1.style.width = document.getElementById('commitPipelineStep').style.width +
                    document.getElementById('commitPipelineStep').scrollWidth;
                svg1.style.height = document.getElementById('commitPipelineStep').style.height +
                    document.getElementById('commitPipelineStep').scrollHeight;
                svg1.style.zIndex = '20';


                line.setAttribute('x1', `${x1}`);
                line.setAttribute('x2', `${x2}`);
                line.setAttribute('y1', `${y1}`);
                line.setAttribute('y2', `${y2}`);
                document.getElementById('pwrapper').appendChild(svg1);
            }
        }
        else {

            const succEnvIndex = currentEnvironments.findIndex(env => env.appEnvironment.id === succ.appEnvironmentId);
            const succFromOtherEnvIndex = currentEnvironments[succEnvIndex].steps.findIndex(step => step.appPipelineStep.id === succ.id);
            if (+parentIndex === +succFromOtherEnvIndex) {
                const childElement = document.getElementById(succ.id);
                childElement.classList.add('longLeftcon');
            }
            else {
                const parentElement = document.getElementById(parent.id);
                const childElement = document.getElementById(succ.id);
                parentElement.classList.add('rightcon');
                childElement.classList.add('leftcon');
                this.drawLine(parentElement, childElement);
            }
        }
    }

    drawLine(parentElement, childElement) {
        const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute('id', 'svg');

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('stroke-width', '2px');
        line.setAttribute('stroke', '#45e5c3');
        line.setAttribute('marker-end', 'url(#triangle)');

        svg1.appendChild(line);


        svg1.style.position = 'absolute';
        svg1.style.top = '0';
        svg1.style.left = '0';
        svg1.style.width = document.getElementById('commitPipelineStep').style.width +
            document.getElementById('commitPipelineStep').scrollWidth;
        svg1.style.height = document.getElementById('commitPipelineStep').style.height +
            document.getElementById('commitPipelineStep').scrollHeight;
        svg1.style.zIndex = '20';

        const x1 = parentElement.getBoundingClientRect().right - document.getElementById('pwrapper').getBoundingClientRect().left + 14;
        const x2 = childElement.getBoundingClientRect().left - document.getElementById('pwrapper').getBoundingClientRect().left - 14;
        let y1 = 0;
        let y2 = 0;

        y1 = parentElement.getBoundingClientRect().top - document.getElementById('pwrapper').getBoundingClientRect().top +
            parentElement.getBoundingClientRect().height / 2;
        y2 = childElement.getBoundingClientRect().top - document.getElementById('pwrapper').getBoundingClientRect().top +
            childElement.getBoundingClientRect().height / 2;

        line.setAttribute('x1', `${x1}`);
        line.setAttribute('x2', `${x2}`);
        line.setAttribute('y1', `${y1}`);
        line.setAttribute('y2', `${y2}`);
        document.getElementById('pwrapper').appendChild(svg1);
    }

    fetchLogofPastStep(item, type) {
        const queryParams = { 'appCommitPipelineStepId': item.id, 'fetchType': type };
        this.applicationService.getLogs(queryParams).subscribe(
            (res: any) => {
                if (type === 'text') {
                    const match = /\r|\n/.exec(res.data);
                    if (match) {
                        res.data = res.data.replace(/\n/g, "<br>");
                        res.data = res.data.replace(/\r/g, "&emsp;");
                    }
                    this.logOnModal = res.data;

                    this.modal.open(this.logModalContent, { 'size': 'xl' as 'lg', 'centered': true, backdrop: 'static' });
                    const modal = <HTMLElement>document.querySelector('.modal-content');
                    modal.style.height = '80vh';
                }
                else {
                    this.download(`${this.appName}-${this.commitList[this.currentCommitIndex].appCommit.gitCommitId}-
                    ${item.appPipelineStep.name}-log.txt`, res.data);
                }
            }
        );
    }

    download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    expandTofullScreen() {
        this.logFullScreen = true;
        document.getElementsByClassName('modal-dialog')[0].classList.add('fullscreeen-modal-dialog');
        document.getElementsByClassName('modal-content')[0].classList.add('fullscreeen-modal-content');
    }

    minimizefullScreen() {
        this.logFullScreen = false;
        document.getElementsByClassName('modal-dialog')[0].classList.remove('fullscreeen-modal-dialog');
        document.getElementsByClassName('modal-content')[0].classList.remove('fullscreeen-modal-content');
    }

    triggerStep(confimationModal, commitIndex, envIndex, stepIndex, stepId, isCanaryDeployment, isForceRun) {
        if (this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].type === 'SUCCESS' &&
            this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].runningAsCanary === true && isForceRun != true) {
            this.newRunPipelineStepParams = {
                "commitIndex": commitIndex,
                "envIndex": envIndex,
                "stepIndex": stepIndex,
                "stepId": stepId
            };
            this.deploymentConfirmationModal = this.modal.open(
                confimationModal,
                { centered: true, size: 'lg', backdrop: 'static' }
            );
            return;
        }

        const currentStepStatusType = this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].type;

        this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].progressValue = 0;
        this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].starting = true;
        this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].type = 'RUNNING';

        isCanaryDeployment = isCanaryDeployment === null ? false : isCanaryDeployment;
        isForceRun = isForceRun === null ? false : isForceRun;
        this.pipelineStepRunning = true;

        if (this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].appPipelineStep.stepType === 'DEPLOY') {
            this.runningPipelineStepRunType = "ROLLOUT";
            if (isCanaryDeployment) {
               this.runningPipelineStepRunType = "CANARY";
            }
        } else {
            this.runningPipelineStepRunType = null;
        }

        this.applicationService.triggerStep({ "appCommitPipelineStepId": stepId, "canaryDeployment": isCanaryDeployment, "forceRun": isForceRun }).subscribe(
            (response: any) => {
                console.log(response);
                if (response.status === 'warning') {
                    this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].progressValue = null;
                    this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].type = currentStepStatusType;
                    this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].starting = false;

                    if (response.data.type === 'DEPLOYMENT_EXIST_FOR_OTHER_COMMIT' && response.data.value === 'TRUE') {
                        this.newRunPipelineStepParams = {
                            "commitIndex": commitIndex,
                            "envIndex": envIndex,
                            "stepIndex": stepIndex,
                            "stepId": stepId
                        };
                        this.deploymentConfirmationMessage = response.message;
                        this.deploymentConfirmationModal = this.modal.open(
                            confimationModal,
                            { centered: true, size: 'lg', backdrop: 'static' }
                        );
                    } else {
                        this.alertService.sendAlert(response);
                    }
                    this.pipelineStepRunning = false;
                } else {
                    if (response.status === 'success') {
                        this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].type = 'PENDING';

                        // If Step Type is DEPLOY then update previously active App Commit Pipeline Step Status Type
                        if (response.data != null && this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].appPipelineStep.stepType === 'DEPLOY') {
                            this.updatePreviousActiveAppCommitPipelineStepStatusType(response.data.previousAppCommitStateId,
                                response.data.previousActiveAppCommitPipelineStepId, response.data.updatedPipelineStepStatusType);
                        }

                    } else {
                        this.commitList[commitIndex].environmentStateList[envIndex].steps[stepIndex].type = currentStepStatusType;
                        this.pipelineStepRunning = false;
                    }
                    this.alertService.sendAlert(response);
                }
            }
        );
    }

    updatePreviousActiveAppCommitPipelineStepStatusType(appCommitStateId, appCommitPipelineStepId, updatedPipelinseStepStatusType) {
        let found = false;
        for (let i = 0; i < this.commitList.length; i++) {
            if (this.commitList[i].id === appCommitStateId) {
               for (let j = 0; j < this.commitList[i].environmentStateList.length; j++) {
                   for (let k = 0; k < this.commitList[i].environmentStateList[j].steps.length; k++) {
                       if (this.commitList[i].environmentStateList[j].steps[k].id === appCommitPipelineStepId) {
                           this.commitList[i].environmentStateList[j].steps[k].type = updatedPipelinseStepStatusType;
                           found = true;
                           break;
                       }
                   }
                   if (found) {
                       break;
                   }
               }
               break;
            }
        }
    }

    applyRolloutUpdate() {
        this.triggerStep(null, this.newRunPipelineStepParams.commitIndex,
            this.newRunPipelineStepParams.envIndex, this.newRunPipelineStepParams.stepIndex,
            this.newRunPipelineStepParams.stepId, false, true);
        this.deploymentConfirmationModal.close();
    }

    applyCanaryDeployment() {
        this.triggerStep(null, this.newRunPipelineStepParams.commitIndex,
            this.newRunPipelineStepParams.envIndex, this.newRunPipelineStepParams.stepIndex,
            this.newRunPipelineStepParams.stepId, true, true);
        this.deploymentConfirmationModal.close();
    }

    calclulateDate(date) {
        return new Date(date);
    }


    showPipelineStepDescriptionView(pipelineStep) {
        this.showPipelineStepDescription = true;
        this.currentShowingPipelineStep = pipelineStep;
        if (this.currentShowingPipelineStep.appPipelineStep.stepType === 'DEPLOY') {
            this.currentShowingPipelineStep['appVpc'] = this.findAppVpcOfPipelineStep(this.currentShowingPipelineStep.appPipelineStep.appVpcId);
        }
    }

    findAppVpcOfPipelineStep(appVpcId) {
        for (let i = 0; i < this.appVpcList.length; i++) {
            if (this.appVpcList[i].id === appVpcId) {
               return this.appVpcList[i];
            }
        }
        return null;
    }

    closePipelineStepDescriptionView() {
        this.showPipelineStepDescription = false;
        this.currentShowingPipelineStep = null;
    }
}
