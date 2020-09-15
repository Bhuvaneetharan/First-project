import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services';
import { OrderService } from '../order.service'
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-repeated-customers',
  templateUrl: './repeated-customers.component.html',
  styleUrls: ['./repeated-customers.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RepeatedCustomersComponent implements OnInit {
  
  columnsToDisplay: string[] = ['serialNo','buyerEmail', 'count', 'city', 'state'];
  dataSource2 = new MatTableDataSource();
  
  customerException:any
  page :number=1;
  customers: any;
  expandedElement: any;
  customers_scroll:any;
  repeat: any;
  count: any;

  constructor(private navService:NavService, private orderService:OrderService, public translate: TranslateService) { 
    // NAV PANEL SHOW
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
    this.orderService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })

    this.orderService.repeatedCustomers(this.page).subscribe(res=>{
      this.customers=res['customer'];
      this.count=res['count']
      this.dataSource2=new MatTableDataSource(this.customers)

    })
  }

  scroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.customers.length == (20 * this.page)) {
        this.page = this.page + 1;
        this.orderService.repeatedCustomers(this.page).subscribe(res => {
          this.customers_scroll = res['customer'];
          this.customers_scroll.map(item => this.customers.push(item));
          this.dataSource2 = new MatTableDataSource(this.customers)
        })
      } 
    
    }
  }

  expand(email){
    this.orderService.repeatExpand(email).subscribe(res=>{
      this.repeat=res;
    })
  }

}
