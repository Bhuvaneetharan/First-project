import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }
  
  topProduct(pageNo){
    return this.http.get(environment.apiUrl+'campaigns/top_selling_product?page='+pageNo).pipe(share());
  }
}
