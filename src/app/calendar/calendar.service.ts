import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
@Injectable()
export class CalendarService {
  private token: string;

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token')
  }

  getCalendarData() {
    return this.http.get('/api/calendar', {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
  }

  createEvent(event) {
    return this.http.post('/api/calendar/event', event, {
      headers: new HttpHeaders().set('Authorization', this.token)
    })
  }
  changeGoingToEvent(eventId, going) {
    console.log(eventId)
    return this.http.put('api/calendar/event/modify-going', {
      eventId: eventId,
      going: going
    }, { headers: new HttpHeaders().set('Authorization', this.token) })
  }
}
