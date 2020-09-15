import { Component, OnInit, ViewChild } from '@angular/core';
//SERVICES
import { NavService } from '../../../services';
import { ReturnsService } from '../returns.service';
// DATA SOURCE FOR TABLE DATA
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';

import { DatePipe } from '@angular/common';

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-product-return',
  templateUrl: './product-return.component.html',
  styleUrls: ['./product-return.component.scss']
})
export class ProductReturnComponent implements OnInit {
  // PAGE NUMBER
  pageNo: number;

  //PRODUCT DATA
  products:any;
  product_scroll: any;
  count:any;
  startDate:any = '';
  endDate:any = '';

  //TABLE
  columnsToDisplay: string[] = ['position','order_id','return_prod_name', 'asin', 'qty', 'order_date', 'inv_no', 'return_date', 'reason_code',  'ret_req_status', 'ref_amt','action'];
  dataSource = new MatTableDataSource();

  //SEARCH VALUE
  searchValue:any;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  sortvalue: any = {active: "", direction: ""};

  constructor( private navService:NavService, private returnService:ReturnsService,private datePipe: DatePipe, public translate: TranslateService) { 
    this.navService.show();

    // Multi language
    translate.setDefaultLang('en');
    let lang = localStorage.getItem('translate_lang')
    const browserLang = translate.getBrowserLang();
    if(lang != null){
      translate.use(lang);
    }else{
      translate.use(browserLang.match(/en|hi|ta/) ? browserLang : 'en');
    }
  }

  ngOnInit() {
    this.pageNo = 1
    this.searchValue = null;
    this.returnService.return(this.pageNo,this.searchValue,this.startDate, this.endDate, this.sortvalue['active'], this.sortvalue['direction']).subscribe(res => {
      this.products = res["return"];
      this.count = res["count"]
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.sort = this.sort;
    })
  }
  //VIRTUAL SCROLL
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.products.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.searchValue = null;
        this.returnService.return(this.pageNo,this.searchValue,this.startDate, this.endDate, this.sortvalue['active'], this.sortvalue['direction']).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.product_scroll = res["return"];
          this.count = res["count"]
          this.product_scroll.map(item => this.products.push(item));
          this.dataSource = new MatTableDataSource(this.products)
        })
      } 
    }
  }
  
  dateRange(event){
    if (event.endDate != null && event.startDate != null) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      console.log(this.startDate)
      this.ngOnInit();
    }else{
      this.startDate = "";
      this.endDate = "";
      this.ngOnInit();
    }
  }

  //KEYWORD SEARCH
  filter(event){
      if (event["target"]["value"].length != 0) {
        this.pageNo = 1;
        this.searchValue = event["target"]["value"];
        this.returnService.return(this.pageNo,this.searchValue,this.startDate, this.endDate, this.sortvalue['active'], this.sortvalue['direction']).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.products = res["return"];
          this.count = res["count"]
          this.dataSource = new MatTableDataSource(this.products)
        })
      } else if(event["target"]["value"].length == 0) {
        this.ngOnInit()
      }
  }

  // Sort Headers
  sortData(event){
    this.sortvalue = event;
    this.ngOnInit();
  }
}
