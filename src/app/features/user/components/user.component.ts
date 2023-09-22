import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModalRef, NgbModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from '../../../services/sidebar.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseClass } from '../../../shared/base.class';
import { UserFormComponent } from './form/user.form.component';
import { User } from '../services/domain/user.model';
import { UserService } from '../services/service-api/user.service';
import { TeamMappingComponent } from './team-mapping/team.mapping.component';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    providers: [NgbDropdown]
})

export class UserComponent extends BaseClass implements OnInit {

    modalRef: NgbModalRef;
    modalHeader: string;
    deletingUser: User;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private userService: UserService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.getUserList();
        this.selection = new SelectionModel<User>(this.allowMultiSelect, this.initialSelection);
    }

    getUserList() {
        this.userService.getUserList(null).subscribe(
            userList => {
                if (userList.data) { this.tableValue = userList.data.content; }
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(UserFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.createUserForm();
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getUserList();
            modalRef.close();
        });
    }

    openEditModal(selecteduser) {
        const modalRef = this.modalService.open(UserFormComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.editUserForm(selecteduser);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getUserList();
            modalRef.close();
        });
    }

    openTeamMappingModal() {
        const modalRef = this.modalService.open(TeamMappingComponent, { size: "lg", backdrop: 'static' });
        modalRef.componentInstance.addUserToTeam(this.selection.selected);
        modalRef.componentInstance.onSave.subscribe(response => {
            this.getUserList();
            modalRef.close();
        });
    }

    openDeleteModal(content, user?) {
        this.deletingUser = user ? user : null;
        console.log(this.selection.selected);
        this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }



    onDeleteConfirmation() {
        if (this.selection.hasValue()) {
            this.batchDelete();
        } else {
            this.deleteuser();
        }
    }

    deleteuser() {
        this.userService.deleteUser(this.deletingUser.id).subscribe(
            data => {
                this.toastr.success(data['message'], 'user Deleted');
                this.getUserList();
                this.modalRef.dismiss();
            }
        );
    }

    detail(user) {
        this.router.navigate(['detail', user.id], { relativeTo: this.route });
    }


    batchDelete() {
        this.selection.selected.map(selecteduser => {
            this.deletingUser = selecteduser;
            this.deleteuser();
        });
    }
}
