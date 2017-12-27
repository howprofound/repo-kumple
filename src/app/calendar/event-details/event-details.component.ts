import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'
import { CalendarService } from '../calendar.service'
@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private calendarService: CalendarService) { }

  onChangeGoing(e) {
    this.calendarService.changeGoingToEvent(this.data.event._id, e.checked).subscribe(data => {
      if(data['status'] === "success") {
        if(e.checked) {
          this.data.event.going.push(this.data.id)
          this.data.going = true
        }
        else {
          let index = this.data.event.going.indexOf(this.data.id)
          console.log(this.data.event.going, this.data.id)
          if (index !== -1) {
            this.data.event.going.splice(index, 1)
          }
          this.data.going = false
        }
      }
    })
  }
}
