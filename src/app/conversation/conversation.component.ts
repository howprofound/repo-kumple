import { Component, OnInit, Input } from '@angular/core'
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
export class ConversationComponent implements OnInit {
	@Input() id: string;
	@Input() conversationId: string;
	@Input() title: string;
	message: string;
	messages = [];
	messageStream;
	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.messageStream = this.chatService.getMessages().subscribe(message => {
			this.messages.push(message)
		})
		this.chatService.getHistory(this.id).subscribe(history => {
			this.messages = history
		})
	}

	sendMessage(e) {
		if(e.keyCode === 13) {
			this.chatService.sendMessage(this.message, this.conversationId)
			this.message = ''
		}
	}
	ngOnDestroy() {
		this.messageStream.unsubscribe()
	}


}
