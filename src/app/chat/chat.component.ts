import { Component, OnInit, HostBinding, Inject } from '@angular/core'
import { ChatService } from '../chat.service'
import { AuthService } from '../auth.service'
import { trigger, style, animate, transition, keyframes, state } from '@angular/animations'
import { MatDialog, MatSidenav } from '@angular/material'
import { NewGroupComponent } from "./new-group/new-group.component"


@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	animations: [
		trigger('slideTop', [
			transition(':enter', [
				style({
					transform: 'translateY(-100%)'
				}), animate(500)
		   ])
		]),
		trigger('show', [
			transition(':enter', [
				style({
					opacity: '0'
				}), animate(2000)
		   ])
		])
	],
	host: {
		'[@slideTop]': ''
	}
})


export class ChatComponent implements OnInit {
	id: string
	users: Array<any> = []
	userStream
	messageStream
	username: string
	groups: Array<any> = []
	activeView: string = 'loading'
	isLoading: boolean;
	currentChatPartner;
	currentChatGroup;
	currentChatUsers: Array<any>;
	constructor(private chatService: ChatService, private authService: AuthService, public dialog: MatDialog) { }
	onConnect(activeUsers) {
		this.users = this.users.map(user => {
			if(activeUsers.find(activeUser => activeUser.id === user._id)) {
				return Object.assign(user, { isActive: true, unreadMessages: 0 })
			}
			else {
				return Object.assign(user, { unreadMessages: 0 })
			}
		})
		this.userStream = this.chatService.monitorUsers().subscribe(data => {
			this.users
				.find(user => user._id === data['id'])
				.isActive = data['isActive']
		})
		this.chatService.getMessages().subscribe(message => {
			if(this.currentChatPartner && this.currentChatPartner._id === message['author']._id)
				this.chatService.announceMessage(message)
			else {
				this.users.find(user => user._id === message['author']._id).unreadMessages++
			}
		})

		this.chatService.getGroupMessages().subscribe(message => {
			if(this.currentChatGroup && this.currentChatGroup._id === message['groupId']) {
				this.chatService.announceMessage(message)
			}
			else {

			}
		})
		this.chatService.getNewGroupMessages
		this.chatService.getNewGroupMessages().subscribe(group => {
			this.groups.push(group)
		})
		this.isLoading = false
		this.activeView = 'welcome'
	}

	startPrivateConversation(user) {
		user.unreadMessages = 0
		this.currentChatPartner = user
		this.activeView = 'conversation'
	}

	startGroupConversation(group) {
		this.currentChatUsers = this.users.filter(user => (group.users.includes(user._id)))
		this.currentChatGroup = group
		this.activeView = 'group-conversation'
	}

	onNewGroupClick() {
		let dialogRef = this.dialog.open(NewGroupComponent, {
			data: {
				users: this.users,
				title: "",
			},
			width: '600px',
			height: 'auto'
		})
		dialogRef.afterClosed().subscribe(data => {
			if(data) {
				let dataToSend = {
					title: data.title,
					users: data.selectedUsers
				}
				dataToSend.users.push(this.id)
				this.chatService.sendNewGroupMessage(dataToSend, this.getNewGroupAck.bind(this))
			}
		})
	}

	getNewGroupAck(group) {
		this.groups.push(group)
	}

	ngOnInit() {
		this.activeView = 'loading'
		this.isLoading = true
		if(!this.authService.username) {
			this.authService.getUsername().subscribe(data => {
				if(data['status'] === 'success') {
					this.authService.username = data['username']
					this.username = this.authService.username
				}
			})
		}
		else {
			this.username = this.authService.username
		}

		this.chatService.getChatData().subscribe(data => {
			this.users = data['users'].map(user => {
				return Object.assign(user, { isActive: false })
			})
			this.groups = data['groups']
			this.id = this.chatService.connect(this.groups)
			this.chatService.getActiveUsers().subscribe(activeUsers => this.onConnect(activeUsers))
		})
	}
	ngOnDestroy() {
		this.userStream.unsubscribe()
	}
}
