import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ChatService } from '../chat.service'
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.scss'],
	animations: [
		trigger('newMessage', [
			transition(':enter', [style({opacity: 0}), animate(300)])
		])
	]
})

export class ConversationComponent implements OnInit, OnChanges {
	@Input() id: string;
	@Input() addresse: string;
	@Input() title: string;
	conversationId: string;
	message: string;
	messages = [];
	messageStream;
	constructor(private chatService: ChatService) { }

	getHistory() {
		this.chatService.getHistory(this.addresse).subscribe(history => {
			console.log(history)
			this.messages = history['messages'].sort((a,b) => {
				a = new Date(a.date)
    			b = new Date(b.date)
    			return a < b ? -1 : a > b ? 1 : 0
			})
			this.conversationId = history['conversationId']
			this.chatService.sendSeenMessage(this.conversationId, this.addresse)
		})
	}

	ngOnInit() {
		this.messageStream = this.chatService.messageAnnounced.subscribe(message => {
			this.messages.push(message)
			this.chatService.sendSeenMessage(this.conversationId, this.addresse)
		})
		this.getHistory()
		this.chatService.getMessageSeen().subscribe(id => {
			this.messages = this.messages.map(message => {
				if(!message.wasSeen) {
					return Object.assign(message, { wasSeen: true })
				}
				else {
					return message
				}
			})
		})
	}
 	ngOnChanges() {
 		this.getHistory()
 	}
	getMessageAck(id) {
		this.messages = this.messages.map(message => {
			if(!message._id) {
				return Object.assign(message, { wasDelivered: true, _id: id })
			}
			else {
				return message
			}
		})
	}
	sendMessage(e) {
		if(e.keyCode === 13) {
			this.chatService.sendMessage(this.message, this.addresse, this.conversationId, this.getMessageAck.bind(this))
			this.messages.push({
				content: this.message,
				wasDelivered: false,
				author: this.id,
				wasSeen: false
			})
			this.message = ''
		}
	}
	ngOnDestroy() {
		this.messageStream.unsubscribe()
	}


}
