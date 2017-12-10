import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { 
  MatCardModule, 
  MatListModule, 
  MatIconModule, 
  MatInputModule, 
  MatButtonModule, 
  MatProgressSpinnerModule, 
  MatSnackBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatChipsModule,
  MatDialogModule
} from '@angular/material';

import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';
import { AuthGuardService } from '../auth-guard.service';
import { NewGroupComponent } from './new-group/new-group.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ChatComponent } from './chat.component'
import { GroupConversationComponent } from './group-conversation/group-conversation.component';
import { ChatSidenavComponent } from './chat-sidenav/chat-sidenav.component';
import { ConversationBodyComponent } from './conversation-body/conversation-body.component';
import { UserResolverService } from '../user-resolver.service'
import { SharedModule } from '../shared/shared.module'
const ROUTES = [
  {
    path: 'chat',
    component: ChatComponent,
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
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatChipsModule,
    MatDialogModule,
    SharedModule
  ],
  entryComponents: [
    NewGroupComponent
  ],
  declarations: [    
    ChatComponent,
    ConversationComponent,
    NewGroupComponent,
    GroupConversationComponent,
    ChatSidenavComponent,
    ConversationBodyComponent
  ],
  providers: [
    ChatService,
    AuthService,
    AuthGuardService,
    UserResolverService
  ],
  
})
export class ChatModule { }
