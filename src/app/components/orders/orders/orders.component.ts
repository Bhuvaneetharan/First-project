import { Component, OnInit, ViewChild } from '@angular/core';

// ANIMATION
import { animate, state, style, transition, trigger } from '@angular/animations';

import { NavService, UserInformationService } from '../../../services'
// SERVICES
import { OrderService } from '../order.service'
import FuzzySearch from 'fuzzy-search';

// DATA SOURCE FOR TABLE DATA
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';

import { ExcelService } from '../../../common/shared';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router'
import { SnackBar } from '../../../common/shared';

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';
import { from } from 'rxjs';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import Swal from 'sweetalert2'

import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class OrdersComponent implements OnInit {

  // PAGE NUMBER
  pageNo: number;

  // Date Range 
  public startDate: any = "";
  public endDate: any = "";

  // Search 
  searchValue: any = null;

  // Filter Hide and Show
  toggle_filter: boolean;

  // DATA
  orders: any;
  order_scroll: any;
  expandData: any;
  orderCounts: any;

  // Filter Dropdown datas
  channels: any;
  allstatus: any;
  locations: any;

  // Export Data
  inventorydata: any;
  inventoryexcel: any[] = [];

  // Filter Dropdown values
  channelSelects: any = "All";
  statusSelects: any = "All";
  locationSelects: any = "All";


  // TABLE HEADERS
  columnsToDisplay = ['position', 'amazon_order_id', 'product_title', 'asin', 'seller_sku', 'fulfillment_channel', 'purchased_at', 'latest_shipped_at', 'total', 'status', 'location'];
  expandedElement: any;
  expandedData: any;

  // TABLE DATA
  dataSource = new MatTableDataSource();
  customerException: any;

  // Dashboard Routing Value
  dashboardDate: any;
  dashboardStart: any;
  dashboardEnd: any;
  dashboardOrderStatus: any;
  dashboardGeoghap: any;
  dashboardDates: any = [];
  dashboardEmail: any;
  dashboardAsin: any;
  dashboardStatus: string;
  dashboardGeo: string;
  isSync: boolean = false

 // sales channel
  salesChannel: any = 'Amazon'

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  sortvalue: any = { active: "", direction: "" };
  constructor(private snackbar: SnackBar, private datePipe: DatePipe, private excelService: ExcelService, public userService: UserInformationService, private orderService: OrderService, private navService: NavService, public route: ActivatedRoute, public router: Router, public translate: TranslateService) {

    // NAV PANEL HIDE
    this.navService.show();

    // Dashboard Value's
    this.dashboardDate = this.route.snapshot.queryParamMap.get('date');
    this.dashboardOrderStatus = this.route.snapshot.queryParamMap.get('order_status');
    this.dashboardGeoghap = this.route.snapshot.queryParamMap.get('dash')
    this.dashboardDates = this.route.snapshot.queryParamMap.get('days')
    this.dashboardStart = this.route.snapshot.queryParamMap.get('start')
    this.dashboardEnd = this.route.snapshot.queryParamMap.get('end')
    this.dashboardAsin = this.route.snapshot.queryParamMap.get('asin')
    this.dashboardEmail = this.route.snapshot.queryParamMap.get('email')
    this.dashboardStatus = this.route.snapshot.queryParamMap.get('status');
    this.dashboardGeo = this.route.snapshot.queryParamMap.get('geo')

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
    this.userService.daysLeft().subscribe(res => {
      if (res["status"] == true) {
        Swal.fire(
          'Info',
          'Sync in progress! Location may not available for the Orders.',
          'warning'
        )
      }
    })

    // Forever free plans hide datas
    this.orderService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })

    // Dashboard Routing change response
    if (this.dashboardDate != null) {
      this.startDate = this.dashboardDate;
      this.endDate = this.dashboardDate;
      this.allorders();
    }
    else if (this.dashboardStart != null && this.dashboardEnd != null){
      this.startDate = this.dashboardStart;
      this.endDate = this.dashboardEnd;
      this.allorders();
    } else if (this.dashboardOrderStatus != null) {
      this.statusSelects = this.dashboardOrderStatus;
      this.toggle_filter = true;
      this.allorders();
    } else if (this.dashboardAsin != null) {
      this.searchValue = this.dashboardAsin;
      this.statusSelects = this.dashboardStatus
      this.allorders();
    } else if (this.dashboardEmail != null) {
      this.searchValue = this.dashboardEmail;
      this.startDate = this.dashboardStart;
      this.endDate = this.dashboardEnd;
      this.allorders();
    }  else {
      this.allorders();
    }
  }

  changeChannel(event){
    if(event == true){
      this.salesChannel = 'Flipkart'
      this.ngOnInit()
    }else{
      this.salesChannel = 'Amazon'
      this.ngOnInit()
    }
  }
  backToDashboard() {
    if(this.dashboardDates!=null){
      this.router.navigate(['/dashboard'], { queryParams: { days: this.dashboardDates } })
    }else{
      this.router.navigate(['/dashboard'], { queryParams: { start: this.dashboardStart, end: this.dashboardEnd } })
    }
    
  }

  // Initial Loading 
  allorders() {
    this.pageNo = 1;
    this.orderService.dateFilter(this.channelSelects, this.statusSelects, this.locationSelects,this.salesChannel).subscribe(res => {
      this.channels = res['channel'];
      this.allstatus = res['status'];
      this.locations = res['location'];

      const searcher = new FuzzySearch(this.locations, {
        caseSensitive: false,
      });

      const result = searcher.search(this.dashboardGeo);
      if (this.dashboardGeo != null) {
        const arraySource = from(result);
        arraySource.subscribe(res => {
          this.locationSelects = res
          this.toggle_filter = true;
        })
      }
      let datas = { "page": this.pageNo, "days": this.dashboardDates, "keyword": this.searchValue, "channel": this.channelSelects, "status": this.statusSelects, "location": this.locationSelects, "start_date": this.startDate, "end_date": this.endDate, "sort": this.sortvalue['active'], "order": this.sortvalue['direction'] , "sales_channel": this.salesChannel};
      this.orderService.order(datas).subscribe(res => {
        this.orders = res;
        this.dataSource = new MatTableDataSource(this.orders)
        this.dataSource.sort = this.sort;
      })
      let data = { 'search': this.searchValue, "days": this.dashboardDates, 'start_date': this.startDate, 'end_date': this.endDate, "channel": this.channelSelects, "status": this.statusSelects, "location": this.locationSelects, "sales_channel": this.salesChannel}
      this.orderService.orderCount(data).subscribe(res => {
        this.orderCounts = res;
      })
      this.dashboardGeo = null;
    })
  }

  // Search Box
  filter(event) {
    if (event["target"]["value"].length != 0) {
      // Set Search Value
      this.searchValue = event["target"]["value"];

      // If any value in the checkbox, Filter and daterange values was cleared
      this.channelSelects = 'All'
      this.statusSelects = 'All'
      this.locationSelects = 'All';
      this.dashboardDates = null;
      this.toggle_filter = false;
      this.startDate = "";
      this.endDate = "";
      this.allorders();
    } else {
      this.searchValue = null;
      this.allorders();
    }
  }

  // Order Sync
  orderSync() {
    this.isSync = true
    this.snackbar.snackbars('info', 'Sync has been started')
    this.orderService.order_sync().subscribe(res => {
      this.allorders();
      this.isSync = false
    })
  }

  filterSelect() {
    // If any value in the filter, Search and daterange values was cleared
    this.searchValue = null;
    this.startDate = "";
    this.endDate = "";
    this.allorders();
  }

  // DATE RANGE PICKER
  dateRange(event) {
    if (event.endDate != null && event.startDate != null) {
      this.startDate = this.datePipe.transform(event.startDate, 'dd/MMM/yyyy');
      this.endDate = this.datePipe.transform(event.endDate, 'dd/MMM/yyyy');
      // If any value in the Date Range, Search and filter values was cleared
      this.channelSelects = 'All'
      this.statusSelects = 'All'
      this.locationSelects = 'All'
      this.dashboardDates = null
      this.toggle_filter = false;
      this.searchValue = null;
      this.allorders();

    } else {
      this.startDate = "";
      this.endDate = "";
      this.allorders();
    }
  }

  //Expand
  expand(id) {
    this.orderService.orderExpand(id).subscribe(res => {
      this.expandData = res;
    })
  }

  // Filter Open and Close
  toggle_action() {
    if (this.toggle_filter) {
      this.channelSelects = 'All';
      this.statusSelects = 'All';
      this.locationSelects = 'All';
      this.dashboardDates = null;
    }
    this.toggle_filter = !this.toggle_filter;
  }

  // Pagenation
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.orders.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        let datas = { "page": this.pageNo, "sort": this.sortvalue['active'], "order": this.sortvalue['direction'], "days": this.dashboardDates, "keyword": this.searchValue, "channel": this.channelSelects, "status": this.statusSelects, "location": this.locationSelects, "start_date": this.startDate, "end_date": this.endDate };
        this.orderService.order(datas).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.order_scroll = res;
          this.order_scroll.map(item => this.orders.push(item));
          this.dataSource = new MatTableDataSource(this.orders)
        })
      }
    }
  }

  // Inventory Export
  inventoryexport() {
    let date = moment().subtract(90, 'days').format('DD/MM/YYYY');
    let datas = { "page": this.pageNo, "keyword": this.searchValue, "channel": this.channelSelects, "status": this.statusSelects, "location": this.locationSelects, "start_date": this.startDate, "end_date": this.endDate };
    this.orderService.order_report(datas).subscribe(res => {
      this.inventorydata = res;
      if (this.inventorydata.length == 0) {
        alert("Exporting! No data found")
      } else {
        for (var i = 0; i < this.inventorydata.length; i++) {
          this.inventoryexcel.push({
            "S.No": i + 1,
            "Order ID": this.inventorydata[i].amazon_order_id,
            "Product Title": this.inventorydata[i].order_item[0].title,
            "ASIN": this.inventorydata[i].order_item[0].asin,
            "SKU": this.inventorydata[i].order_item[0].seller_sku,
            "Fulfillment Channel": this.inventorydata[i].fulfillment_channel,
            "	Order Date": this.inventorydata[i].purchased_at,
            "Shipped Date": this.inventorydata[i].latest_shipped_at,
            "Total Amount": this.inventorydata[i].total.slice(0, -4),
            "Order Status": this.inventorydata[i].status,
            "Location": this.inventorydata[i].location,
          });
        }

        if (this.endDate == "" && this.startDate == "") {
          this.excelService.exportAsExcelFile(this.inventoryexcel, 'Order Details');
        } else {
          this.startDate = this.datePipe.transform(this.startDate, 'dd/MMM/yyyy');
          this.endDate = this.datePipe.transform(this.endDate, 'dd/MMM/yyyy');
          this.excelService.exportAsExcelFile(this.inventoryexcel, 'Order Details - ' + this.startDate + ' - ' + this.endDate);
        }
        this.inventoryexcel = []
      }
    });
  }

  // Table Shorting
  sortData(event) {
    this.sortvalue = event;
    this.allorders();
  }

  ngOnDestroy() { }
}
