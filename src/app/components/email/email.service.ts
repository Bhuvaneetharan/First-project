import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  // Schedule Mail's
  schedulemail(pageno, searchValue){
    return this.http.get(environment.apiUrl+'templates/scheduled_email?page='+pageno+'&&keyword='+searchValue).pipe(share());
  }

  dateFiltershedule(startDate, endDate, page){
    return this.http.get(environment.apiUrl+'templates/scheduled_date?start_date='+startDate+'&&end_date='+endDate+'&&page='+page).pipe(share());
  }

  // Sent Mail's
  sendemail(pageno, searchValue){
    return this.http.get(environment.apiUrl+'templates/send_email?page='+pageno+'&&keyword='+searchValue).pipe(share());
  }

  // emailCount(){
  //   return this.http.get(environment.apiUrl+'users/email_count').pipe(share());
  // }

  dateFiltersent(startDate, endDate, page){
    return this.http.get(environment.apiUrl+'templates/send_date?start_date='+startDate+'&&end_date='+endDate+'&&page='+page).pipe(share());
  }

  temp(temp_id){
    return this.http.get(environment.apiUrl+'emails/email_preview?template_id='+temp_id).pipe(share());
  }

  openClickRate() {
    return this.http.get(environment.apiUrl + 'inventories/dashboard_count').pipe(share());
  }
}
