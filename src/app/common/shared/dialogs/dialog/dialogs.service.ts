import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(private http: HttpClient) { }

  product(pageNo, searchValue){
    return this.http.get(environment.apiUrl+'inventories/products?page='+pageNo+'&&keyword='+searchValue).pipe(share());
  }

  sendAsins(asins){
    return this.http.post(environment.apiUrl+'product_reviews/total_asin',asins).pipe(share());
  }
  seletedAsins(){
    return this.http.get(environment.apiUrl+'product_reviews/selected_asin').pipe(share());
  }
  scraper(){
    return this.http.get(environment.apiUrl+'product_reviews/review_scraper').pipe(share());
  }
  clearAll(){
    return this.http.get(environment.apiUrl+'product_reviews/clear_all').pipe(share());
  }
}
