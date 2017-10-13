import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'
import { JwtHelper } from 'angular2-jwt'

@Injectable()
export class ChatService {
  private socket;
  jwtHelper: JwtHelper;
  token: string;

  constructor() {
    this.jwtHelper = new JwtHelper()
    this.token = localStorage.getItem('token')
  }
  sendMessage(message, id) {
    this.socket.emit('add-message', { content: message, author: id})    
  }

  deleteMessages() {
  	this.socket.emit('clear')
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
      this.socket.emit('hello', id, (users, connectedUsers) => {
        callback(id, users, connectedUsers)
      })
    })
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }
    })     
    return observable
  }  
}