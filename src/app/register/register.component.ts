import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
	form: FormGroup;
	file;

	constructor(private auth: AuthService, private router: Router, public snackBar: MatSnackBar, private fb: FormBuilder) { 
		this.createForm()
	}

	createForm() {
		this.form = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			email: ['', Validators.required],
			firstName: '',
			lastName: '',
			bio: '',
			avatar: null
		})
	}
	ngOnInit() {
	}

  	openSnackBar(message: string) {
	    this.snackBar.open(message, "OK", {
	      duration: 3000,
	    })
  	}

  	onFileChange(e) {
  		if(e.target.files.length > 0) {
			let file = e.target.files[0]
			this.form.get('avatar').setValue(file);
	    }
  	}

  	prepareFormData() {
  		console.log(this.form.value)
		let formData = new FormData()
		formData.append('password', this.form.get('password').value)
		formData.append('email', this.form.get('email').value)
		formData.append('username', this.form.get('username').value)
		formData.append('avatar', this.form.get('avatar').value)
		return formData
  	}
	onSubmit() {
		let formData = this.prepareFormData()
		this.auth.register(formData).subscribe(data => {
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
