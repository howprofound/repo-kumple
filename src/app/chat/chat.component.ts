import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
	messages = [];
	connection;
	message: string;

	constructor(private chatService: ChatService) { }

	sendMessage(e) {
		if(e.keyCode === 13) {
			this.chatService.sendMessage(this.message)
			this.message = ''
		}
	}

	ngOnInit() {
		this.chatService.connect()
		this.connection = this.chatService.getMessages().subscribe((message: any) => {
			if(message.type === 'clear') {
				this.messages = []
			}
			else {
				this.messages.push(message)
			}
		})
	}

	ngOnDestroy() {
		this.connection.unsubscribe()
	}

}
