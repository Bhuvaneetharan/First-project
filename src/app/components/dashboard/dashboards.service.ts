import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share, map, filter } from 'rxjs/operators';
import { find } from 'cfb/types';
import { from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DashboardsService {

  constructor(private http: HttpClient) { }

  oderOverview(days, start, end, channel) {
    return this.http.get(environment.apiUrl + 'inventories/order_stats?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel).pipe(share());
  }
  
  geo_graph(days, start, end, channel){
    return this.http.get(environment.apiUrl + 'users/geo_graph?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel).pipe(share());
  }
  product_rating(days, start, end, channel){
    return this.http.get(environment.apiUrl + 'users/product_review_graph?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel).pipe(share());
  }

  repeated_customer(days, start, end, channel){
    return this.http.get(environment.apiUrl + 'users/repeat_customers_dashboard?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel).pipe(share());
  }

  sellingProduct(days, start, end, channel){
    return this.http.get(environment.apiUrl + 'users/top_selling_product_dashboard?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel);
  }

  order_status(days, start, end, channel){
    return this.http.get(environment.apiUrl + 'users/order_status_dashboard?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel).pipe(
      map(res =>{
        if(channel == 'Amazon'){
          if(res['status'].length != 0){
            let datas = {}
          for(let i = 0; i < res['status'].length; i++){
            if(res['status'][i]['name'] == 'Shipped'){
               datas['shipped'] = res['status'][i]['y']
            }
            if(res['status'][i]['name'] == 'Pending'){
              datas['pending'] = res['status'][i]['y']
            }
            if(res['status'][i]['name'] == 'Canceled'){
              datas['cancelled'] = res['status'][i]['y']
            }
          }
          return datas
          }
          else{
            return {'shipped':'0', 'pending':'0', 'cancelled':'0'}
          }
      }else if(channel == 'Flipkart'){
        if(res['status'].length != 0){
          let datas = {}
          // const source = from(res['status']);
          // const example = source.pipe(filter(person => person['name'] == 'DELIVERED'));
          // const subscribe = example.subscribe(val => datas['shipped'] = val['y']);

          for(let i = 0; i < res['status'].length; i++){
            if(res['status'][i]['name'] == 'DELIVERED'){
               datas['shipped'] = res['status'][i]['y']
            }
            if(res['status'][i]['name'] == 'PENDING'){
              datas['pending'] = res['status'][i]['y']
            }
            if(res['status'][i]['name'] == 'CANCELLED'){
              datas['cancelled'] = res['status'][i]['y']
            }
          }
          return datas
        }
        else{
          return   {'shipped':'0', 'pending':'0', 'cancelled':'0'}
        }
      }
      })
    );
  }

  dashboard_card(days, start, end ,channel){
    return this.http.get(environment.apiUrl + 'users/dashboard_card?days='+days+'&&start_date='+start+'&&end_date='+end+'&&sales_channel='+channel).pipe(share());
  }

  dynamic_graph(){
    return this.http.get(environment.apiUrl + 'users/dynamic_graph').pipe(
      map(val => {
        let value = val['graph'];
        return value;
      })
    );
  }

  graph_update(value){
    return this.http.post(environment.apiUrl + 'users/graph_update',{graph:value}).pipe(share());
  }
}
