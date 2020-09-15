import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/nav.service'
import { PaymentReconcilationService } from '../payment-reconcilation.service';
// TABLE DATA SOURCE
import { MatTableDataSource } from '@angular/material';
// RXJS
import { ExcelService } from '../../../services/excel.service';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import { SnackBar } from '../../../common/shared';

@Component({
  selector: 'app-payment-reconcilation',
  templateUrl: './payment-reconcilation.component.html',
  styleUrls: ['./payment-reconcilation.component.scss']
})
export class PaymentReconcilationComponent implements OnInit {
//PAGE NO
pageNo: number = 1;
//TABLE DATA
reconData:any;
reconData_scroll:any;
//SEARCH KEYWORD
searchValue:any;
showSearch: boolean = false;
count:any;
 // TABLE HEADERS
displayedColumns: string[] = ['position', 'order_id', 'seller_sku', 'posted_date','product_rupees', 'product_percent','amazon_rupees', 'amazon_percent','shipping_rupees', 'shipping_percent','promotion_rupees', 'promotion_percent','return_rupees', 'return_percent','net_rupees', 'net_percent'];

// displayedColumns: string[] = ['position', 'order_id', 'seller_sku', 'posted_date', 'product_price', 'Amazon_fees',  'shipping_fees', 'promotion_fees', 'return', 'net'];
dataSource = new MatTableDataSource();
products: Object;
export_excel: any[]=[];
viewDetail:any = 'amount';
//DATE
 todaysDate: any;
  dateColor:boolean = false;
  filename: string;

  constructor(public snackbar: SnackBar, public nav:NavService, public paymentServe:PaymentReconcilationService, public excel:ExcelService, public http:HttpClient, public translate: TranslateService) {
    this.nav.show();
   }

  ngOnInit() {
    this.pageNo = 1
    this.searchValue = null;
    this.todaysDate = new Date()
    this.paymentServe.recon(this.pageNo,this.searchValue,this.viewDetail).subscribe(res => {
     this.reconData = res['response'];
     this.count = res['count']
     this.dataSource = new MatTableDataSource(this.reconData);
     for(let i=0;i<this.reconData.length;i++){
        if(this.reconData[i].posted_date >= this.todaysDate){
          this.dateColor = true;
        }
      }
    })
  }
  viewDetails(details){
  this.viewDetail = details
  this.ngOnInit()
  }
  //SEARCH FILTER
  filter(event){
    if(event["target"]["value"].length >= 3){
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.paymentServe.recon(this.pageNo, this.searchValue,this.viewDetail).subscribe(res => {
        this.reconData = res['response'];
        this.count = res['count']
        this.dataSource = new MatTableDataSource(this.reconData)
      });
    }else if(event["target"]["value"].length == 0){
      this.ngOnInit();
    }
  }
  //CLEARING SEARCH INPUT
  clearData(){
    this.ngOnInit();
  }
//EXPORT
  export(){
    this.paymentServe.export().subscribe(res => {
      this.products = res;
        for(var i=0;i<this.products['export'].length;i++){
            this.export_excel.push({
              "S.No":i+1,
              "Order ID":this.products['export'][i]['amazon_order_id'],
              "principal":this.products['export'][i]['principal'],
              "Tax":this.products['export'][i]['tax'],
              "gifrwrap":this.products['export'][i]['gifrwrap'],
              "Gf Tax":this.products['export'][i]['gf_tax'],
              "Shipping Charge":this.products['export'][i]['ship_charge'],
              "Shipping Tax":this.products['export'][i]['ship_tax'],
              "IGST":this.products['export'][i]['IGST'],
              "CGST":this.products['export'][i]['CGST'],
              "SGST":this.products['export'][i]['SGST'],
              "FBA delivery service fees":this.products['export'][i]['fba_del_ser_fees'],
              "FBA per unit":this.products['export'][i]['fba_per_unit'],
              "FBA weight":this.products['export'][i]['fab_weight'],
              "Tech fee":this.products['export'][i]['tech_fee'],
              "Commission":this.products['export'][i]['commision'],
              "Fixed close fee":this.products['export'][i]['fix_close_fee'],
              "Gift back":this.products['export'][i]['gift_back'],
              "Ship back":this.products['export'][i]['ship_back'],
              "Variable close":this.products['export'][i]['var_close'],
            })
      }
      this.excel.exportAsExcelFile(this.export_excel, 'Account & Reconciliation Report');
    })
  }
  //IMPORT
  upload(files: File[]){
    if(files[0]['type'] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    this.filename = files[0].name
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file',f)) //converting file to binary 
    this.http.post(environment.apiUrl+'inventories/product_import', formData).subscribe(event => {
      if(event['key']==true){
        this.ngOnInit();
      }
    });
  }else{
    alert("Choose an Excel file format to be upload")
    this.snackbar.snackbars('info','Choose an Excel file format to be upload')
  }
  }

  //VIRTUAL SCROLL
  onScroll(event){
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if(this.reconData.length == (20*this.pageNo)){
        this.pageNo = this.pageNo + 1;
        this.paymentServe.recon(this.pageNo,this.searchValue,this.viewDetail).pipe(debounceTime(200),throttleTime(50)).subscribe(res =>{
          this.reconData_scroll = res['response'];
          this.count = res['count']
          this.reconData_scroll.map(item => this.reconData.push(item));
          this.dataSource = new MatTableDataSource(this.reconData)
        })
      }
    }
  }
}
