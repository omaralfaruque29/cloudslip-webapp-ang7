import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../services/theme.service';
import { Router } from "@angular/router";
import { CurrentUserService } from "../../services/current-user.service";
import { NotificationStoreService } from '../../features/notification/services/notification.store.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	providers: [NgbDropdownConfig]
})
export class HeaderComponent implements OnInit {

	// Properties

	@Input() showNotifMenu = false;
	@Input() showToggleMenu = false;
	@Output() toggleSettingDropMenuEvent = new EventEmitter();
	@Output() toggleNotificationDropMenuEvent = new EventEmitter();
	numberOfUncheckedNotifications = 0;

	constructor(
		private config: NgbDropdownConfig,
		private themeService: ThemeService,
		private router: Router,
		public currentUserService: CurrentUserService,
		private notificationStoreService: NotificationStoreService
	) {
		config.placement = 'bottom-right';
	}

	ngOnInit() {
		this.notificationStoreService.newNotificationNumberSubject.subscribe(
			notificationNumber => {
				this.numberOfUncheckedNotifications = notificationNumber;
			}
		);
	}

	toggleSettingDropMenu() {
		this.toggleSettingDropMenuEvent.emit();
	}

	toggleNotificationDropMenu() {
		this.toggleNotificationDropMenuEvent.emit();
	}

	toggleSideMenu() {
		this.themeService.showHideMenu();
	}

	onLogout() {
		this.currentUserService.save(null);
		this.router.navigate(['/auth/login']);
	}

}
