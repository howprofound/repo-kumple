import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { CalendarService } from './calendar.service'
import { MatDialog } from '@angular/material'
import { NewEventComponent } from "./new-event/new-event.component"

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarAppComponent implements OnInit {
  date: Date;
  calendarView: string = "month"
  calendarOptions: Options;
  @ViewChild(CalendarComponent) calendar: CalendarComponent;
  constructor(private calendarService: CalendarService, public dialog: MatDialog) { }

  ngOnInit() { 
    this.date = new Date()
    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      height: 'parent',
      events: [],
      defaultView: "agendaDay",
      header: {
        left: '',
        center: 'title',
        right: ''
      }
    }
  }

  onDateSelect(event) {
    this.date = new Date(event.value)
    this.calendar.fullCalendar('gotoDate', this.date)
  }

  onNewEventClick() {
		let dialogRef = this.dialog.open(NewEventComponent, {
			data: {
				users: [],
				title: "",
			},
      width: '600px'
		})
	}

}
