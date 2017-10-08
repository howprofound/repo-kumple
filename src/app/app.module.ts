import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { MatSidenavModule, MatToolbarModule, MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { WorkoutsService } from './workouts.service';

const ROUTES = [
  {
    path: '',
    redirectTo: 'workouts',
    pathMatch: 'full'
  },
  {
    path: 'workouts',
    component: WorkoutsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    WorkoutsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [WorkoutsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
