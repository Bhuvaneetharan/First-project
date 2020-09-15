import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// URL
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewFeedbackService {

  constructor(private http: HttpClient) { }

  // Product Review
  product(pageNo){
    return this.http.get(environment.apiUrl+'inventories/products?page='+pageNo).pipe(share());
  }

  seletedAsins(data){
    return this.http.get(environment.apiUrl+'product_reviews/selected_asin?data='+data).pipe(share());
  }

  prodectReviews(data){
    return this.http.post(environment.apiUrl+'product_reviews/product_review_v3',data).pipe(share());
  }

  asinDelete(asin){
    return this.http.post(environment.apiUrl+'product_reviews/asin_remove',{'asin':asin}).pipe(share());
  }

  upgradeplan(){
    return this.http.get(environment.apiUrl + 'plans/upgrade_plan').pipe(share());
  }

  reviewCount(asin,days){
    return this.http.post(environment.apiUrl + 'product_reviews/product_review_count',{'asin':asin,'days':days}).pipe(share());
  }

  productsCount(){
    return this.http.get(environment.apiUrl + 'users/count');
  }

  reviewcountunread(){
    return this.http.get(environment.apiUrl + 'product_reviews/review_count');
  }

  reviewAction(id){
    return this.http.get(environment.apiUrl + 'product_reviews/review_action?id='+id);
  }

  // Seller Feedback
  sellerFeedback(pageNo, searchValue){
    return this.http.get(environment.apiUrl+'product_reviews/negative_feedback?page='+pageNo+'&&keyword='+searchValue).pipe(share());
  }  
}

