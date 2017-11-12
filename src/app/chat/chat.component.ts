import { Component, OnInit, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service'
import { trigger, style, animate, transition, keyframes, state } from '@angular/animations';


class User {
  username: string;
  id: string;
  isActive: boolean;
  constructor(username, id, isActive) {
  	this.username = username
  	this.id = id
  	this.isActive = isActive
  }
}

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
	users = []
	isConnected: boolean
	isConversationStarted: boolean
	userStream
	messageStream
	conversationId: string
	conversationTitle: string
	constructor(private chatService: ChatService) { }
	onConnect(id, users) {
		this.id = id
		this.isConnected = true
		this.users = users
		this.userStream = this.chatService.monitorUsers().subscribe(data => {
			this.users
				.find(user => user.id === data['id'])
				.isActive = data['isActive']
		})
		this.messageStream = this.chatService.getMessages().subscribe(data => {
			if(data['author'] === this.conversationId) {
				this.chatService.announceMessage(data)
			}
			else {
				this.users.forEach(user => {
					if(user.id === data['author'])
						user.unreadMessages++
				})
			}
		})

	}

	startPrivateConversation(conversation) {
		this.conversationId = conversation.id,
		this.conversationTitle = conversation.username
		this.isConversationStarted = true
	}
	ngOnInit() {
		this.isConnected = false
		this.isConversationStarted = false
		this.chatService.connect(this.onConnect.bind(this))
	}
	ngOnDestroy() {
		this.userStream.unsubscribe()
	}
}
