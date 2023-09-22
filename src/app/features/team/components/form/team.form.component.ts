import { Component, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../services/service-api/team.service';
import { Team } from '../../services/domain/team.model';
import { FormBaseClass } from '../../../../shared/form.base.class';

@Component({
    selector: 'app-team-form',
    templateUrl: './team.form.component.html'
})


export class TeamFormComponent extends FormBaseClass implements OnInit {

    @Output() onSave = new EventEmitter<boolean>();

    teamForm: FormGroup;

    modalHeader: string;
    modalActionButton: string;
    organizationList = [{ name: 'Select a organization', id: null }];
    teamId: number = null;

    constructor(
        private fb: FormBuilder,
        private teamService: TeamService,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
    ) { super(); }

    ngOnInit() {
        this.getOrganizationList();
    }

    getOrganizationList() {
        this.teamService.getOrganizationList().subscribe(
            org => { this.organizationList = this.organizationList.concat(org.data); }
        );
    }

    createTeamForm() {
        this.modalHeader = 'Create new team';
        this.modalActionButton = 'Create';
        this.initForm(new Team());
    }

    editTeamForm(selectedteam) {
        this.modalHeader = 'Edit team';
        this.modalActionButton = 'Update';
        this.teamId = selectedteam.id;
        this.initForm(selectedteam);
    }

    initForm(formData) {
        formData = formData ? formData : new Team();
        formData.organizationId = formData.organization ? formData.organization.id : null;
        this.teamForm = this.fb.group({
            id: [formData.id ? formData.id : null],
            name: [formData.name, [Validators.required]],
            description: [formData.description],
            organizationId: [formData.organizationId, [Validators.required]
            ]
        });
    }


    submit() {

        this.removeAdminEmailonEdit();
        this.markFormGroupasTouchedandDirty(this.teamForm);

        if (this.formInvalid()) { return; }

        const newCompnay = this.teamForm.value;

        if (this.teamId) {
            this.updateteam(newCompnay);
        }
        else {
            this.createteam(newCompnay);
        }
    }

    removeAdminEmailonEdit() {
        if (this.teamId) {
            this.teamForm.removeControl('adminEmail');
            this.teamForm.updateValueAndValidity();
        }
    }

    formInvalid() {
        return this.teamForm.invalid;
    }

    createteam(newCompnay) {
        this.teamService.createTeam(newCompnay).subscribe(
            data => {
                this.toastr.success(data['message'], 'team Created');
                this.onSave.emit(true);
            }
        );
    }

    updateteam(newCompnay) {
        this.teamService.updateTeam(newCompnay).subscribe(
            data => {
                this.toastr.success(data['message'], 'team Updated');
                this.onSave.emit(true);
            }
        );
    }
}
