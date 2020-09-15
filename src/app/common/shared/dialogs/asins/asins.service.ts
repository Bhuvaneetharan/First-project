import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';

import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsinsService {

  constructor(private http: HttpClient) { }

  product(pageNo, searchValue, chennal){
    return this.http.get(environment.apiUrl+'inventories/products?page='+pageNo+'&&keyword='+searchValue+'&&chennal='+chennal).pipe(share());
  }

  confirmAsins(data){
    return this.http.post(environment.apiUrl+'campaigns/new_promotion_template',{asin:data}).pipe(share());
  }

  campcount(campId, status, searchvalue){
    return this.http.get(environment.apiUrl+'campaigns/camp_purpose1?id='+campId+'&&status='+status+'&&keyword='+searchvalue).pipe(share());
  }

  push(checkedvalue,campId){
    return this.http.get(environment.apiUrl+'campaigns/push?data='+checkedvalue+'&&id='+campId).pipe(share());
  }

  pop(checkedvalue,campId){
    return this.http.get(environment.apiUrl+'campaigns/pop?data='+checkedvalue+'&&id='+campId).pipe(share());
  }

  enableAll(campId, status, searchValue){
    return this.http.get(environment.apiUrl+'campaigns/enable_all?id='+campId+'&&status='+status+'&&keyword='+searchValue).pipe(share());
  }

  disableAll(campId, status,searchValue){
    return this.http.get(environment.apiUrl+'campaigns/disable_all?id='+campId+'&&status='+status+'&&keyword='+searchValue).pipe(share());
  }

  productsCount(){
    return this.http.get(environment.apiUrl+'users/product_count').pipe(share());
  }

  orderCount(data){
    return this.http.post(environment.apiUrl+'users/order_count',data).pipe(share());
  }
}
