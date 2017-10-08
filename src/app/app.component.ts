import { Component, OnInit, OnDestroy } from '@angular/core';

import { WorkoutsService } from './workouts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;

  constructor(private workoutsService: WorkoutsService) {}

  sendMessage(){
    this.workoutsService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.workoutsService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
  }
  
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}