import { Component, Input, OnInit } from '@angular/core';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StepSuccessorUpdateComponent } from '../step-successor-update/step.successor.component';
import { ToastrService } from 'ngx-toastr';
import { EnvironmentSettingsService } from '../../../../../../main/settings/environment-settings/services/service-api/environment-settings.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { SetChecklistComponent } from "../check-list/set-checklist.component";

@Component({
    selector: 'app-pipeline-setup ',
    templateUrl: './pipeline.setup.component.html',
    styleUrls: ['../detail/application.detail.component.scss']

})

export class ApplicationPipelineSetupComponent implements OnInit {
    commitList = [];
    appId: string;
    currentMappingEnvironment;
    currentEnvironments = [];

    @Input('applicationId') set applicationId(value) {
        this.appId = value;
    }

    constructor(
        private applicationService: ApplicationService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private environmentSettingsService: EnvironmentSettingsService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.getApplicationEnvs();
    }

    getApplicationEnvs() {
        const queryParams = { 'fetchMode': 'ALL', 'filterParams': `{"appId": "${this.appId}"}` };
        this.environmentSettingsService.getApplicationEnvironments(queryParams).subscribe((res: any) => {
            this.currentEnvironments = res.data.appEnvironmentList;
        });
    }

    getUpdatedApplicationEnvs() {
        const queryParams = { 'fetchMode': 'ALL', 'filterParams': `{"appId": "${this.appId}"}` };

        this.environmentSettingsService.getApplicationEnvironments(queryParams).subscribe(
            res => {
                this.applicationService.setApplicationEnvironments(res.data.appEnvironmentList);
                this.getApplicationEnvs();
                setTimeout(() => { this.mapSuccessors(); }, 1000);
            });
    }

    mapSuccessors() {
        const wrapper = document.getElementById('twrapper');
        const currentSvg = wrapper.querySelectorAll('#svg2');
        currentSvg.forEach(currSvg => wrapper.removeChild(currSvg));

        this.currentEnvironments.map(env => {
            this.currentMappingEnvironment = env;
            env.appPipelineStepList.map(
                step => {
                    if (step.successors) {
                        step.successors.map(
                            succ => {
                                this.add(step, succ.appPipelineStep);
                            }
                        );
                    }
                }
            );
        });

        // document.getElementById('pipelineStep').style.maxWidth = '1100px';
        // document.getElementById('pipelineStep').style.overflow = 'scroll';

    }

    updateSuccessor(step) {
        const currentEnvIndex = this.currentEnvironments.findIndex((currEnv: any) => currEnv.id === step.appEnvironmentId);
        const stepIndex = this.currentEnvironments[currentEnvIndex].appPipelineStepList.findIndex(
            (currStep: any) => currStep.id === step.id);
        let tempCurrentEnvSteps = [...this.currentEnvironments[currentEnvIndex].appPipelineStepList];
        if (stepIndex >= 0) {
            tempCurrentEnvSteps = tempCurrentEnvSteps.splice(stepIndex + 1, tempCurrentEnvSteps.length);

            let availableSteps = [];

            if (this.currentEnvironments.length > 1 && currentEnvIndex < this.currentEnvironments.length - 1) {
                availableSteps = [...tempCurrentEnvSteps, ...this.currentEnvironments[currentEnvIndex + 1].appPipelineStepList];
            }
            else {
                availableSteps = [...tempCurrentEnvSteps];
            }

            if (step.successors) {
                step.successors.map(stepSucc => {
                    const stepsuccIndex = availableSteps.findIndex((currStep: any) => currStep.id === stepSucc.appPipelineStep.id);
                    if (stepsuccIndex >= 0) {
                        availableSteps.splice(stepsuccIndex, 1);
                    }
                });
            }

            if (step.successors || availableSteps.length > 0) {
                const modalRef = this.modalService.open(StepSuccessorUpdateComponent,
                    { size: 'xl' as 'lg', centered: true, backdrop: 'static' });
                modalRef.componentInstance.pipelineStep = step;
                modalRef.componentInstance.availableSteps = availableSteps;
                modalRef.componentInstance.onSave.subscribe(response => {
                    this.getUpdatedApplicationEnvs();
                    modalRef.close();
                });
            }
            else {
                this.toastr.info('This step can\'t have any successor');
            }
        }
    }

    setChecklist(appEnvironment) {
        const modalRef = this.modalService.open(SetChecklistComponent,
            { size: 'lg' as 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.applicationId = appEnvironment.applicationId;
        modalRef.componentInstance.appEnvironmentId = appEnvironment.id;
        modalRef.componentInstance.environmentName = appEnvironment.environment.name;
        modalRef.componentInstance.onSave.subscribe(response => {
            modalRef.close();
        });
    }

    add(parent, succ) {
        const parentIndex = this.currentMappingEnvironment.appPipelineStepList.findIndex(step => step.id === parent.id);

        if (parent.appEnvironmentId === succ.appEnvironmentId) {
            const succIndex = this.currentMappingEnvironment.appPipelineStepList.findIndex(step => step.id === succ.id);
            if (+(parentIndex + 1) === succIndex) {
                document.getElementById('p' + succ.id).getElementsByTagName('div')[0].classList.add('topIcon');
            }
            else {
                const parentElementSameEnv = document.getElementById('p' + parent.id);
                const childElementSameEnv = document.getElementById('p' + succ.id);

                parentElementSameEnv.classList.add('leftcon');
                childElementSameEnv.classList.add('leftcon');


                const x1 = parentElementSameEnv.getBoundingClientRect().left -
                    document.getElementById('twrapper').getBoundingClientRect().left - 14;
                const x2 = childElementSameEnv.getBoundingClientRect().left -
                    document.getElementById('twrapper').getBoundingClientRect().left - 14;
                let y1 = 0;
                let y2 = 0;
                // if (pageYOffset > 0) {
                //     y1 = parentElementSameEnv.getBoundingClientRect().top -
                //         document.getElementById('twrapper').getBoundingClientRect().top + 20;
                //     y2 = childElementSameEnv.getBoundingClientRect().top -
                //         document.getElementById('twrapper').getBoundingClientRect().top + 20;
                // }
                // else {
                y1 = parentElementSameEnv.getBoundingClientRect().top -
                    document.getElementById('twrapper').getBoundingClientRect().top +
                    parentElementSameEnv.getBoundingClientRect().height / 2;
                y2 = childElementSameEnv.getBoundingClientRect().top -
                    document.getElementById('twrapper').getBoundingClientRect().top +
                    childElementSameEnv.getBoundingClientRect().height / 2;
                // }


                const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg1.setAttribute('id', 'svg2');

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('stroke-width', '2px');
                line.setAttribute('stroke', '#45e5c3');
                line.setAttribute('marker-end', 'url(#triangle2)');

                svg1.appendChild(line);


                svg1.style.position = 'absolute';
                svg1.style.top = '0';
                svg1.style.left = '0';
                svg1.style.width = document.getElementById('pipelineStep').style.width +
                    document.getElementById('pipelineStep').scrollWidth;
                svg1.style.height = document.getElementById('pipelineStep').style.height +
                    document.getElementById('pipelineStep').scrollHeight;
                svg1.style.zIndex = '20';


                line.setAttribute('x1', `${x1}`);
                line.setAttribute('x2', `${x2}`);
                line.setAttribute('y1', `${y1}`);
                line.setAttribute('y2', `${y2}`);
                // line.style.zIndex = '20';
                document.getElementById('twrapper').appendChild(svg1);
            }
        }
        else {

            const succEnvIndex = this.currentEnvironments.findIndex(env => env.id === succ.appEnvironmentId);
            const succFromOtherEnvIndex = this.currentEnvironments[succEnvIndex].appPipelineStepList.findIndex(step => step.id === succ.id);
            if (+parentIndex === +succFromOtherEnvIndex) {
                const childElement = document.getElementById('p' + succ.id);
                childElement.classList.add('longLeftcon');
            }
            else {
                const parentElement = document.getElementById('p' + parent.id);
                const childElement = document.getElementById('p' + succ.id);
                parentElement.classList.add('rightcon');
                childElement.classList.add('leftcon');
                this.drawLine(parentElement, childElement);
            }
        }
    }

    drawLine(parentElement, childElement) {
        const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute('id', 'svg2');

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('stroke-width', '2px');
        line.setAttribute('stroke', '#45e5c3');
        line.setAttribute('marker-end', 'url(#triangle2)');

        svg1.appendChild(line);


        svg1.style.position = 'absolute';
        svg1.style.top = '0';
        svg1.style.left = '0';
        svg1.style.width = document.getElementById('pipelineStep').style.width +
            document.getElementById('pipelineStep').scrollWidth;
        svg1.style.height = document.getElementById('pipelineStep').style.height +
            document.getElementById('pipelineStep').scrollHeight;
        // svg1.style.width = '100%';
        // svg1.style.height = '100%';
        svg1.style.zIndex = '20';

        console.log(document.getElementById('twrapper').getBoundingClientRect().left);
        console.log(document.getElementById('twrapper').getBoundingClientRect().top);
        const x1 = parentElement.getBoundingClientRect().right - document.getElementById('twrapper').getBoundingClientRect().left + 14;
        const x2 = childElement.getBoundingClientRect().left - document.getElementById('twrapper').getBoundingClientRect().left - 14;
        let y1 = 0;
        let y2 = 0;
        // if (pageYOffset > 0) {
        //     y1 = parentElement.getBoundingClientRect().top - document.getElementById('twrapper').getBoundingClientRect().top + 20;
        //     y2 = childElement.getBoundingClientRect().top - document.getElementById('twrapper').getBoundingClientRect().top + 20;
        // }
        // else {
        y1 = parentElement.getBoundingClientRect().top - document.getElementById('twrapper').getBoundingClientRect().top +
            parentElement.getBoundingClientRect().height / 2;
        y2 = childElement.getBoundingClientRect().top - document.getElementById('twrapper').getBoundingClientRect().top +
            childElement.getBoundingClientRect().height / 2;
        // }
        line.setAttribute('x1', `${x1}`);
        line.setAttribute('x2', `${x2}`);
        line.setAttribute('y1', `${y1}`);
        line.setAttribute('y2', `${y2}`);
        // line.style.zIndex = '20';
        document.getElementById('twrapper').appendChild(svg1);
    }

    // addNewStep(env) {
    //     this.applicationService.createCustomPipelineStep({
    //         "name": "Custom Pipeline 1",
    //         "appEnvironmentId": `${env.id}`,
    //         "jenkinsUrl": "/url/bin",
    //         "jenkinsApiToken": "736asd431ewq43"
    //     }).subscribe(
    //         res => {
    //             this.alertService.sendAlert(res);
    //             this.getUpdatedApplicationEnvs();
    //         }
    //     );
    // }

}
