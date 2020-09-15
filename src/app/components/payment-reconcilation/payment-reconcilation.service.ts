import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PaymentReconcilationService {

  constructor(private http: HttpClient) { }
  recon(page,searchValue,viewDetail){
    return this.http.get(environment.apiUrl + 'inventories/finance_recon?page='+page+'&&keyword='+searchValue+'&&payment='+viewDetail).pipe(share());
  }

  export(){
    return this.http.get(environment.apiUrl + 'inventories/finance_recon_export').pipe(share());

  }
}
