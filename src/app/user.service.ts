import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable()
export class UserService {
	constructor(private http: HttpClient) {}
	getUser() {
		return this.http.get('/api/user', { 
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
		})
	}
}