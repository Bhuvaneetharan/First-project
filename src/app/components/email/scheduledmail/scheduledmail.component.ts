import { Component, OnInit } from '@angular/core';

// SERVICES
import { NavService, UserInformationService } from '../../../services'
import { EmailService } from '../email.service'

// MAT DATA SOURCE FOR TABLE DATA
import { MatTableDataSource } from '@angular/material';

// RXJS USING FOR VITUAL SCROLL
import { debounceTime, throttleTime } from 'rxjs/operators';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-scheduledmail',
  templateUrl: './scheduledmail.component.html',
  styleUrls: ['./scheduledmail.component.scss']
})
export class ScheduledmailComponent implements OnInit {
  scheduleData: any;
  pageNo: number;
  searchValue: any;
  scheduleData_scroll: any;
  switchingDateFilter: boolean;
  customerException: any;
  public startDate: any;
  public endDate: any;
  public dateFormat: String = "dd-MMM-yyyy";
  public maxDate: Object = new Date();

  // TABLE HEADERS
  displayedColumns: string[] = ['position', 'order_id', 'subject', 'purpose_of', 'scheduled_date', 'email'];
  dataSource = new MatTableDataSource();

  constructor(private navService: NavService, public emailService: EmailService, public userService: UserInformationService, public translate: TranslateService) {
    // NAV PANEL HIDE
    this.navService.show();
  }

  ngOnInit() {
    this.pageNo = 1;
    this.searchValue = null;
    this.switchingDateFilter = true;
    this.emailService.schedulemail(this.pageNo, this.searchValue).subscribe(res => {
      this.scheduleData = res;
      this.dataSource = new MatTableDataSource(this.scheduleData);
    })
  }

  filter(event) {
    if (event["target"]["value"].length >= 3) {
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.emailService.schedulemail(this.pageNo, this.searchValue).subscribe(res => {
        this.scheduleData = res;
        this.dataSource = new MatTableDataSource(this.scheduleData)
      });
    } else if (event["target"]["value"].length == 0) {
      this.ngOnInit();
    }
    this.userService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })
  }

  // DATE RANGE PICKER
  dateRange(event) {
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    if (event.endDate != null && event.startDate != null) {
      this.pageNo = 1;
      this.switchingDateFilter = false;
      this.emailService.dateFiltershedule(this.startDate, this.endDate, this.pageNo).subscribe(res => {
        this.scheduleData = res;
        this.dataSource = new MatTableDataSource(this.scheduleData)
      })
    } else {
      this.ngOnInit();
    }
  }

  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.scheduleData.length == (20 * this.pageNo) && this.switchingDateFilter == true) {
        this.pageNo = this.pageNo + 1;
        this.emailService.schedulemail(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.scheduleData_scroll = res;
          this.scheduleData_scroll.map(item => this.scheduleData.push(item));
          this.dataSource = new MatTableDataSource(this.scheduleData)
        })
      } else if (this.scheduleData.length == (20 * this.pageNo) && this.switchingDateFilter == false) {
        this.pageNo = this.pageNo + 1;
        this.emailService.dateFiltershedule(this.startDate, this.endDate, this.pageNo).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.scheduleData_scroll = res;
          this.scheduleData_scroll.map(item => this.scheduleData.push(item));
          this.dataSource = new MatTableDataSource(this.scheduleData)
        })
      }
    }
  }
  
  ngOnDestroy() {}
}
