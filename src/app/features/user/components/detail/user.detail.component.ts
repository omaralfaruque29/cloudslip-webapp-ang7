import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/service-api/user.service';
import { User } from '../../services/domain/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { BaseClass } from '../../../../shared/base.class';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user.detail.component.html'
})

export class UserDetailComponent extends BaseClass {
    user: any = null;
    userId: string;
    sidebarVisible = true;

    constructor(
        sidebarService: SidebarService,
        cdr: ChangeDetectorRef,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router) {
        super(sidebarService, cdr);
    }

    ngOnInit() {
        this.userId = this.route.snapshot.params.id;
        this.fetchUserDetail();
    }

    fetchUserDetail() {
        this.userService.getUserDetail(this.userId).subscribe(
            user => {
                this.user = user.data;
            }
        );
    }

    back() {
        this.router.navigate(['/main/user']);
    }

}
