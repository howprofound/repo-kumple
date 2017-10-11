import { Injectable } from '@angular/core'
import { HttpClient} from '@angular/common/http'
import 'rxjs/add/operator/map';
import { Response } from '@angular/http'
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

	constructor(private http: HttpClient) {}

	login(credentials) {
		return this.http.post('/api/login', credentials)
	}
	loggedIn() {
  		return tokenNotExpired()
	}
}