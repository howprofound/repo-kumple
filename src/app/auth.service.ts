import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
	username: string;
	constructor(private http: HttpClient) {}
	getUsername() {
		return this.http.get('/api/user', { 
      		headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
		})
	}
	login(credentials) {
		return this.http.post('/api/login', credentials)
	}
	register(data) {
		return this.http.post('/api/register', data)
	}
	loggedIn() {
  		return tokenNotExpired()
	}
}