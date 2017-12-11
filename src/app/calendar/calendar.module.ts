import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';
import { CalendarAppComponent } from './calendar.component'
import { DateTimePickerModule } from 'ng-pick-datetime'
import { FullCalendarModule } from 'ng-fullcalendar'
import { CalendarService } from './calendar.service'
import { ChatService } from '../chat.service'
import { 
  MatSidenavModule,
  MatToolbarModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatListModule
} from '@angular/material';
import { NewEventComponent } from './new-event/new-event.component';
import { UserResolverService } from '../user-resolver.service'
import { SharedModule } from '../shared/shared.module';
import { EventDetailsComponent } from './event-details/event-details.component'
const ROUTES = [
  {
    path: 'calendar',
    component: CalendarAppComponent,
    pathMach: "full",
    canActivate: [AuthGuardService],
    resolve: {
      user: UserResolverService
    }
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule.forChild(ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    DateTimePickerModule,
    FullCalendarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    SharedModule
  ],
  entryComponents: [
    NewEventComponent,
    EventDetailsComponent
  ],
  declarations: [
    CalendarAppComponent,
    NewEventComponent,
    EventDetailsComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    CalendarService,
    UserResolverService,
    ChatService
  ],
  
})
export class CalendarAppModule { }
