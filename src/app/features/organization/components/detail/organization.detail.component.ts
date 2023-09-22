import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { OrganizationService } from '../../services/service-api/organization.service';
import { Organization } from '../../services/domain/organization.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { BaseClass } from '../../../../shared/base.class';

@Component({
    selector: 'app-organization-detail',
    templateUrl: './organization.detail.component.html'
})

export class OrganizationDetailComponent extends BaseClass implements OnInit {

    organization: Organization;
    organizationId: string;
    sidebarVisible = true;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private organizationService: OrganizationService,
        private route: ActivatedRoute,
        private router: Router
    ) { super(sidebarService, cdr); }

    ngOnInit() {
        this.organizationId = this.route.snapshot.params.id;
        this.fetchOrganizationDetail();
    }

    fetchOrganizationDetail() {
        this.organizationService.getOrganizationDetail(this.organizationId).subscribe(
            data => {
                this.organization = data;
            }
        );
    }

    back() {
        this.router.navigate(['/main/organization']);
    }
}
