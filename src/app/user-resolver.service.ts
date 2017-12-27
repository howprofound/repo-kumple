import { Injectable } from '@angular/core';
import { Router, Resolve,  ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserResolverService {
  constructor(private us: UserService, private router: Router) {}
  
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
  
     return this.us.getUser().map((data: {status: string, user: any }) => {
       console.log(data)
       if (data.status === "success") {
         return data.user;
       } else {
         this.router.navigate(['/']);
         return null;
       }
     });
   }
}
