import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  marketplaceUpdate(marketplace: object) {
    return this.http.post(environment.apiUrl + 'users/marketplace_update', marketplace).pipe(share());
  }

  sync() {
    return this.http.get(environment.apiUrl + 'users/data_sync').pipe(share());
  }

  accountSync() {
    return this.http.get(environment.apiUrl + 'users/account_sync').pipe(share());
  }
  resendCode(){
    return this.http.get(environment.apiUrl + 'users/verification_mail').pipe(share());
  }

  marketplaceInfo(){
    return this.http.get(environment.apiUrl + 'users/marketplace_info').pipe(share());
  }
}
