import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// URL
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private http: HttpClient) { }

  // Order History API's
  order(data){
    return this.http.post(environment.apiUrl + 'inventories/orders',data).pipe(share());
  }
  
  orderExpand(orderId){
    return this.http.get(environment.apiUrl + 'inventories/order_expand?id='+orderId).pipe(share());
  }

  dateFilter(channel,status, location, saleschannel){
    return this.http.post(environment.apiUrl + 'inventories/order_filter',{'channel':channel, 'status':status, 'location': location, 'sales_channel': saleschannel}).pipe(share());
  }
  orderCount(data){
    return this.http.post(environment.apiUrl+'users/order_count',data).pipe(share());
  }

  upgradeplan(){
    return this.http.get(environment.apiUrl + 'plans/upgrade_plan').pipe(share());
  }

  order_report(data){
    return this.http.post(environment.apiUrl + 'inventories/orders_report',data).pipe(share());
  }

  order_sync(){
    return this.http.get(environment.apiUrl + 'inventories/order_quick_sync').pipe(share());
  }

  // Repeated Customers API's
  repeatedCustomers(page){
    return this.http.get(environment.apiUrl+'campaigns/repeat_customer?page='+page).pipe(share());
  }
  repeatExpand(email){
    return this.http.get(environment.apiUrl+'campaigns/repeat_expand?email='+email).pipe(share());
  }
}

