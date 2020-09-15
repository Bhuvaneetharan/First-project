import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AsinProtectorService {

  constructor(private http: HttpClient) { }

  productsPage(page, compitator, search){
    return this.http.get(environment.apiUrl + 'inventories/compitator_info?page='+page+'&&seller_name='+compitator+'&&keyword='+search);
  }

  competitorAnalysis(asin){
    return this.http.get(environment.apiUrl + 'inventories/compitator_details?asin='+asin);
  }

  tackAction(asin){
    return this.http.get(environment.apiUrl + 'inventories/compitator_action?asin='+asin);
  }

}
