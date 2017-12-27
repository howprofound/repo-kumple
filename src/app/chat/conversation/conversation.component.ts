import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ChatService } from '../../chat.service'
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'conversation',
	templateUrl: './conversation.component.html',
	styleUrls: ['./conversation.component.scss']
})

export class ConversationComponent implements OnInit, OnChanges {
	@Input() id: string;
	@Input() convPartner;
	@Input() username: string;
	messages = [];
	messagesToDisplay = [];
	messageStream;
	isInitialized: boolean = false;
	isLoading: boolean;
	constructor(private chatService: ChatService) { }

	getHistory() {
		this.isLoading = true;
		this.chatService.getHistory(this.convPartner._id).subscribe(history => {
			this.messages = history['messages'].sort((a,b) => {
				a = new Date(a.date)
    			b = new Date(b.date)
    			return a < b ? -1 : a > b ? 1 : 0
			})
			this.chatService.sendSeenMessage(this.convPartner._id, this.id)
			this.isLoading = false;
		})
	}


	ngOnInit() {
		this.getHistory()
		this.messageStream = this.chatService.messageAnnounced.subscribe(message => {
			this.messages.push(message)
			this.chatService.sendSeenMessage(this.convPartner._id, this.id)
		})
		this.chatService.getMessageSeen().subscribe(id => {
			if(id === this.convPartner._id) {
				this.messages.forEach(message => {
					message.wasSeen = true
				}) 
			}
		})
		this.isInitialized = true
	}

 	ngOnChanges() {
 		this.messages = []
 		this.messagesToDisplay = []
 		if(this.isInitialized) {
	 		this.getHistory()
		}
		
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

	onSendMessage(message) {
		this.chatService.sendMessage(message, this.convPartner._id, this.getMessageAck.bind(this))
		this.messages.push({
			content: message,
			wasDelivered: false,
			author: {
				_id: this.id,
				username: this.username
			},
			recipient: this.convPartner._id,
			wasSeen: false,
			date: Date.now()
		})
	}
	ngOnDestroy() {
		this.messageStream.unsubscribe()
	}
}
