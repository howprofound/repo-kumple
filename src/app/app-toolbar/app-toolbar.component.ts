import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss']
})
export class AppToolbarComponent implements OnInit {
  @Input () text: string;
  @Input () user;
  @Input () newChatMessage: boolean;
  @Input () newCalendarEvent: boolean;
  constructor() { }

  ngOnInit() {
  }

}