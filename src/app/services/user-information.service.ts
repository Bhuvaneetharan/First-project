import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { share, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  
  constructor(private http: HttpClient) {}
  
  // USER STATUS
  userStatus(){
    return this.http.get(environment.apiUrl + 'users/user_status').pipe(map(userauth => {
      // login successful if there's a jwt token in the response
      if (userauth) {
        let auth = { "marketpalce": userauth["status_seller"], "cus_status": userauth["status_subscription"], "cus_reg": userauth["status_address"] };
        localStorage.setItem("authentication", JSON.stringify(auth));
      }
      return userauth;
    }));
  }
  
  // Login Component
  userRegister(userReg){
    return this.http.post(environment.apiUrl + 'users/register', userReg).pipe(share());
  }

  // Login Component 
  email_uniq(email){
    return this.http.post(environment.apiUrl + 'users/uniq_email',{email: email}).pipe(share());
  }

  // Login Component
  phone_uniq(phone){
    return this.http.post(environment.apiUrl + 'users/uniq_phone',{phone: phone}).pipe(share());
  }
  
  // Forgot Password Component
  forgotPassword(email){
    return this.http.patch(environment.apiUrl + 'users/forgot_password',{email: email}).pipe(share());
  }

  //DeleteTemplate
  deleteTemplate(tempid){
    return this.http.delete(environment.apiUrl+'templates/delete_template?id='+tempid).pipe(share());
  }
  
  //DeleteCampaign
  campDelete(campaignId, dont_delete){
    return this.http.delete(environment.apiUrl+'campaigns/camp_delete?id='+campaignId+'&&dont_delete='+dont_delete).pipe(share());
  }
   //DeleteCampaignTemplate
   campDeleteTemplete(campaignId, tempid){
    return this.http.get(environment.apiUrl+'campaigns/template_pop?id='+campaignId+'&&template_id='+tempid).pipe(share());
  }

  // CK Editor Tag Component
  negativeFeedbackMail(negativemail){
    return this.http.post(environment.apiUrl+'emails/send_negative_feedback',negativemail).pipe(share());
  }

  // Common API's
  upgradeplan(){
    return this.http.get(environment.apiUrl + 'plans/upgrade_plan').pipe(share());
  }

  daysLeft(){
    return this.http.get(environment.apiUrl + 'users/renew_days').pipe(share());
  }
}

