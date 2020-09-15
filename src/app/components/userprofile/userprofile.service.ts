import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// URL
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  constructor(private http: HttpClient) { }

  userProfile(){
    return this.http.get(environment.apiUrl + 'users/user_profile').pipe(share());
  }

  updateProfile(updatedProfile: object){
    return this.http.patch(environment.apiUrl + 'users/update_profile', updatedProfile).pipe(share());
  }

  changePassword(passwords:object){
    return this.http.patch(environment.apiUrl + 'users/confirm_password', passwords).pipe(share());
  }

  oldpassword(passwords:string){
    return this.http.get(environment.apiUrl + 'users/change_password?old_password='+passwords).pipe(share());
  }
  pincode(pincode){
    return this.http.post(environment.apiUrl+'users/pincode', pincode).pipe(share());
  }
}
   