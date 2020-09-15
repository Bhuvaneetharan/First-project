import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplateDialogService {

  constructor(private http: HttpClient) { }

  temp_list(pageNo, purposeof, camp_id){
    return this.http.get(environment.apiUrl+'campaigns/templates?template_purpose='+purposeof+'&&page='+pageNo+'&&id='+camp_id).pipe(share());
  }

  tempPush(temp_id, camp_id){
    return this.http.get(environment.apiUrl+'campaigns/template_push?template_id='+temp_id+'&&id='+camp_id).pipe(share());
  }

  tempPop(temp_id, camp_id){
    return this.http.get(environment.apiUrl+'campaigns/template_pop?template_id='+temp_id+'&&id='+camp_id).pipe(share());
  }


}
