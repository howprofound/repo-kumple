import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'
import { JwtHelper } from 'angular2-jwt'
import { HttpClient} from '@angular/common/http'

@Injectable()
export class ChatService {
  private socket;
  jwtHelper: JwtHelper;
  token: string;

  constructor(private http: HttpClient) {
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

  deleteMessages() {
  	this.socket.emit('clear')
  }

  getHistory(id) {
    return this.http.post<any[]>('/api/conversation/history', {
      token: this.token,
      id: id
    })
  }

  monitorUsers() {
    let observable = new Observable(observer => {
      this.socket.on('user-change', (data) => {
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
      this.socket.on('new-message', (data) => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })     
    return observable
  }  
}