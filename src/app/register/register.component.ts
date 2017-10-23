import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
	constructor(private auth: AuthService, private router: Router) { 
	}

	ngOnInit() {
	}

	onSubmit(form) {
		this.auth.register(form.value).subscribe(data => {
			if(data['status'] === "error") {
				//TODO
			}
			else {
				localStorage.setItem('token', data['token'])
				this.router.navigate(['/chat'])
			}
		})
	}

}
