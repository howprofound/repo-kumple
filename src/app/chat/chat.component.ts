import { Component, OnInit, HostBinding, Inject } from '@angular/core'
import { ChatService } from '../chat.service'
import { AuthService } from '../auth.service'
import { trigger, style, animate, transition, keyframes, state } from '@angular/animations'
import { MatDialog } from '@angular/material'
import { NewGroupComponent } from "./new-group/new-group.component"
import { ActivatedRoute } from '@angular/router';

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
	user;
	users: Array<any> = []
	messageStream
	username: string
	groups: Array<any> = []
	activeView: string = 'loading'
	isLoading: boolean;
	currentChatPartner;
	currentChatGroup;
	currentChatUsers: Array<any>;
	isNewEvent: boolean = false;
	constructor(private chatService: ChatService, private authService: AuthService, 
		public dialog: MatDialog, 
		private route: ActivatedRoute
	) { }
	onConnect(activeUsers) {
		this.users = this.users.map(user => {
			if(activeUsers.find(activeUser => activeUser.id === user._id)) {
				return Object.assign(user, { isActive: true})
			}
			else {
				return Object.assign(user, { isActive: false})
			}
		})
		this.chatService.monitorUsers().subscribe(data => {
			let user = this.users.find(user => user._id === data['id'])
			if(user) {
				user.isActive = data['isActive']
			}
		})
				
		this.messageStream = this.chatService.getMessages().subscribe(message => {
			if(this.currentChatPartner && this.currentChatPartner._id === message['author']._id) {
				this.chatService.announceMessage(message)
			}
			else {
				this.users.find(user => user._id === message['author']._id).unreadMessages++
			}
		})

		this.chatService.getGroupMessages().subscribe(message => {
			if(this.currentChatGroup && this.currentChatGroup._id === message['groupId']) {
				this.chatService.announceMessage(message)
			}
			else {
				this.groups.find(group => group._id === message['groupId']).unreadMessages++
			}
		})
		this.chatService.getNewGroupMessages().subscribe(group => {
			this.groups.push(group)
		})

		this.chatService.monitorAddGroupUsers().subscribe(data => {
			let editGroup = this.groups.find(group => group._id === data['groupId'])
			let addUser = this.users.find(user => user._id === data['userId'])
			if(!editGroup.users.find(user => user === data['userId'])) {
				editGroup.users.push(addUser._id)
				this.currentChatUsers.push(addUser)
			}
		})
		this.chatService.monitorDeleteGroupUsers().subscribe(data => {
			let editGroup = this.groups.find(group => group._id === data['groupId'])
			let index = editGroup.users.indexOf(data['userId']);
			if (index !== -1) {
				editGroup.users.splice(index, 1)
			}
			index = this.currentChatUsers.findIndex(user => user._id === data['userId'])
			if (index !== -1) {
				this.currentChatUsers.splice(index, 1)
			}
		})
		this.chatService.monitorAddedToGroup().subscribe(data => {
			this.groups.push(data['group'])
		})
		this.chatService.monitorDeletedFromGroup().subscribe(data => {
			this.groups = this.groups.filter(group => group._id !== data['groupId'])
			if(this.currentChatGroup._id === data['groupId']) {
				this.activeView = 'welcome'
			}
		})
		this.isLoading = false
		this.activeView = 'welcome'
		this.chatService.getNewEvents().subscribe(event => {
			this.isNewEvent = true;
		})
	}

	startPrivateConversation(user) {
		user.unreadMessages = 0
		this.currentChatPartner = user
		this.activeView = 'conversation'
		this.currentChatUsers = []
		this.currentChatGroup = null
	}

	startGroupConversation(group) {
		group.unreadMessages = 0;
		this.currentChatUsers = this.users.filter(user => (group.users.includes(user._id)))
		this.currentChatGroup = group
		this.currentChatPartner = null
		this.activeView = 'group-conversation'
	}

	onNewGroupClick() {
		let dialogRef = this.dialog.open(NewGroupComponent, {
			data: {
				users: this.users
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
				dataToSend.users.push(this.user._id)
				this.chatService.sendNewGroupMessage(dataToSend, this.getNewGroupAck.bind(this))
			}
		})
	}

	getNewGroupAck(group) {
		this.groups.push(group)
	}

	ngOnInit() {
		this.route.data.subscribe((data: { user: any }) => {
			this.user = data.user
		})
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
			console.log(data)
			this.users = data['users'].map(user => {
				return Object.assign(user, { isActive: false })
			})
			this.groups = data['groups']
			this.chatService.connect()
			this.chatService.joinChat(this.groups.map(group => group._id))
			this.chatService.getActiveUsers().subscribe(activeUsers => this.onConnect(activeUsers))
		})
	}
	ngOnDestroy() {
		if(this.messageStream) {
			this.messageStream.unsubscribe()
		}
	}
}
