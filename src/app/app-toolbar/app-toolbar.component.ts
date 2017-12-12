import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss']
})

export class AppToolbarComponent {
  @Input () text: string;
  @Input () user;
  @Input () newChatMessage: boolean;
  @Input () newCalendarEvent: boolean;
  constructor(private authService: AuthService,  private router: Router) { }

  onLogoutClick() {
    this.authService.logout()
    this.router.navigate(['/'])
  }
}
