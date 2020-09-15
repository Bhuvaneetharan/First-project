import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// URL
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  products(pageNo, searchValue, checked, sort, direction){
    return this.http.get(environment.apiUrl+'inventories/products?page='+pageNo+'&&keyword='+searchValue+'&&toggle='+checked+'&&sort='+sort+'&&order='+direction).pipe(share());
  }
  sync(){
    return this.http.get(environment.apiUrl+'inventories/inventory_sync').pipe(share());
  }
  export(){
    return this.http.get(environment.apiUrl+'inventories/product_export').pipe(share());
  }
  inventoryPrice(data){
    return this.http.post(environment.apiUrl+'inventories/inventory_price',data).pipe(share());
  }

}