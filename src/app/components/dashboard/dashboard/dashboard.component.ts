import { Component, OnInit, HostListener} from '@angular/core';
import FuzzySearch from 'fuzzy-search';

// SERVICES
import { NavService} from '../../../services'
import { DashboardsService } from '../dashboards.service'
import { Router } from '@angular/router'
// HIGHCHARTS
import { Chart } from 'angular-highcharts';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

//Data Table
import { MatTableDataSource } from '@angular/material';

import { ActivatedRoute } from '@angular/router'
import {TranslateService} from '@ngx-translate/core';

declare var google:any;
declare var Highcharts: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{

  // CHART VARIABLES
  chart = new Chart();
  chart1 = new Chart();
  pie = new Chart();
  salesProfit = new Chart();
  graphres:any;

  // days for the change the dashboard response
  chooseDays:any=["7","15","30","60","90"]
  selected:any = "15";

  // Table Headers
  displayedColumns1: string[] = ['total','title', 'quantity', 'count'];
  displayedColumns: string[] = ['count','name','location'];

  // Table Data
  dataSource = new MatTableDataSource();
  dataSource1 = new MatTableDataSource();

  // Chart Datas
  overview: any;
  piedata:any;
  product_review:any
  linechart: any;
  piechart: any;
  card_data:any;
  salesview:any;
  
  salesChannel: any = 'Amazon'
  dashboardDates:any;
  product_title: any;
  datapush: any[] = [];
  graphDynamic: any;

  // language
  lang: string;

  seriesdata:any = [{
    name: 'Sales',
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

}, {
    name: 'Profit',
    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

}]

  public screenWidth: any;
  public screenHeight: any;
  startDate: any = "";
  endDate: any = "";
  dashboardStart: any;
  dashboardEnd: any;

  constructor(private datePipe: DatePipe, private navService: NavService, private dashboardService: DashboardsService, public router:Router, public route: ActivatedRoute, public translate: TranslateService) {
    // NAV PANEL HIDE
    this.navService.show();
    this.dashboardDates = this.route.snapshot.queryParamMap.get('days')
    this.dashboardStart = this.route.snapshot.queryParamMap.get('start')
    this.dashboardEnd = this.route.snapshot.queryParamMap.get('end')
    
    // // Multi language
    // translate.setDefaultLang('en');
    // this.lang = localStorage.getItem('translate_lang')
    // const browserLang = translate.getBrowserLang();
    // if(this.lang != null){
    //   translate.use(this.lang);
    // }else{
    //   translate.use(browserLang.match(/en|hi|ta/) ? browserLang : 'en');
    // }
  }

  ngOnInit() {
    // screen Resalution
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    
    // Card Data's
    this.dashboardService.dashboard_card(this.selected, this.startDate,this.endDate, this.salesChannel).subscribe(res => {
      this.card_data=res
    })
    
    this.dynamicGraph()
    this.orderStatsticsChart();
    this.productReviewChart();
    this.topSellingProductTable();
    this.OrderStatusChart();
    this.repeatedCustomersTable();
    this.geoGraphChart();
    this.salesProfitChart();
   
    // Routing change response

    if(this.dashboardDates!=null){
      this.selected=this.dashboardDates
    }
    else if(this.dashboardStart!=null && this.dashboardStart!=''){
      this.selected=""
      this.startDate=this.dashboardStart
      this.endDate=this.dashboardEnd
    }
    console.log(this.navService.chennal)
  }

  // Screen Resalution
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  
  changeChannel(event){
    this.salesChannel = event['value']
    this.ngOnInit()
  }

  dynamicGraph(){
    this.dashboardService.dynamic_graph().subscribe(res => {
      this.graphDynamic = res
    })
  }

  translateLang(event){
    this.translate.use(event['value'])
    localStorage.setItem('translate_lang', event['value'])
  }

  colseChart(key){
    this.graphDynamic[key] = false;
    this.dashboardService.graph_update(this.graphDynamic).subscribe(res =>{
      this.dynamicGraph();
    })
  }

  enableChart(event, key){
    if(event['checked']){
      this.graphDynamic[key] = true;
      if(key == 'geo'){
        this.geoGraphChart();
      }
    }else{
      this.graphDynamic[key] = false;
      if(key == 'geo'){
        this.geoGraphChart();
      }
    } 
    this.dashboardService.graph_update(this.graphDynamic).subscribe(res =>{
      this.dynamicGraph();
    })
  }

  dateRange(event){
    if (event.endDate != null && event.startDate != null) {
      this.startDate = this.datePipe.transform(event.startDate, 'dd-MMM-yyyy');
      this.endDate = this.datePipe.transform(event.endDate, 'dd-MMM-yyyy');
      this.dashboardDates = ''
      this.selected = "";
      this.ngOnInit();
    } else {
      this.startDate = "";
      this.endDate = "";
      this.selected = "15"
      this.ngOnInit();
    }
  }
  // Order Statstics
  orderStatsticsChart(){
    this.dashboardService.oderOverview(this.selected, this.startDate,this.endDate,this.salesChannel).subscribe(res => {
      this.linechart = res['count'];
      this.overview = [{ name: 'Last '+this.selected+' Days ', data: res["count"] }];
      this.chart = new Chart({
        chart: {
          type: 'column',
          // height: '230px',
          zoomType: 'xy',
          style:{
             fontFamily: 'Assistant'
          }
        },

        tooltip: {
          style: {
            opacity: 1
          },
          formatter: function () {
              return 'Total Orders: <b>' +
                  '</b> <b>' + this.y;
          }
        },

        legend: {
          align: 'center',
          verticalAlign: 'bottom'
        },

        xAxis: {
          title:{
            text: 'Selected days'
          },
          categories: res["date"],
        },

        title: {
          text: ''
        },

        yAxis: {
          title: {
            text: 'Total Orders'
          }
        },

        credits: {
          enabled: false
        },

        plotOptions: {
          column: {
            pointPadding: 0.35,
            borderWidth: 0
        },
          series: {
            // lineWidth: 1,
            cursor: 'pointer',
            point: {
              events: {
                click: function (event) {
                  let date = res["date"][event['point']['x']];
                  this.router.navigate(['/orders'],{queryParams: {date: date,days:this.selected}})
                }.bind(this)
              }
            }  
          }
        },

        series: this.overview,

        colors: ['#0054FC']
      })
    });
  }

  getRecord(row){
    if(this.selected!=""){
      this.router.navigate(['/orders'],{queryParams: {days: this.selected, asin:row, status:'Shipped'}})
    }else if(this.startDate!=""){
      this.router.navigate(['/orders'],{queryParams: {start: this.startDate, end :this.endDate, asin:row, status:'Shipped'}})
    }
  }

  // Top Selling Products
  topSellingProductTable(){
    this.dashboardService.sellingProduct(this.selected, this.startDate,this.endDate,this.salesChannel).subscribe(res =>{
      this.dataSource1=new MatTableDataSource(res['top_products'])
    })
  }

  getRepeated(row){
    if(this.selected!=""){
    this.router.navigate(['/orders'],{queryParams: {days: this.selected,email: row}})
    }else if(this.startDate!=""){
      this.router.navigate(['/orders'],{queryParams: {start: this.startDate, end :this.endDate,email: row}})
    }
  }

  // Product Reviews
  productReviewChart(){
    this.dashboardService.product_rating(this.selected, this.startDate,this.endDate, this.salesChannel).subscribe(res =>{
      this.product_review = res['data'];
      this.product_title = res['title']
      this.chart1 = new Chart({
        chart: {
          type: 'column',
          zoomType: 'xy',
         style:{
             fontFamily: 'Assistant'
          }
        },

        loading: {
          hideDuration: 1000,
          showDuration: 1000
        },

        title: {
          text: ''
        },

        xAxis: {
          categories: res['category'],
          title: {
              text: 'Total 5 ASIN(s)'
          },
        },

        yAxis: {
          min: 0,
          title: {
              text: 'Count of total product reviews'
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
            }
          }
        },

        credits: {
          enabled: false
        },

        legend: {
          align: 'center',
          x: 0,
          verticalAlign: 'bottom',
          y: 0,
          borderColor: '#CCC',
          shadow: false
        },

        tooltip: {
          style: {
            opacity: 1
          },
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name} Star: {point.y}<br/>Total: {point.stackTotal}',
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            pointWidth: 10,
          },
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function (event) {
                  let asin = res['category'][event['point']['x']];
                  this.router.navigate(['/reviewsfeedback/productreview'],{queryParams: {asin: asin,days: this.selected}})
                }.bind(this)
              }
            } 
          }
        },
        series: this.product_review,
        colors: ['#0054FC', '#FBBE3C', '#FF5D37' , '#02E7C3' , '#182936'],
      });
    })
  }

  // Order Status
  OrderStatusChart(){
    this.dashboardService.order_status(this.selected, this.startDate,this.endDate,this.salesChannel).subscribe(res =>{
      this.piechart = res
      // this.piedata = [{
      //   name: 'Orders',
      //   colorByPoint: true,
      //   data: res['status'],
      // }]
      // this.pie = new Chart({
      //   chart: {
      //     plotBackgroundColor: null,
      //     plotBorderWidth: null,
      //     plotShadow: false,
      //     type: 'pie',
      //     zoomType: 'xy',
      //     height: '230px',
      //     style:{
      //       fontFamily: 'Assistant'
      //     }
      //   },

      //   legend: {
      //     align: 'right',
      //     verticalAlign: 'top',
      //     layout:'vertical',
      //     x:0,
      //     y:60,
      //     itemWidth:100,
      //   },

      //   xAxis: {
      //     categories: res["date"],
      //   },

      //   title: {
      //     text: ''
      //   },

      //   yAxis: {
      //     title: {
      //       text: 'Total Orders'
      //     }
      //   },

      //   credits: {
      //     enabled: false
      //   },

      //   plotOptions: {
      //     pie: {
      //       allowPointSelect: true,
      //       cursor: 'pointer',
      //       point: {
      //         events: {
      //           click: function (event) {
      //             let date = event['point']['options']['name'];
      //             this.router.navigate(['/orders'],{queryParams: {order_status: date, days:this.selected}})
      //           }.bind(this)
      //         }
      //       },
      //       dataLabels: {
      //           enabled: false
      //       },
      //       showInLegend: true
      //     }
      //   },
      //   series: this.piedata,
      //   colors: ['#a84866', '#6b55a3', '#16a15e' , '#069191', '#0075bb']
      // });
    })
  }

  // Repeated Customers
  repeatedCustomersTable(){
    this.dashboardService.repeated_customer(this.selected, this.startDate,this.endDate,this.salesChannel).subscribe(res => {
      this.dataSource = new MatTableDataSource(res['repeat_buyers'])
    })
  }

  // Geo Graph Location
  geoGraphChart(){
    this.datapush = [];
    var data = [
      ['madhya pradesh', 0],
      ['uttar pradesh', 0],
      ['karnataka', 0],
      ['nagaland', 0],
      ['bihar', 0],
      ['lakshadweep', 0],
      ['andaman and nicobar', 0],
      ['assam', 0],
      ['west bengal', 0],
      ['puducherry', 0],
      ['daman and diu', 0],
      ['gujarat', 0],
      ['rajasthan', 0],
      ['dadara and nagar havelli', 0],
      ['chhattisgarh', 0],
      ['tamil nadu', 0],
      ['chandigarh', 0],
      ['punjab', 0],
      ['haryana', 0],
      ['andhra pradesh', 0],
      ['maharashtra', 0],
      ['himachal pradesh', 0],
      ['meghalaya', 0],
      ['kerala', 0],
      ['telangana', 0],
      ['mizoram', 0],
      ['tripura', 0],
      ['manipur', 0],
      ['arunanchal pradesh', 0],
      ['jharkhand', 0],
      ['goa', 0],
      ['nct of delhi', 0],
      ['odisha', 0],
      ['jammu and kashmir', 0],
      ['sikkim', 0],
      ['uttarakhand', 0]
  ];
    this.dashboardService.geo_graph(this.selected, this.startDate,this.endDate,this.salesChannel).subscribe( res => {
      this.graphres = res;
      
      const searcher = new FuzzySearch(this.graphres['graph_data'], [0], {
        caseSensitive: false,
      });
      for(let i=0; i<data.length; i++){
        const result = searcher.search(data[i][0]);  
        if(result.length != 0){
          data[i][1] = result[0][1]
        }else{
          data[i][1] = 0;
        }
      }
      const source = from(data);
      let val = source.pipe(filter(res => res[1] != 0))
      val.subscribe(val => {
        this.datapush.push(val)
        // Create the chart
        Highcharts.mapChart('container', {
          chart: {
              map: 'countries/in/custom/in-all-disputed',
              // height:'250px'
          },

          title: {
              text: ''
          },

          mapNavigation: {
              enabled: true,
              buttonOptions: {
                  verticalAlign: 'bottom'
              }
          },

          legend: {
            enabled: false
          },

          colorAxis: {
        // minColor: '#bada55',
          maxColor: '#0054FC'
          },
          
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },

          plotOptions:{
            series:{
                events:{
                    click:function(event){
                      let name = event['point']['name'];
                      if(this.selected!=""){
                        this.router.navigate(['/orders'],{queryParams: {geo: name, days:this.selected}})
                      }else if(this.startDate!=""){
                        this.router.navigate(['/orders'],{queryParams: {geo: name, start: this.startDate, end: this.endDate}})
                      }
                    }.bind(this)
                }
            }
          },

            series: [{ 
                data: this.datapush,
                name: 'India',
                states: {
                    hover: {
                        color: '#76DC45'
                    }
                },
            }]
          });
        });
      });
  }

  salesProfitChart() {
    this.salesProfit = new Chart({
      chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Value (INR)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            
        }
        
    },
    colors: ['#0054FC', '#FBBE3C'],
    series: this.seriesdata
    });
  }

  // Change days reflected in the dashboard
  chartChange(day){
    this.selected = day
    this.dashboardStart = ''
    this.dashboardEnd = ''
    this.startDate = "";
    this.endDate = "";
    this.ngOnInit();
  }
  
  ngOnDestroy() {}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              