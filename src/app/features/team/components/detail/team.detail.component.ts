import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { Team } from '../../services/domain/team.model';
import { TeamService } from '../../services/service-api/team.service';
import { BaseClass } from '../../../../shared/base.class';
import { UserService } from '../../../user/services/service-api/user.service';
import { User } from '../../../user/services/domain/user.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-team-detail',
    templateUrl: './team.detail.component.html'
})

export class TeamDetailComponent extends BaseClass implements OnInit {
    team: Team = new Team();
    deletingUser: User;
    modalRef: NgbModalRef;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private router: Router,
        private modalService: NgbModal,
        private teamService: TeamService,
        private userService: UserService,
        private toastr: ToastrService,
        private route: ActivatedRoute) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.selection = new SelectionModel<User>(this.allowMultiSelect, this.initialSelection);
        this.team = this.route.snapshot.data['teamData'].team.data;
        this.tableValue = this.route.snapshot.data['teamData'].users.data;
    }


    getUserList() {
        const queryParams = { 'fetchMode': 'ALL', 'filterParams': `{"teamId":"${this.team.id}"}` };
        this.userService.getUserListbyTeam(queryParams).subscribe(
            userList => {
                if (userList.data) {
                    this.tableValue = userList.data;
                }
            }
        );
    }

    openDeleteModal(content, user?) {
        if (user) {
            this.selection.select(user);
        }
        console.log(this.selection.selected);
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    deleteuser() {
        const userListToDelete = this.tableValue.map(user => user.id);
        this.userService.deleteUserFromTeam({
            "teamId": this.team.id,
            "userList": userListToDelete
        }).subscribe(
            data => {
                this.toastr.success(data['message'], 'user removed');
                this.getUserList();
                this.selection.clear();
                this.modalRef.dismiss();
            }
        );
    }

    detail(user) {
        this.router.navigate(['detail', user.id], { relativeTo: this.route });
    }

    back() {
        this.router.navigate(['/main/team']);
    }
}
