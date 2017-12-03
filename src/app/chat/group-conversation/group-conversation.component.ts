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
  messages: Array<any> = [];
  messagesToDisplay: Array<any> = [];
  messageStream;
  isLoading: boolean;

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
    this.isLoading = true
    this.chatService.getGroupHistory(this.group._id).subscribe(history => {
      this.messages = history['messages'].sort((a,b) => {
				a = new Date(a.date)
    			b = new Date(b.date)
    			return a < b ? -1 : a > b ? 1 : 0
      })
      this.groupMessagesToDisplay()
      this.chatService.sendSeenGroupMessage(this.group._id)
      this.isLoading = false
    })
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
    this.chatService.sendGroupMessage(message, this.group._id, this.getMessageAck.bind(this))
    this.messages.push({
      content: message,
			wasDelivered: false,
			author: {
				_id: this.id,
				username: this.username
			},
      wasSeenBy: [this.id],
      groupId: this.group._id,
			date: Date.now()
    })
    this.addNewMessageToDisplay(this.messages[this.messages.length - 1])
  }
  ngOnInit() {
    this.getHistory()
    this.messageStream = this.chatService.messageAnnounced.subscribe(message => {
      this.messages.push(message)
      this.addNewMessageToDisplay(message)
      this.chatService.sendSeenGroupMessage(this.group._id)
    })
    this.chatService.getGroupMessageSeen().subscribe(data => {
      if(this.group._id === data['groupId']) {
        this.messages.forEach(message => {
          if(!message.wasSeenBy.includes(data['userId'])) {
            message.wasSeenBy.push(data['userId'])
          }
        }) 
      }
		})
  }
}
