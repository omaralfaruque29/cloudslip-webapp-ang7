import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../../team/services/service-api/team.service';
import { UserService } from '../../services/service-api/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-team-mapping',
    templateUrl: './team.mapping.component.html'
})
export class TeamMappingComponent implements OnInit {
    teamId: number = null;
    teamList = [{ name: 'Select a team', id: null }];
    userList = [];
    @Output() onSave = new EventEmitter<boolean>();

    constructor(
        public activeModal: NgbActiveModal,
        private teamService: TeamService,
        private userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.fetchTeamlist();
    }

    fetchTeamlist() {
        this.teamService.getTeamList().subscribe(
            team => {
                this.teamList = this.teamList.concat(team.data.content);
            }
        )
    }

    addUserToTeam(userList) {
        this.userList = userList.map(user => user.id);
    }

    submit() {
        this.userService.addUsersToTeam({
            'teamId': this.teamId, 'userList': this.userList
        }).subscribe(
            data => {
                if (data.status === 'error') {
                    this.toastr.error(data['message']);
                } else {
                    this.toastr.success(data['message']);
                    this.onSave.emit(true);
                }
            },
        );
    }
}
