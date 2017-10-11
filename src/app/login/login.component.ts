import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, public snackBar: MatSnackBar) { }
  	isLoggingIn: boolean = false;

  	openSnackBar(message: string) {
	    this.snackBar.open(message, "OK", {
	      duration: 3000,
	    })
  	}

	ngOnInit() {	
	}

	onSubmit(value) {
		this.isLoggingIn = true
		this.auth.login(value).subscribe(data => {
			if(data['success']) {
				localStorage.setItem('token', data['token'])
				this.router.navigate(['/chat'])
			}
			else {
				this.openSnackBar(data['message'])
			}
			this.isLoggingIn = false
		})
	}

}
