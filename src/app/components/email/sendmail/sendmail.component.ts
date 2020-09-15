import { Component, OnInit } from '@angular/core';

// SERVICES
import { NavService, UserInformationService } from '../../../services';
import { EmailService } from '../email.service'

// MAT DATA SOURCE FOR TABLE DATA
import { MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { PriviewComponent } from '../../../common/shared/dialogs/priview/priview.component'
// RXJS USING FOR VITUAL SCROLL
import { debounceTime, throttleTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";


@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.component.html',
  styleUrls: ['./sendmail.component.scss']
})
export class SendmailComponent implements OnInit {

  // TABLE HEADERS
  displayedColumns: string[] = ['position', 'order_id', 'subject', 'purpose_of', 'scheduled_date', 'preview'];
  dataSource = new MatTableDataSource();

  pageNo: number;
  sendData: any;
  sendData_scroll: any;
  searchValue: any;
  switchingDateFilter: any;
  customerException: any;
  htmlStr: any;
  rates: any;
  public startDate: any;
  public endDate: any;
  public maxDate: Object = new Date();
  public dateFormat: String = "dd-MMM-yyyy";
  // emailCounts:any;

  constructor(public dialog: MatDialog, private navService: NavService, public emailService: EmailService, public userService: UserInformationService, public translate: TranslateService) {
    // NAV PANEL HIDE
    this.navService.show();
  }

  ngOnInit() {
    //cards
    // this.emailService.emailCount().subscribe(res => {
    //   this.emailCounts = res;
    // })
    this.emailService.openClickRate().subscribe(res => {
      this.rates = res
    })

    this.pageNo = 1;
    this.searchValue = null;
    this.switchingDateFilter = true;
    this.emailService.sendemail(this.pageNo, this.searchValue).subscribe(res => {
      this.sendData = res;
      this.dataSource = new MatTableDataSource(this.sendData);
    })
    this.userService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })
  }

  filter(event) {
    if (event["target"]["value"].length >= 3) {
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.emailService.sendemail(this.pageNo, this.searchValue).subscribe(res => {
        this.sendData = res;
        this.dataSource = new MatTableDataSource(this.sendData)
      });
    } else if (event["target"]["value"].length == 0) {
      this.ngOnInit();
    }
  }

  // DATE RANGE PICKER
  dateRange(event) {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    if (event.endDate != null && event.startDate != null) {
      this.pageNo = 1;
      this.switchingDateFilter = false;
      this.emailService.dateFiltersent(this.startDate, this.endDate, this.pageNo).subscribe(res => {
        this.sendData = res;
        this.dataSource = new MatTableDataSource(this.sendData)
      })
    } else {
      this.ngOnInit();
    }
  }

  priview(id) {
    this.htmlStr = "";
    this.emailService.temp(id).subscribe(res => {
      this.htmlStr = res["preview"];
      this.htmlStr = this.htmlStr;

      const dialogRef = this.dialog.open(PriviewComponent, {
        width: '600px',
        height: '900px',
        data: { id: this.htmlStr }
      });

      dialogRef.afterClosed().subscribe(result => {
      });

    })
  }

  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.sendData.length == (20 * this.pageNo) && this.switchingDateFilter == true) {
        this.pageNo = this.pageNo + 1;
        this.emailService.sendemail(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.sendData_scroll = res;
          this.sendData_scroll.map(item => this.sendData.push(item));
          this.dataSource = new MatTableDataSource(this.sendData)
        })
      } else if (this.sendData.length == (20 * this.pageNo) && this.switchingDateFilter == false) {
        this.pageNo = this.pageNo + 1;
        this.emailService.dateFiltersent(this.startDate, this.endDate, this.pageNo).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.sendData_scroll = res;
          this.sendData_scroll.map(item => this.sendData.push(item));
          this.dataSource = new MatTableDataSource(this.sendData)
        })
      }
    }
  }
  
  ngOnDestroy() {
  }
}
