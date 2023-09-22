import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBaseClass } from '../../../../../../shared/form.base.class';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../../../../../services/theme.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PipelineSuccesorStep, PipelineSuccesorStepMapping } from '../../../../services/domain/application.model';
import { SuccssorTriggerMode } from '../../../../services/domain/application.enums';
import { ApplicationService } from '../../../../services/service-api/application.service';
import { AlertService } from '../../../../../../shared/services/alert.service';

@Component({
    selector: 'app-step-successor-update',
    templateUrl: './step.successor.component.html'
})

export class StepSuccessorUpdateComponent extends FormBaseClass implements OnInit {

    themeClass = "theme-cyan";
    smallScreenMenu = "";

    currentSuccessors = [];
    newSuccessorOptions = [];
    successorlistToSubmit = [];
    currentPipelineStep: any;
    triggerModes = SuccssorTriggerMode;

    initialSelection = [];
    allowMultiSelect = true;
    currentSuccesorselection: any;
    availableSuccesorselection: any;

    @Input('pipelineStep') set pipelineStep(value) {
        this.currentPipelineStep = value;
        if (this.currentPipelineStep.successors) {
            this.currentSuccessors = this.currentPipelineStep.successors;
        }
    }

    @Input('availableSteps') set availableSteps(value) {
        value.map(newSucc => newSucc.triggerMode = 'MANUAL');
        this.newSuccessorOptions = value;
    }

    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        public activeModal: NgbActiveModal,
        private themeService: ThemeService,
        private applicationService: ApplicationService,
        private alertService: AlertService

    ) {
        super();
    }

    ngOnInit() {
        this.setThemeandShowMenu();
        this.currentSuccesorselection = new SelectionModel<PipelineSuccesorStep>(this.allowMultiSelect, this.initialSelection);
        this.availableSuccesorselection = new SelectionModel<PipelineSuccesorStep>(this.allowMultiSelect, this.initialSelection);

    }

    setThemeandShowMenu() {
        this.themeService.themeClassChange.subscribe(themeClass => {
            this.themeClass = themeClass;
        });

        this.themeService.smallScreenMenuShow.subscribe(showMenuClass => {
            this.smallScreenMenu = showMenuClass;
        });
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(tableValue, selection) {
        const numSelected = selection.selected.length;
        const numRows = tableValue.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(tableValue, selection) {
        this.isAllSelected(tableValue, selection) ?
            selection.clear() :
            tableValue.forEach(row => selection.select(row));
    }

    addSuccessor() {
        this.availableSuccesorselection.selected.map(
            newSucc => {
                this.availableSuccesorselection.deselect(newSucc);
                this.newSuccessorOptions.splice(this.newSuccessorOptions.findIndex(
                    succ => succ.id === newSucc.id), 1);

                this.currentSuccessors = [...this.currentSuccessors, newSucc];
                // this.currentSuccesorselection.select(newSucc);
            }
        );
    }

    removeSuccessor() {
        this.currentSuccesorselection.selected.map(
            newSucc => {
                this.currentSuccesorselection.deselect(newSucc);
                this.currentSuccessors.splice(this.currentSuccessors.findIndex(
                    succ => succ.id === newSucc.id), 1);

                this.newSuccessorOptions = [...this.newSuccessorOptions, newSucc];
                // this.currentSuccesorselection.select(newSucc);
            }
        );
    }

    submit() {
        const newPipelineStepSuccessorList: PipelineSuccesorStepMapping = new PipelineSuccesorStepMapping();
        newPipelineStepSuccessorList.pipelineStepId = this.currentPipelineStep.id;
        newPipelineStepSuccessorList.successors = this.currentSuccessors.map(succ =>
            ({ id: succ.appPipelineStep ? succ.appPipelineStep.id : succ.id, triggerMode: succ.triggerMode }));

        this.applicationService.updatePipelineStepSuccessor(newPipelineStepSuccessorList).subscribe(
            res => {
                this.alertService.sendAlert(res);
                this.onSave.emit(true);
            }
        );

    }

}
