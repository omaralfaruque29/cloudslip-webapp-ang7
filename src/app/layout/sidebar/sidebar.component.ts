import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CurrentUserService } from '../../services/current-user.service';


@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	@Input() sidebarVisible: boolean = true;
	@Input() navTab: string = "menu";
	@Input() currentActiveMenu;
	@Input() currentActiveSubMenu;
	@Output() changeNavTabEvent = new EventEmitter();
	@Output() activeInactiveMenuEvent = new EventEmitter();
	public themeClass: string = "theme-cyan";
	currentUser: any;

	constructor(
		private themeService: ThemeService,
		private currentUserService: CurrentUserService
	) {
		this.themeService.themeClassChange.subscribe(themeClass => {
			this.themeClass = themeClass;
		});
	}

	ngOnInit() {
		this.fetchCurrentUser();
	}

	fetchCurrentUser() {
		this.currentUser = this.currentUserService.get();
	}

	changeNavTab(tab: string) {
		this.navTab = tab;
	}

	activeInactiveMenu(menuItem: string) {
		this.activeInactiveMenuEvent.emit({ 'item': menuItem });
	}

	changeTheme(theme: string) {
		this.themeService.themeChange(theme);
	}
}
