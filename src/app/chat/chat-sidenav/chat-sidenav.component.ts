import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.scss']
})
export class ChatSidenavComponent {
  @Input() users
  @Input() groups
  @Output() onUserClick = new EventEmitter<any>()
  @Output() onGroupClick = new EventEmitter<any>()
  @Output() onNewGroupClick = new EventEmitter()
  constructor() { }

  userClick(user) {
    this.onUserClick.emit(user)
  }
  groupClick(group) {
    this.onGroupClick.emit(group)
  }
  newGroupClick(){
    this.onNewGroupClick.emit()
  }
}
