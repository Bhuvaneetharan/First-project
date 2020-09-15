import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS
import { BehaviorSubject, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

// MODELS
import { User } from '../common/models'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, public router:Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(environment.apiUrl+'user_token', {"auth":{ email: username, password: password }})
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user && user.jwt) {
              console.log(user)
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
        }),share());
  }

  preLogin(username: string, password: string){
    return this.http.post(environment.apiUrl+'users/validation', {"auth":{ email: username, password: password }})
  }

  logout() {
    // remove user from local storage to log user out
    this.currentUserSubject.next(null);
  }

}
