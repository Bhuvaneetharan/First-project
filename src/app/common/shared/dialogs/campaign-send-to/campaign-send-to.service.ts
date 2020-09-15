import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CampaignSendToService {

  constructor(private http: HttpClient) { }
  
  topProduct(pageNo){
    return this.http.get(environment.apiUrl+'campaigns/top_selling_product?page='+pageNo).pipe(share());
  }

  geo_graph(days){
    return this.http.get(environment.apiUrl + 'users/geo_graph?days='+days).pipe(share());
  }

//  topProduct(sendCustomer,campaignId){
//    return this.http.get(environment.apiUrl+'campaigns/promotion_type?promotion_type='+sendCustomer+'&&id='+campaignId).pipe(share());
//  }
 sendAsins(asin,campaignId){
   return this.http.patch(environment.apiUrl+'campaigns/promotion_push',{'item':asin, 'id':campaignId}).pipe(share());
 }
//  repeatedCustomers(page){
//   return this.http.get(environment.apiUrl+'campaigns/repeat_customer?page='+page).pipe(share());
// }

repeatedCustomers(page){
  return this.http.get(environment.apiUrl+'campaigns/repeat_customer?page='+page).pipe(share());
}
repeatedCustSelected(id,data){
  return this.http.patch(environment.apiUrl+'campaigns/promotion_push',{'id':id, 'item':data}).pipe(share());
  
}
repeatedCust(id,data){
  return this.http.delete(environment.apiUrl+'campaigns/promotion_pop?id='+id+'&&item='+data).pipe(share());

}
enableAll(id){
  return this.http.patch(environment.apiUrl+'campaigns/promotion_enable_all',{'id':id}).pipe(share());

}
disableAll(id){
  return this.http.delete(environment.apiUrl+'campaigns/promotion_disable_all?id='+id).pipe(share());
}
}
