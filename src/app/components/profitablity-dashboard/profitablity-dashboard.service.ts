import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfitablityDashboardService {

  constructor(public http: HttpClient) { }

  profitMain(days, page, search){
    return this.http.get(environment.apiUrl + 'inventories/profit_table?days='+days+'&&page='+page+'&&keyword='+search);
  }
  chart(sku,days){
    return this.http.get(environment.apiUrl + 'inventories/profit_line_graph?sku='+sku+'&&days='+days);
  }
  profitView(data){
    return this.http.post(environment.apiUrl + 'plans/profit_graph',data);
  }
}
