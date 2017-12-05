import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChatModule } from './chat/chat.module'
import { CalendarAppModule } from './calendar/calendar.module'

import { 
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
      } from '@angular/material';

import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from './user.service';
import { UserResolverService } from './user-resolver.service';

const ROUTES = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService],
    resolve: {
      user: UserResolverService
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ChatModule,
    CalendarAppModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    UserService,
    UserResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
