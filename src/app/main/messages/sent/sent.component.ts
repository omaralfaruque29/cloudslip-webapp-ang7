import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EChartOption } from 'echarts';
import { SidebarService } from "../../../services/sidebar.service";
import { MessageService } from "../services/service-api/message.service";

@Component({
	selector: 'app-inbox',
	templateUrl: './sent.component.html',
	styleUrls: ['./sent.component.css']
})
export class SentComponent implements OnInit {

	public sidebarVisible: boolean = true;
	public showInboxMenu: boolean = false;
	messageList: Array<object> = [];

	constructor(
		private sidebarService: SidebarService,
		private cdr: ChangeDetectorRef,
		private messageService: MessageService
	) {

	}

	ngOnInit() {
		this.loadInbox();
	}

	loadInbox() {
		this.messageService.getMessageList(encodeURI('?filterParams={"type":"SENT"}')).subscribe(
			response => {
				if (response['status'] === 'success') {
					this.messageList = response['data']['content'];
				}
			}
		);
	}

	toggleFullWidth() {
		this.sidebarService.toggle();
		this.sidebarVisible = this.sidebarService.getStatus();
		this.cdr.detectChanges();
	}

	toggleMenu() {
		this.showInboxMenu = !this.showInboxMenu;
	}

}
