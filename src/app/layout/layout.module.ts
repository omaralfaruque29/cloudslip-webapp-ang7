import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HasAnyAuthorityDirective } from "../directives/has-any-authority.directive";
import { NotificationComponent } from "../features/notification/components/notification.component";
import { NotificationService } from '../features/notification/services/notification.service';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		RouterModule
	],
	declarations: [HeaderComponent, SidebarComponent, PageLoaderComponent, HasAnyAuthorityDirective, NotificationComponent],
	exports: [HeaderComponent, SidebarComponent, PageLoaderComponent, NotificationComponent],
	providers: [
		NotificationService
	]
})
export class LayoutModule { }
