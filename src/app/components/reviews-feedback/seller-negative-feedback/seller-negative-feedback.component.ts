import { Component, OnInit } from '@angular/core';

// SERVICES
import { NavService, UserInformationService } from '../../../services';
import { ReviewFeedbackService } from '../review-feedback.service'
import { debounceTime, throttleTime } from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import { CkeditorTagsComponent } from '../../../common/shared'

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-seller-negative-feedback',
  templateUrl: './seller-negative-feedback.component.html',
  styleUrls: ['./seller-negative-feedback.component.scss']
})
export class SellerNegativeFeedbackComponent implements OnInit {

  pageNo: number;

  // DATA
  sellerFeedback: any;
  sellerFeedback_scroll: any;
  searchValue: any;
  customerException:any;

  // SEARCH BOX ID
  noSellerFeedback:any;

  constructor(public dialog: MatDialog, public navService: NavService, public reviewService: ReviewFeedbackService, public userServies:UserInformationService, public translate: TranslateService) {
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
    this.userServies.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })
    this.allfeedback();
  }

  allfeedback() {
    this.pageNo = 1;
    this.searchValue = null;
    this.reviewService.sellerFeedback(this.pageNo, this.searchValue).subscribe(res => {
      this.sellerFeedback = res;
    })
  }

  // VITRUAL SCROLL
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.sellerFeedback.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.reviewService.sellerFeedback(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.sellerFeedback_scroll = res;
          this.sellerFeedback_scroll.map(item => this.sellerFeedback.push(item));
        })
      }
    }
  }

  ckeditor(orderId){
    const dialogRef = this.dialog.open(CkeditorTagsComponent, { 
      panelClass: 'sent_mail',
      disableClose: true,
      data:{"order": orderId}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit()
    });
  }

  ngOnDestroy() {}
}
