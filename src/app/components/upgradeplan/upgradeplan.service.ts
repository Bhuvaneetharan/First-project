import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// URL
import { environment } from '../../../environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpgradeplanService {

  constructor(private http: HttpClient) { }

  
  upgradeplan(){
    return this.http.get(environment.apiUrl + 'plans/upgrade_plan').pipe(share());
  }

  singlePlan(id:number){
    return this.http.get(environment.apiUrl + 'plans/upgrade_to?id='+id).pipe(share());
  }

  paymentId(paymentid: object){
    return this.http.post(environment.apiUrl+'plans/razorpay',paymentid).pipe(share());
  }
  
  customplans(){
    return this.http.get(environment.apiUrl+'plans/plan_request').pipe(share());
  }

  customplandelete(planid){
    return this.http.delete(environment.apiUrl+'plans/custom_plan_delete?id='+planid).pipe(share());
  }
}
