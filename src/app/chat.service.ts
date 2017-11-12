import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'
import { JwtHelper } from 'angular2-jwt'
import { HttpClient} from '@angular/common/http'
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
    this.messageAnnounced = this. messageSource.asObservable()
    this.jwtHelper = new JwtHelper()
    this.token = localStorage.getItem('token')
  }

  sendMessage(message, convId) {
    this.socket.emit('new-message', { 
      content: message, 
      author: this.jwtHelper.decodeToken(this.token).id, 
      conversation: convId
    })    
  }

  getHistory(id) {
    return this.http.post<any[]>('/api/conversation/history', {
      token: this.token,
      id: id
    })
  }

  announceMessage(message) {
    this.messageSource.next(message)
  }

  monitorUsers() {
    let observable = new Observable(observer => {
      this.socket.on('user-change', data => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })
    return observable
  }

  connect(callback) {
  	this.socket = io.connect('', {
      query: 'token=' + this.token
    })
    this.socket.on('connect', () => {
      let id = this.jwtHelper.decodeToken(this.token).id
      this.socket.emit('hello', id, users => {
        console.log(users)
        callback(id, users)
      })
    })
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('new-message', data => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })     
    return observable
  }  
}