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

  sendMessage(message, addresse, conversationId, ack) {
    this.socket.emit('new_message', {
      content: message,
      author: this.jwtHelper.decodeToken(this.token).id,
      addresse: addresse,
      conversationId: conversationId
    }, ack)
  }

  sendSeenMessage(conversationId, author) {
    console.log(conversationId, author)
    this.socket.emit('message_seen', { conversationId: conversationId, author: author })
  }

  getMessageSeen() {
    let observable = new Observable(observer => {
      this.socket.on('message_seen', data => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
    return observable
  }

  getHistory(id) {
    console.log(`/api/conversation/history/${id}`)
    return this.http.get<any[]>(`/api/conversation/history/${id}`, {
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
      return () => {
        this.socket.disconnect()
      }
    })
    return observable
  }

  getActiveUsers() {
    let observable = new Observable(observer => {
      this.socket.on('connected_users', users => {
        observer.next(users)
      })
      return () => {
        console.log("test")
        this.socket.off('connected_users')
      }
    })
    return observable
  }

  connect(groups) {
  	this.socket = io.connect('', {
      query: 'token=' + this.token
    })
    let id = this.jwtHelper.decodeToken(this.token).id
    this.socket.on('connect', () => {
      this.socket.emit('join', {
        id: id,
        groups: groups
      })
    })
    return id
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('new_message', data => {
        console.log(data)
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
    return observable
  }

  getChatData() {
    console.log(this.token)
    return this.http.get('/api/chat', {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
  }
}
