import { Component, OnInit } from '@angular/core';
// SERVICE
import { NavService } from '../../../services';
import { InvoicesService } from '../invoices.service'

// TABLE DATA SOURCE
import { MatTableDataSource } from '@angular/material';

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  // TABLE HEADERS
  displayedColumns: string[] = ['s.no', 'email', 'invoices', 'startdate', 'enddate', 'downloads'];

  // TABLE DATA
  dataSource = new MatTableDataSource();

  pageNo: number;

  // DATAs
  invoicesData: any;
  invoicesDownload: any;
  invoices_scroll: any;
  browse: any;

  constructor(public navService: NavService, private invoiceService: InvoicesService, public translate: TranslateService) {
    // NAV HIDE SHOW
    this.navService.show();
  }

  ngOnInit() {
    this.invoiceService.invoices().subscribe(res => {
      this.invoicesData = res;
      this.dataSource = new MatTableDataSource(this.invoicesData)
    })
  }

  // INVOICE DOWNLOAD
  invoicesDownloads(inv_no) {
    const browsername = window.navigator.userAgent;;
    let browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };
    for (var key in browsers) {
      if (browsers[key].test(browsername)) {
        this.browse = browsers[key];
      }
    }
    this.invoiceService.invoicesDownload(inv_no).subscribe(res => {
      this.invoicesDownload = res;
      if (this.browse == "/firefox/i") {
        // Mozila firebox
        window.open('data:application/pdf;base64,' + this.invoicesDownload)
      } else {
        const linkSource = 'data:application/pdf;base64,' + this.invoicesDownload;
        const downloadLink = document.createElement("a");
        const fileName = inv_no;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }
    })
  }

  // VITRUAL SCROLL
  onScroll(event) {
    this.pageNo = 1;
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.invoicesData.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.invoiceService.invoices().pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.invoices_scroll = res;
          this.invoices_scroll.map(item => this.invoicesData.push(item));
          this.dataSource = new MatTableDataSource(this.invoicesData)
        })
      }
    }
  }
  ngOnDestroy() {
  }
}
