import { Component, OnInit, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service'
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { ConversationComponent } from '../conversation/conversation.component'

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
		])
	],
	host: {
		'[@slideLeft]': '',
		'[@slideTop]': '',
	}
})

export class ChatComponent implements OnInit {
	id: string;
	users = [];
	isConnected: boolean;
	userStream;

	constructor(private chatService: ChatService) { }
	onConnect(id, users, connectedUsers) {
		this.id = id
		this.isConnected = true
		this.users = users.map(user => {
			return {
				username: user.username,
				id: user.id,
				isActive: connectedUsers.includes(user.id)
			}
		}).filter(user => user.id !== this.id)
		this.userStream = this.chatService.monitorUsers().subscribe(data => {
			this.users.forEach(user => {
				if(user.id === data['id']) {
					if(data['connected']) {
						user.isActive = true
					}
					else { 
						user.isActive = false
					}
				}
			})
		})
	}

	ngOnInit() {
		this.isConnected = false
		this.chatService.connect(this.onConnect.bind(this))
	}
}
