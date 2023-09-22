import { Component, ChangeDetectorRef, OnInit, } from "@angular/core";
import { SidebarService } from '../../../services/sidebar.service';
import { BaseClass } from '../../../shared/base.class';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationService } from '../services/service-api/application.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ApplicationTypes } from '../services/domain/application.enums';

@Component({
    selector: 'app-application-pp',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss']
})

export class ApplicationComponent extends BaseClass implements OnInit {


    actionButtonChecker = false;
    applicationList = [];
    modalRef: NgbModalRef;
    deletingApplication: any;
    flagState = true;
    themeClass = "theme-cyan";
    smallScreenMenu = "";
    deleteModal: any;
    createOptionModal = null;
    dataLoading: boolean;
    repoLoading = false;
    repositories = [];
    currentRepositories = [];
    currentPage = 1;
    pageIndexes = [];
    appTypes = ApplicationTypes;
    appTypeLoading = false;
    type = '';
    selectedRepository = '';

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private modalService: NgbModal,
        private applicationService: ApplicationService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,

    ) {
        super(sidebarService, cdr);
        this.dataLoading = true;
    }

    ngOnInit() {
        this.getApplicationList();
        if (this.sidebarVisible) {
            this.closeFullWidth();
        }
    }

    fetchRepositories() {
        this.applicationService.getCompanyRepositories().subscribe(
            (res: any) => {
                if (res) {
                    this.repositories = res.data;
                    this.repoLoading = false;
                    this.initializePages(this.repositories);

                }
            }
        );
    }

    initializePages(repositories) {
        this.pageIndexes = [];
        const totalPages = Math.ceil(repositories.length / 5);
        for (let i = 0; i < totalPages; i++) {
            this.pageIndexes.push(i);
        }
        // const tempRepos = repositories;
        this.currentRepositories = repositories.slice(0, 5);
    }
    getApplicationList() {
        this.dataLoading = true;
        this.applicationService.getApplicationList().subscribe(
            response => {
                this.applicationList = response.data != null ? response.data : [];
                this.dataLoading = false;
            }, (error) => {
                this.dataLoading = false;
                console.log(error);
            }
        );
    }

    changePage(index) {
        if (this.currentPage !== index) {
            const startRepoIndex = +(index - 1) * 5;
            const endIndex = startRepoIndex + 5;
            const tempRepos = this.repositories;
            this.currentRepositories = tempRepos.slice(startRepoIndex, endIndex);
        }
        this.currentPage = index;
    }

    filterRepositories(searchedText) {
        if (searchedText !== '') {
            this.currentRepositories = this.repositories.filter(repo => repo.includes(searchedText));
            this.initializePages(this.currentRepositories);
        }
        else {
            this.initializePages(this.repositories);
        }
    }

    // openCreateModal() {
    //     const modalRef = this.modalService.open(ApplicationFormComponent, { size: 'xl' as 'lg', centered: true, backdrop: 'static' });
    //     modalRef.componentInstance.createNewAppForm('newApp');
    //     modalRef.componentInstance.onSave.subscribe(response => {
    //         this.getApplicationList();
    //     });
    //     modalRef.componentInstance.onSkip.subscribe(response => {
    //         this.getApplicationList();
    //         modalRef.close();
    //     });
    // }

    // openAddFromRepoModal() {
    //     const modalRef = this.modalService.open(ApplicationFormComponent, { size: 'xl' as 'lg', centered: true, backdrop: 'static' });
    //     modalRef.componentInstance.createNewAppForm('fromRepo');
    //     modalRef.componentInstance.onSave.subscribe(response => {
    //         this.getApplicationList();
    //     });
    //     modalRef.componentInstance.onSkip.subscribe(response => {
    //         this.getApplicationList();
    //         modalRef.close();
    //     });
    // }

    openAddFromListModal(content) {
        this.repoLoading = false;
        this.appTypeLoading = false;
        this.repositories = [];
        this.createOptionModal = this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static' });
    }

    createNewForm(type) {
        this.type = type;
        if (this.type === 'newApp') {
            this.appTypeLoading = true;
            // this.router.navigate(['create'], {
            //     queryParams: { appCreationType: type },
            //     relativeTo: this.route
            // });
            // if (this.createOptionModal) {
            //     this.createOptionModal.close();
            // }
        }
        else if (this.type === 'fromRepo') {
            this.repoLoading = true;
            this.repositories = [];
            this.selectedRepository = '';
            this.currentRepositories = [];
            this.fetchRepositories();
        }
    }

    naivigateToForm(appType) {
        if (this.type === 'newApp') {
            this.router.navigate(['create'], {
                queryParams: { appCreationType: this.type, applicationType: appType.value },
                relativeTo: this.route
            });
        }
        else {
            this.router.navigate(['create'], {
                queryParams: { appCreationType: this.type, applicationType: appType.value, repoName: this.selectedRepository },
                relativeTo: this.route
            });
        }
        if (this.createOptionModal) {
            this.createOptionModal.close();
        }
    }

    onRepoSelect(repoName) {
        this.appTypeLoading = true;
        this.repoLoading = false;
        this.repositories  = [];
        this.selectedRepository = repoName;
        // this.router.navigate(['create'], {
        //     queryParams: { appCreationType: 'fromRepo', repoName: repoName },
        //     relativeTo: this.route
        // });
        // this.createOptionModal.close();
        // TODO: check from list and new
    }

    goToApplicationDetail(application) {
        this.router.navigate(['detail', application.id], { relativeTo: this.route });
    }

    showActionButton() {
        this.actionButtonChecker = true;
    }

    showStartButton() {
        this.actionButtonChecker = false;
    }

    openDeleteModal(content, application?) {
        this.deletingApplication = application ? application : null;
        this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    }

    onDeleteConfirmation() {
        const queryParmas = { 'flag': this.flagState };
        this.applicationService.deleteApplication(this.deletingApplication.id, queryParmas).subscribe(
            res => {
                this.alertService.sendAlert(res);
                this.getApplicationList();
                this.deleteModal.close();
            }
        );
    }

}
