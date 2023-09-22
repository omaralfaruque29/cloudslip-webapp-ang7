import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Team } from '../services/domain/team.model';
import { TeamService } from '../services/service-api/team.service';
import { TeamFormComponent } from './form/team.form.component';
import { BaseClass } from '../../../shared/base.class';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html'
})

export class TeamComponent extends BaseClass implements OnInit {

    modalRef: NgbModalRef;
    modalHeader: string;
    deletingTeam: Team;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private teamService: TeamService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.getTeamList();
        this.selection = new SelectionModel<Team>(this.allowMultiSelect, this.initialSelection);
    }

    getTeamList() {
        this.teamService.getTeamList().subscribe(
            teamList => {
                if (teamList.data) { this.tableValue = teamList.data.content; }
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(TeamFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createTeamForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getTeamList();
            modalRef.close();
        });
    }

    openEditModal(selectedTeam) {
        const modalRef = this.modalService.open(TeamFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editTeamForm(selectedTeam);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getTeamList();
            modalRef.close();
        });
    }

    openDeleteModal(content, Team?) {
        this.deletingTeam = Team ? Team : null;
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteTeam();
        }
    }

    deleteTeam() {
        this.teamService.deletTeam(this.deletingTeam.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'Team Deleted');
                this.getTeamList();
                this.modalRef.dismiss();
            }
        );
    }

    batchDelete() {
        this.selection.selected.map(selectedTeam => {
            this.deletingTeam = selectedTeam;
            this.deleteTeam();
        });
    }

    detail(team) {
        this.router.navigate(['detail', team.id], { relativeTo: this.route })
    }
}
