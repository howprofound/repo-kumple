import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
	constructor(private auth: AuthService, private router: Router, public snackBar: MatSnackBar) { 
	}

	ngOnInit() {
	}

  	openSnackBar(message: string) {
	    this.snackBar.open(message, "OK", {
	      duration: 3000,
	    })
  	}

	onSubmit(form) {
		this.auth.register(form.value).subscribe(data => {
			switch(data['status']) {
				case "user_found":
					this.openSnackBar("Username taken :(")
					break;
				case "mail_found":
					this.openSnackBar("E-mail address already in use :(")
					break;
				case "success":
					this.router.navigate([''])
					break;
				default: 
					this.openSnackBar("Oops. Something went wrong :/")
					break;
			}
		})
	}
}
