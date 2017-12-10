import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'conversation-body',
  templateUrl: './conversation-body.component.html',
  styleUrls: ['./conversation-body.component.scss']
})
export class ConversationBodyComponent implements  AfterViewChecked {

  @ViewChild('conversationBody') private conversationBody: ElementRef;
  message: string;
  @Input() messages: Array<any>;
  @Input() id: String;
  @Output() onSendMessage = new EventEmitter<any>()
  constructor() { }

  scrollToBottom(): void {
    try {
        this.conversationBody.nativeElement.scrollTop = this.conversationBody.nativeElement.scrollHeight;
    } catch(err) { 
    }                 
  }

  getMessageStatus(message) {
		if(message.wasSeen) {
			return "Seen"
    }
    else if(message.wasSeenBy && message.wasSeenBy.length > 1) {
      let status = "Seen by " + (message.wasSeenBy.length - 1)
      if(message.wasSeenBy.length === 2) {
        return status + " person"
      }
      else {
        return status + " people"
      }
    }
		else if(message.wasDelivered) {
			return "Delivered"
		}
		else {
			return "Sending..."
		}
	}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  formatMessages(messages) {
    let messagesToDisplay = []
    messages.forEach(message => {
      message.date = new Date(message.date)
      if(messagesToDisplay.length === 0 || messagesToDisplay[messagesToDisplay.length - 1][0].author._id !== message.author._id) {
        messagesToDisplay.push([message])
      }
      else {
        messagesToDisplay[messagesToDisplay.length - 1].push(message)
      }
    })
    return messagesToDisplay
  }
  
  sendMessage(e) {
		if(e.keyCode === 13) {
			this.onSendMessage.emit(this.message)
			this.message = ''
		}
	}

}
