import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


import { 
        MatCardModule, 
        MatListModule, 
        MatIconModule, 
        MatInputModule, 
        MatButtonModule, 
        MatProgressSpinnerModule, 
        MatSnackBarModule,
        MatSidenavModule,
        MatToolbarModule
      } from '@angular/material';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuardService } from './auth-guard.service';
import { ConversationComponent } from './conversation/conversation.component';

const ROUTES = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'chat',
    component: ChatComponent,
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ConversationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [
    ChatService,
    AuthService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
