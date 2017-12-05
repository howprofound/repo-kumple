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
import { 
  MatSidenavModule,
  MatToolbarModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatDatepickerModule
} from '@angular/material';
import { NewEventComponent } from './new-event/new-event.component';


const ROUTES = [
  {
    path: 'calendar',
    component: CalendarAppComponent,
    pathMach: "full",
    canActivate: [AuthGuardService]
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
    MatDatepickerModule
  ],
  entryComponents: [
    NewEventComponent
  ],
  declarations: [
    CalendarAppComponent,
    NewEventComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    CalendarService
  ],
  
})
export class CalendarAppModule { }
