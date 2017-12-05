import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  title: string = ""
  place: string = ""
  users: Array<any>
  startDate: Date;
  endDate: Date;
  ngOnInit() {
    console.log(this.data)
  }

}
