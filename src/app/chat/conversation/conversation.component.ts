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
	constructor(private chatService: ChatService) { }

	getHistory() {
		this.chatService.getHistory(this.convPartner._id).subscribe(history => {
			this.messages = history['messages'].sort((a,b) => {
				a = new Date(a.date)
    			b = new Date(b.date)
    			return a < b ? -1 : a > b ? 1 : 0
			})
			this.groupMessagesToDisplay()
			this.chatService.sendSeenMessage(this.convPartner._id, this.id)
		})
	}

	groupMessagesToDisplay() {
		this.messagesToDisplay = []
		this.messages.forEach(message => {
			message.date = new Date(message.date)
			this.addNewMessageToDisplay(message)
		})
	}

	addNewMessageToDisplay(message) {
		if(this.messagesToDisplay.length === 0 || this.messagesToDisplay[this.messagesToDisplay.length - 1][0].author._id !== message.author._id) {
			this.messagesToDisplay.push([message])
		}
		else {
			this.messagesToDisplay[this.messagesToDisplay.length - 1].push(message)
		}
	}

	ngOnInit() {
		this.getHistory()
		this.messageStream = this.chatService.messageAnnounced.subscribe(message => {
			this.messages.push(message)
			this.addNewMessageToDisplay(message)
			this.chatService.sendSeenMessage(this.convPartner._id, this.id)
		})
		this.chatService.getMessageSeen().subscribe(id => {
			this.messages.forEach(message => {
				message.wasSeen = true
			}) 
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
		this.addNewMessageToDisplay(this.messages[this.messages.length - 1])
	}
	ngOnDestroy() {
		this.messageStream.unsubscribe()
	}
}
