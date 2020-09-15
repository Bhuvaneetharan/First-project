import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/nav.service'
//ACTIVATED ROUTE
import { ActivatedRoute } from '@angular/router'
//PROFITABILITY DASHBOARD SERVICE
import { ProfitablityDashboardService } from '../profitablity-dashboard.service'
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import { Chart } from 'angular-highcharts';
@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.scss']
})
export class ProfitReportComponent implements OnInit {
  //profitable-dashboard value
  dashboardDate:any;
  dashboardSKU:any;
  panelOpenState = false;
  //PROFIT CHART DATA
  profitChart:any;
  selectedDaysRange:any;
  //LINE CHART DATA
  lineChart:any;
  overview: any;
  chart = new Chart();
  constructor(public nav:NavService,public route:ActivatedRoute, public profitService: ProfitablityDashboardService, public router:Router, public translate: TranslateService) {
    this.nav.hide();
    //profitable-dashboard value
    this.dashboardDate = this.route.snapshot.queryParamMap.get('date');
    this.dashboardSKU = this.route.snapshot.queryParamMap.get('sku');
    this.selectedDaysRange = this.route.snapshot.queryParamMap.get('days');
    
   }

  ngOnInit() {
    if(this.dashboardSKU==null){
      this.dashboardSKU='All'
    }
    let data ={sku: this.dashboardSKU, days: this.selectedDaysRange}
    this.profitService.profitView(data).subscribe(res =>{
    this.profitChart = res[0];
  })
  }
  daysChange(days){
    this.selectedDaysRange = days;
    this.ngOnInit();
    this.viewChart()
  }
  back(){
    this.router.navigate(['/profitabilitydashboard'],{queryParams: {days: this.selectedDaysRange}})
  }
  viewChart(){
    this.profitService.chart('All',this.selectedDaysRange).subscribe(res =>{
      this.lineChart = res;
      this.overview = [{ name: 'SKU' , data: res["count"] }];
      this.chart = new Chart({
       title: {
         text: ''
       },
       yAxis: {
         title: {
           text: 'Total Orders'
         }
       },
   
       xAxis: {
         categories: res["date"],
       },
   
       legend: {
           layout: 'vertical',
           align: 'right',
           verticalAlign: 'middle'
       },
      credits: {
     enabled: false
 },
       series: this.overview,
       responsive: {
           rules: [{
               condition: {
                   maxWidth: 500
               },
               chartOptions: {
                   legend: {
                       layout: 'horizontal',
                       align: 'center',
                       verticalAlign: 'bottom'
                   }
               }
           }]
       }
      });
   })
  }
  profitView(){
    this.lineChart = ''
    this.ngOnInit()
  }
}
