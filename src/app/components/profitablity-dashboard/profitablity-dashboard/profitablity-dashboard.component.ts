import { Component, OnInit ,Inject} from '@angular/core';
import { NavService } from '../../../services/nav.service'
import { MatTableDataSource } from '@angular/material';
import { ProfitablityDashboardService } from '../profitablity-dashboard.service'
import { Router } from '@angular/router';
//ACTIVATED ROUTE
import { ActivatedRoute } from '@angular/router'
// MAT DIALOG
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// HIGHCHARTS
import { Chart } from 'angular-highcharts';
import {TranslateService} from '@ngx-translate/core';

declare var google:any;
@Component({
  selector: 'app-profitablity-dashboard',
  templateUrl: './profitablity-dashboard.component.html',
  styleUrls: ['./profitablity-dashboard.component.scss']
})
export class ProfitablityDashboardComponent implements OnInit {
  // CHART VARIABLES
  // chart1 = new Chart();
  // pie = new Chart();
  // graphres:any;

  displayedColumns: string[] = ['position', 'title', 'sku', 'total_qty', 'ret_qty', 'net_qty', 'tot_sales', 'tot_ret', 'net_sales', 'net_per_unit', 'crt_cost', 'crt_gst', 'over_cost', 'over_gst', 'commision', 'shipping', 'channel_per_unit', 'op_gst', 'gross_unit_margin','tot_cost','tot_gst','net_pay_gst','net_margin','net_pay_gst_unit','profit_percentage','profit', 'chart'];
  dataSource = new MatTableDataSource();  
  tableData:any;
  selectedDaysRange:any = '15';
  pageNo:any;
  tableData_scroll: any;
  // Search 
  searchValue: any = null;
  dashboardDays:any;
  constructor(public nav:NavService, public profitService: ProfitablityDashboardService,public dialog: MatDialog, public router:Router, public route:ActivatedRoute, public translate: TranslateService) {
    this.nav.show();
    this.dashboardDays = this.route.snapshot.queryParamMap.get('days');
    console.log(this.dashboardDays)
  }

  ngOnInit() {
    if(this.dashboardDays!=null){
      this.selectedDaysRange=this.dashboardDays
    }
    this.pageNo = 1;
    this.profitService.profitMain(this.selectedDaysRange, this.pageNo, this.searchValue).subscribe(res =>{
      this.tableData=res
      this.dataSource = new MatTableDataSource(this.tableData)
    })
  }
  daysChange(days){
    this.selectedDaysRange = days
    this.ngOnInit();
  }
  profitView(sku?){
    console.log(sku)
    this.router.navigate(['/profitabilitydashboard/profitReport'],{queryParams: {days: this.selectedDaysRange, sku:sku}})
  }

  // Pagenation
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.tableData.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.profitService.profitMain(this.selectedDaysRange, this.pageNo,this.searchValue).subscribe(res =>{
          this.tableData_scroll=res
          this.tableData_scroll.map(item => this.tableData.push(item));
          this.dataSource = new MatTableDataSource(this.tableData)
        })
      } 
    }
  }

  // Search Box
  filter(event) {    
    if (event["target"]["value"].length != 0) {
      // Set Search Value
      this.searchValue = event["target"]["value"];
      this.ngOnInit()
    }else{
      this.searchValue = null;
      this.ngOnInit()
    }
  }

  viewChart(sku){
    const dialogRef = this.dialog.open(chartComponent, {
      width: '500px',
      data: {'SKU': sku,'days':this.selectedDaysRange},
      disableClose: false
    });
  }
    
}

@Component({
  selector: 'chart-dialog',
  templateUrl: 'chart.component.html',
})
export class chartComponent {

//LINE CHART DATA
  chart = new Chart();
  lineChart:any;
  overview: any;
  selectedDaysRange:any;

  constructor( public dialogRef: MatDialogRef<chartComponent>,@Inject(MAT_DIALOG_DATA) public chartData,public profitService: ProfitablityDashboardService, public router:Router) { 
    this.selectedDaysRange = this.chartData.days;
  }

  ngOnInit() {
    this.profitService.chart(this.chartData.SKU,this.selectedDaysRange).subscribe(res =>{
     this.lineChart = res;
     this.overview = [{ name: this.chartData.SKU , data: res["count"] }];
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
      // plotOptions: {
          // series: {
            // cursor: 'pointer',
            // point: {
            //   events: {
            //     click: function (event) {
            //       this.dialogRef.close();
            //       let date = res["date"][event['point']['x']];
            //       this.router.navigate(['/profitabilitydashboard/profitReport'],{queryParams: {date: date, sku:this.chartData.SKU, days: this.selectedDaysRange}})      
            //     }.bind(this)
            //   }
            // }
          // }
      // },
  
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
daysChange(days){
  this.selectedDaysRange = days
  this.ngOnInit();
}
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
  }
}
