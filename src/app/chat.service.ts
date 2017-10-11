import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket;
  
  sendMessage(message, id = 1) {
    this.socket.emit('add-message', { content: message, author: id})    
  }

  deleteMessages() {
  	this.socket.emit('clear')
  }
  connect() {
  	this.socket = io()
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data)
      })
      return () => {
        this.socket.disconnect()
      }; 
    })     
    return observable
  }  
}