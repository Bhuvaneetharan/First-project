import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// URL
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ReturnsService {

  constructor(private http: HttpClient) { }
  
  return(pageNo,keyword,startDate,endDate, sort, direction){
    return this.http.get(environment.apiUrl + 'inventories/return_details?page_no='+pageNo+'&&keyword='+keyword+'&&startDate='+startDate+'&&endDate='+endDate+'&&sort='+sort+'&&order='+direction).pipe(share());
  }
}
