import { Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { EChartOption } from 'echarts';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { SidebarService } from "../../../services/sidebar.service";
import { UserService } from "../../../features/user/services/service-api/user.service";
import { CurrentUserService } from "../../../services/current-user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventEmitter } from '@angular/core';
import { Message } from "../services/domain/message.model";
import { MessageService } from "../services/service-api/message.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
	selector: 'app-compose',
	templateUrl: './compose.component.html',
	styleUrls: ['./compose.component.css'],
	providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class ComposeComponent implements OnInit {

	items = [];
	itemOptions = [{ value: 1, display: 'Pizza' }, { value: 2, display: 'Pasta' }, { value: 3, display: 'Burger' }];
	recipients = [];
	recipientOptions = [];

	@Output() onSave = new EventEmitter<boolean>();
	composeMessageForm: FormGroup;

	public visitorsOptions: EChartOption = {};
	public visitsOptions: EChartOption = {};
	public sidebarVisible: boolean = true;
	public htmlContent: string = "";
	private currentUser = {};
	public config: object = {
		items: [
			'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
			'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
			'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
			'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
			'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
			'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
	};


	constructor(
		private fb: FormBuilder,
		private router: Router,
		private sidebarService: SidebarService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private userService: UserService,
		private currentUserService: CurrentUserService,
		private messageService: MessageService
	) {

	}

	ngOnInit() {
		this.loadRecipientOptions();
		this.initForm(new Message());
	}

	loadRecipientOptions() {
		this.currentUser = this.currentUserService.get();
		this.userService.getUserList("?fetchMode=ALL").subscribe(
			response => {
				if (response['status'] === "success" && response['data'] !== null && response['data'].length > 0) {
					for (let i = 0; i < response['data'].length; i++) {
						if (response['data'][i]['username'] !== this.currentUser['username']) {
							const recipientOption = {
								value: response['data'][i]['id'],
								display: response['data'][i]['username']
							};
							this.recipientOptions.push(recipientOption);
						}
					}
				}
			}
		);
	}

	initForm(formData: Message) {
		formData = formData ? formData : new Message();

		this.composeMessageForm = this.fb.group({
			recipients: [formData.recipients, [Validators.required]],
			subject: [formData.subject, [Validators.required]],
			content: [formData.content, [Validators.required]],
		});
	}

	toggleFullWidth() {
		this.sidebarService.toggle();
		this.sidebarVisible = this.sidebarService.getStatus();
		this.cdr.detectChanges();
	}

	generateRecipientIdList(recipients) {
		const recipientIdList = [];
		if (recipients === null) {
			return recipientIdList;
		}
		for (let i = 0; i < recipients.length; i++) {
			recipientIdList.push(recipients[i].value);
		}
		return recipientIdList;
	}

	sendMessage() {
		console.log("sending message");
		if (!this.composeMessageForm.valid) {
			return;
		}

		const message = {
			recipientIdList: this.generateRecipientIdList(this.composeMessageForm.value['recipients']),
			subject: this.composeMessageForm.value['subject'],
			content: this.composeMessageForm.value['content']
		};

		console.log(message);

		this.messageService.sendMessage(message).subscribe(
			response => {
				if (response['status'] === "success") {
					this.toastr.success('Message Sent');
					this.router.navigate(['/main/messages/inbox']);
				}
			}
		);
	}

}
