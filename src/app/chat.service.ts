import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'
import { JwtHelper } from 'angular2-jwt'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Subject }    from 'rxjs/Subject'

@Injectable()
export class ChatService {
  private socket;
  private jwtHelper: JwtHelper;
  private token: string;
  private messageSource : Subject<string>;
  messageAnnounced;
  constructor(private http: HttpClient) {
    this.messageSource = new Subject<string>()
    this.messageAnnounced = this.messageSource.asObservable()
    this.jwtHelper = new JwtHelper()
    this.token = localStorage.getItem('token')
  }

  sendMessage(message, recipient, ack) {
    this.socket.emit('new_message', {
      content: message,
      author: this.jwtHelper.decodeToken(this.token).id,
      recipient: recipient
    }, ack)
  }

  sendGroupMessage(message, groupId, ack) {
    this.socket.emit('new_group_message', {
      content: message,
      author: this.jwtHelper.decodeToken(this.token).id,
      groupId: groupId
    }, ack)
  }

  sendNewGroupMessage(data, ack) {
    this.socket.emit('group_conversation_create', data, ack)
  }

  getNewGroupMessages() {
    let observable = new Observable(observer => {
      this.socket.on('group_conversation_create', group => {
        observer.next(group)
      })
    })
    return observable
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('new_message', data => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
    return observable
  }

  getGroupMessages() {
    let observable = new Observable(observer => {
      this.socket.on('new_group_message', data => {
        observer.next(data)
      })
    })
    return observable;
  }


  sendSeenMessage(author, recipient) {
    this.socket.emit('message_seen', { recipient: recipient, author: author })
  }

  sendSeenGroupMessage(groupId) {
    this.socket.emit('group_message_seen', {
      groupId: groupId,
      userId: this.jwtHelper.decodeToken(this.token).id
    })
  }

  getMessageSeen() {
    let observable = new Observable(observer => {
      this.socket.on('message_seen', data => {
        observer.next(data)
      })
    })
    return observable
  }

  getGroupMessageSeen() {
    let observable = new Observable(observer => {
      this.socket.on('group_message_seen', data => {
        observer.next(data)
      })
    })
    return observable
  }

  getHistory(partnerId) {
    return this.http.get<any[]>(`/api/conversation/history/${partnerId}`, {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
  }

  getGroupHistory(groupId) {
    return this.http.get<any[]>(`/api/conversation/group_history/${groupId}`, {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
  }

  announceMessage(message) {
    this.messageSource.next(message)
  }

  monitorUsers() {
    let observable = new Observable(observer => {
      this.socket.on('user_change', data => {
        observer.next(data)
      })
    })
    return observable
  }

  getActiveUsers() {
    let observable = new Observable(observer => {
      this.socket.on('connected_users', users => {
        observer.next(users)
      })
    })
    return observable
  }

  connect() {
    if(!this.socket || !this.socket.connected) {
      this.socket = io.connect('', {
        query: 'token=' + this.token
      })
    }
  }

  joinChat(groups) {
    this.socket.emit('join_chat', {
      id: this.jwtHelper.decodeToken(this.token).id,
      groups: groups
    })
  }

  joinCalendar() { 
    this.socket.emit('join_calendar', this.jwtHelper.decodeToken(this.token).id)
  }

  getChatData() {
    console.log(this.token)
    return this.http.get('/api/chat', {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
  }
}
