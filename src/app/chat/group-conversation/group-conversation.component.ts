import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../../chat.service'

@Component({
  selector: 'group-conversation',
  templateUrl: './group-conversation.component.html',
  styleUrls: ['./group-conversation.component.scss']
})
export class GroupConversationComponent implements OnInit {
  @Input() id: String;
  @Input() group;
  @Input() username: string;
  @Input() users: Array<any>;
  messages: Array<any>;
  messagesToDisplay: Array<any>;

  constructor(private chatService: ChatService) { }

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

  getHistory() {
    this.chatService.getGroupHistory(this.group._id).subscribe(history => {
      this.messages = history['messages'].sort((a,b) => {
				a = new Date(a.date)
    			b = new Date(b.date)
    			return a < b ? -1 : a > b ? 1 : 0
      })
    })
  }

  onSendMessage() {

  }
  ngOnInit() {
    this.getHistory()
  }
}
