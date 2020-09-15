import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentWithRegistrationService {

  constructor(private http: HttpClient) { }

  pincode(pincode){
    return this.http.post(environment.apiUrl+'users/pincode', pincode).pipe(share());
  }
  
  register(completeDatas: object){
    return this.http.patch(environment.apiUrl+'users/complete_registration',completeDatas).pipe(share());
  }

  userInfo(){
    return this.http.get(environment.apiUrl+'plans/payment').pipe(share());
  }

  paymentId(paymentid: object){
    return this.http.post(environment.apiUrl+'plans/razorpay',paymentid).pipe(share());
  }
  
  plans(){
    return this.http.get(environment.apiUrl+'plans/plan_details').pipe(share());
  }
}
