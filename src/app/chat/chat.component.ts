import { Component, OnInit, HostBinding, Inject } from '@angular/core'
import { ChatService } from '../chat.service'
import { AuthService } from '../auth.service'
import { trigger, style, animate, transition, keyframes, state } from '@angular/animations'
import { MatDialog } from '@angular/material'
import { NewGroupComponent } from "./new-group/new-group.component"


@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	animations: [
		trigger('slideLeft', [
			transition(':enter', [
				animate(1000, keyframes([
					style({ transform: 'translateX(-100%)', offset: 0 }),
					style({ transform: 'translateX(-100%)', offset: 0.5 }),
				  	style({ transform: 'translateX(0)', offset: 1 }),
				]))
		   ])
		]),
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
		'[@slideLeft]': '',
		'[@slideTop]': ''
	}
})


export class ChatComponent implements OnInit {
	id: string
	users: Array<any> = []
	isConversationStarted: boolean
	userStream
	messageStream
	conversationId: string
	conversationTitle: string
	username: string
	groups: Array<any> = []
	activeView: string = 'loading'
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
			if(this.conversationId === message['author'])
				this.chatService.announceMessage(message)
			else {
				this.users.find(user => user._id === message['author']).unreadMessages++
			}
		})
		this.chatService.getNewGroupMessages().subscribe(group => {
			console.log(group)
			this.groups.push(group)
		})
		this.activeView = 'welcome'
	}
	startPrivateConversation(conversation) {
		this.conversationId = conversation._id,
		this.conversationTitle = conversation.username
		conversation.unreadMessages = 0
		this.activeView = 'conversation'
	}

	onNewGroupClick() {
		/*this.activeView = 'new-group'*/
		let dialogRef = this.dialog.open(NewGroupComponent, {
			data: {
				users: this.users,
				title: ""
			},
			width: '600px',
			height: 'auto'
		})
		dialogRef.afterClosed().subscribe(data => {
			let dataToSend = {
				title: data.title,
				users: data.users.map(user => user._id)
			}
			dataToSend.users.push(this.id)
			this.chatService.sendNewGroupMessage(dataToSend, this.getNewGroupAck.bind(this))
		})
	}

	getNewGroupAck(group) {
		this.groups.push(group)
	}
	ngOnInit() {
		this.activeView = 'loading'
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
