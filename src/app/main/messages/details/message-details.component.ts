import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EChartOption } from 'echarts';
import { SidebarService } from "../../../services/sidebar.service";
import { MessageService } from "../services/service-api/message.service";
import { ActivatedRoute } from "@angular/router";
import { Message } from "../services/domain/message.model";

@Component({
	selector: 'app-inbox',
	templateUrl: './message-details.component.html',
	styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {

	public sidebarVisible: boolean = true;
	public showInboxMenu: boolean = false;
	messageList: Array<Message> = [];
	focusingMessage: Message = new Message();
	private messageThreadId: string;
	private messageId: string;
	parentState: string = "inbox";

	constructor(
		private sidebarService: SidebarService,
		private cdr: ChangeDetectorRef,
		private messageService: MessageService,
		private route: ActivatedRoute
	) {

	}

	ngOnInit() {
		this.parentState = this.route.snapshot.url[0].path;
		this.messageThreadId = this.route.snapshot.params['messageThreadId'];
		this.messageId = this.route.snapshot.params['messageId'];
		this.loadMessageThread();
	}

	loadMessageThread() {
		if (this.messageThreadId != null && this.messageId != null) {
			this.messageService.getMessageThread(this.messageThreadId).subscribe(
				response => {
					if (response['status'] === 'success') {
						this.messageList = response['data'];
						for (let i = 0; i < this.messageList.length; i++) {
							if (this.messageList[i]['id'] === this.messageId) {
								this.focusingMessage = this.messageList[i];
							}
						}
					}
				}
			);
		}
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
