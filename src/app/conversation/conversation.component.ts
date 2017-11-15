import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, AfterViewChecked } from '@angular/core'
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

export class ConversationComponent implements OnInit, OnChanges, AfterViewChecked {
	@Input() id: string;
	@Input() addresse: string;
	@Input() title: string;
	@ViewChild('conversationBody') private conversationBody: ElementRef;
	conversationId: string;
	message: string;
	messages = [];
	messagesToDisplay = [];
	messageStream;
	isInitialized: boolean = false;
	constructor(private chatService: ChatService) { }

	getHistory() {
		this.chatService.getHistory(this.addresse).subscribe(history => {
			this.messages = history['messages'].sort((a,b) => {
				a = new Date(a.date)
    			b = new Date(b.date)
    			return a < b ? -1 : a > b ? 1 : 0
			})
			this.conversationId = history['conversationId']
			this.groupMessagesToDisplay()
		})
		this.chatService.sendSeenMessage(this.conversationId, this.addresse)
	}

	groupMessagesToDisplay() {
		this.messagesToDisplay = [];
		this.messages.forEach(message => {
			message.date = new Date(message.date)
			this.addNewMessageToDisplay(message)
		})
		console.log(this.messagesToDisplay)
	}

	addNewMessageToDisplay(message) {
		if(this.messagesToDisplay.length === 0 || this.messagesToDisplay[this.messagesToDisplay.length - 1][0].author !== message.author) {
			this.messagesToDisplay.push([message])
		}
		else {
			this.messagesToDisplay[this.messagesToDisplay.length - 1].push(message)
		}
	}

    scrollToBottom(): void {
        try {
            this.conversationBody.nativeElement.scrollTop = this.conversationBody.nativeElement.scrollHeight;
        } catch(err) { 
        }                 
    }

	ngOnInit() {
		this.messageStream = this.chatService.messageAnnounced.subscribe(message => {
			this.messages.push(message)
			this.addNewMessageToDisplay(message)
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
		this.isInitialized = true
	}

 	ngOnChanges() {
 		this.messages = []
 		this.messagesToDisplay = []
 		if(this.isInitialized){
	 		this.getHistory()
 		}
 	}

 	ngAfterViewChecked() {
    	this.scrollToBottom();
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
				wasSeen: false,
				date: Date.now()
			})
			this.message = ''
			this.addNewMessageToDisplay(this.messages[this.messages.length - 1])
		}
	}
	ngOnDestroy() {
		this.messageStream.unsubscribe()
	}


}
