import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { CalendarService } from './calendar.service'
import { MatDialog } from '@angular/material'
import { NewEventComponent } from "./new-event/new-event.component"
import { EventDetailsComponent } from "./event-details/event-details.component"
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarAppComponent implements OnInit{
  user
  date: Date;
  calendarView: string = "month"
  calendarOptions: Options
  events: Array<any> = []
  users: Array<any> = []
  isLoading: boolean = true;
  newChatMessage: boolean = false;
  @ViewChild(CalendarComponent) calendar: CalendarComponent;
  constructor(private calendarService: CalendarService, public dialog: MatDialog, 
    private route: ActivatedRoute, private chatService: ChatService) { }

  ngOnInit() { 
    this.route.data.subscribe((data: { user: any }) => {
      this.user = data.user
    })
    this.date = new Date()
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      height: 'parent',
      events: [],
      defaultView: "agendaWeek",
      header: {
        left: 'title',
        center: '',
        right: 'agendaDay,agendaWeek,month,listMonth'
      },
      eventColor: '#3f51b5',
      scrollTime: '08:00',
    }
    this.isLoading = true;
    this.calendarService.getCalendarData().subscribe(data => {
      if(data['status'] === "success") {
        this.events = data['events']
        this.users = data['users']
        this.events.forEach(event => this.addEventToCalendar(event))
        this.isLoading = false;
      }
    })
    this.chatService.connect()
    this.chatService.joinCalendar()
    this.chatService.getMessages().subscribe(message => {
      this.newChatMessage = true;
    })
    this.chatService.getNewEvents().subscribe(event => {
      this.events.push(event)
      this.addEventToCalendar(event)
      this.renderEvent()
    })
  }
  addEventToCalendar(event) {
    this.calendarOptions.events.push({
      id: event._id,
      title: event.title,
      start: new Date(event.beginTime),
      end: new Date(event.endTime)
    })
  }
  onCalendarEventClick(event) {
    let tmpEvent = this.events.find(dataEvent => dataEvent._id === event.id)
    if(tmpEvent) {
      this.onEventClick(tmpEvent)
    }
  }

  onEventClick(event) {
    let dialogRef = this.dialog.open(EventDetailsComponent, {
      data: {
        event: event
      },
      width: '600px'
    })
  }

  renderEvent() {
    this.calendar.fullCalendar('renderEvent', this.calendarOptions.events[this.calendarOptions.events.length-1])
  }

  onDateSelect(event) {
    this.date = new Date(event.value)
    this.calendar.fullCalendar('gotoDate', this.date)
  }

  onNewEventClick() {
		let dialogRef = this.dialog.open(NewEventComponent, {
			data: {
				users: this.users,
			},
      width: '600px'
    })
    dialogRef.afterClosed().subscribe(data => {
			if(data) {
				let newEvent = {
					title: data.title,
          place: data.place,
          description:  data.description,
          beginTime: new Date(data.startDate),
          endTime: new Date(data.endDate),
          users: data.selectedUsers
        }
        newEvent.users.push(this.user._id)

				this.calendarService.createEvent(newEvent).subscribe(res => {
          if(res['status'] === "success") {
            this.events.push(res['event'])
            this.addEventToCalendar(res['event'])
            this.renderEvent()
          }
        })
			}
		})
	}
}
