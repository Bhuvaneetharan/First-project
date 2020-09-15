import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// URLs
import { environment } from 'src/environments/environment';

import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {


  constructor(private http: HttpClient) { }

  invoices(){
    return this.http.get(environment.apiUrl + 'inventories/invoices').pipe(share());
  }
  invoicesDownload(invoice_no){
  return this.http.get(environment.apiUrl + 'inventories/download_invoice?id='+invoice_no).pipe(share()); 
  }
}
