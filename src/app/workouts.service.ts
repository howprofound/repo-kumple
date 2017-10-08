import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WorkoutsService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getAllWorkouts() {
    return this.http.get('/workouts')
      .map(res => res.json());
  }
}