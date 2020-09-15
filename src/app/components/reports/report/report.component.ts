import { Component, OnInit } from '@angular/core';
import { NavService, UserInformationService } from '../../../services';
import { ReportService} from '../report.service';
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {TranslateService} from '@ngx-translate/core';

declare var Highcharts: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ReportComponent implements OnInit {
  
  displayedColumns1: string[] = ['position', 'title','asin', 'sku', 'quantity', 'count'];
  data: any;
  dataSource1 = new MatTableDataSource();

  pageNo :number=1;
  data_scroll:any;

  customerException:any
  count: any;
  constructor(private navService:NavService, private report:ReportService, public userService:UserInformationService, public translate: TranslateService) {
    // NAV PANEL HIDE
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
    this.userService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })

    this.report.topProduct(this.pageNo).subscribe(res=>{
      this.data=res['orders'];
      this.count = res['count']
      this.dataSource1=new MatTableDataSource(this.data)
    })
   
  }
  
  scrolling(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.data.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.report.topProduct(this.pageNo).subscribe(res => {
          this.data_scroll = res["orders"];
          this.data_scroll.map(item => this.data.push(item));
          this.dataSource1 = new MatTableDataSource(this.data)
        })
      } 
    }
  }
 

}
