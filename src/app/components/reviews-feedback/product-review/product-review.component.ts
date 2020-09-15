import { Component, OnInit } from '@angular/core';

// SERVICES
import { NavService } from '../../../services'
import { ReviewFeedbackService } from '../review-feedback.service';

// DIALOG
import { MatDialog } from '@angular/material/dialog';

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';

// COMPONENT
import { DialogComponent, SnackBar } from '../../../common/shared'
import { PageEvent } from '@angular/material/paginator';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import Swal from 'sweetalert2'
//ACTIVATED ROUTE
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router'
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [10];
  // MatPaginator Output
  public selectedVal: string;
  pageEvent: PageEvent;
  //PAGE NO
  pageNo: number;
  // DATA
  count: any;
  asinsPush: any = [];
  selectedAsins: any;
  productReviews: any;
  productReviews_scroll: any;
  customerException: any;
  feedbackcheck: any = 'All';
  productsCount: any;
  reviews: any;
  stylehide: number = 1
  reviewCount: any;
  // Total or Unread
  reviewtype: any = 'total'
  //DASHBOARD PRODUCT REVIEW ASIN
  dashboardASIN: any;
  //DASHBOARD PRODUCT REVIEW DAYS SELECTED
  dashboardDates: any;
  constructor(public snackbars: SnackBar, public dialog: MatDialog, private navService: NavService, private feedbackService: ReviewFeedbackService, public route: ActivatedRoute, public router: Router, public translate: TranslateService) {
    // NAV PANEL HIDE
    this.navService.show();
    //DASHBOARD PRODUCT REVIEW ASIN
    this.dashboardASIN = this.route.snapshot.queryParamMap.get('asin');
    //DASHBOARD PRODUCT REVIEW DAYS SELECTED
    this.dashboardDates = this.route.snapshot.queryParamMap.get('dates');

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

    this.selectedVal = 'tot_count';

    if (this.dashboardASIN == null) {
      this.asinsPush = [];
      this.pageNo = 1;

      // Product total,unread count
      this.feedbackService.reviewcountunread().subscribe(res => {
        this.count = res
      })

      // Get the total selected ASIN's list
      this.feedbackService.seletedAsins(this.reviewtype).subscribe(res => {
        this.selectedAsins = res;
        this.selectedAsins.map(result => this.asinsPush.push(result["asin"]))

        let data = { page: this.pageNo, asin: this.asinsPush, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
        // Product Reviews
        this.feedbackService.prodectReviews(data).subscribe(res => {
          this.productReviews = res;
          this.length = res["count"]
        });
        // Product review count for All,Pasitive,Negative
        this.feedbackService.reviewCount(this.asinsPush, this.dashboardDates).subscribe(res => {
          this.reviewCount = res;
        })
      });
    } else {
      this.pageNo = 1;
      // Product total,unread count
      this.feedbackService.reviewcountunread().subscribe(res => {
        this.count = res
        // Get the total selected ASIN's list
        this.feedbackService.seletedAsins(this.reviewtype).subscribe(res => {
          this.selectedAsins = res;
          // this.selectedAsins.map(result => this.asinsPush.push(result["asin"]))

          let data = { page: this.pageNo, asin: this.dashboardASIN, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
          // Product Reviews
          this.feedbackService.prodectReviews(data).subscribe(res => {
            this.productReviews = res;
            this.length = res["count"]
          });
          // Product review count for All,Pasitive,Negative
          this.feedbackService.reviewCount(this.dashboardASIN, this.dashboardDates).subscribe(res => {
            this.reviewCount = res;
          })
        });
      })
    }

  }
  backToDashboard() {
    // console.log(this.dashboardDates)
    this.router.navigate(['/dashboard'], { queryParams: { dates: this.dashboardDates } })
  }

  // Switching Total or Unread
  asinList(data) {
    this.asinsPush = [];
    this.feedbackcheck = "All";
    this.reviewtype = data;
    this.dashboardASIN = null;
    this.feedbackService.reviewcountunread().subscribe(res => {
      this.count = res
    })
    if (this.reviewtype == 'total') {
      this.stylehide = 1
      this.feedbackService.seletedAsins(data).subscribe(res => {
        this.selectedAsins = res;
        this.selectedAsins.map(result => this.asinsPush.push(result["asin"]))
        let datas = { page: this.pageNo, asin: this.asinsPush, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
        this.feedbackService.prodectReviews(datas).subscribe(res => {
          this.productReviews = res;
          this.length = res["count"]
        });
        this.feedbackService.reviewCount(this.asinsPush, this.dashboardDates).subscribe(res => {
          this.reviewCount = res;
        })
      });
    } else {
      this.stylehide = 0
      this.feedbackService.seletedAsins(data).subscribe(res => {
        this.selectedAsins = res;
        this.reviews = res["product_reviews"]
        this.selectedAsins.map(result => this.asinsPush.push(result["asin"]))
        let datas = { page: this.pageNo, asin: this.asinsPush, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }

        this.feedbackService.prodectReviews(datas).subscribe(res => {
          this.productReviews = res;
          this.length = res["count"]
        });

        this.feedbackService.reviewCount(this.asinsPush, this.dashboardDates).subscribe(res => {
          this.reviewCount = res;
        })
      });
    }
  }
  //Remove All ASINs
  removeAllAsin() {
    this.feedbackService.asinDelete(this.asinsPush).subscribe(res => {
      if (res['key'] == true) {
        this.ngOnInit();
      }
    })
  }

  // Pagination
  pagination(event) {
    this.pageNo = event.pageIndex + 1;
    let data = { page: this.pageNo, asin: this.asinsPush, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
    this.feedbackService.prodectReviews(data).subscribe(res => {
      this.productReviews = res;
      this.length = res["count"]
    });
  }

  // Pagination
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  // Switch All,Positive Negative
  radioSelect(event) {
    if (this.dashboardASIN == null) {
      let data = { page: this.pageNo, asin: this.asinsPush, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
      this.feedbackService.prodectReviews(data).subscribe(res => {
        this.productReviews = res;
        this.length = res["count"]
      });
      this.feedbackService.reviewCount(this.asinsPush, this.dashboardDates).subscribe(res => {
        this.reviewCount = res;
      })
    } else {
      let data = { page: this.pageNo, asin: this.dashboardASIN, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
      this.feedbackService.prodectReviews(data).subscribe(res => {
        this.productReviews = res;
        this.length = res["count"]
      });
      this.feedbackService.reviewCount(this.dashboardASIN, this.dashboardDates).subscribe(res => {
        this.reviewCount = res;
      })
    }

  }

  // ASINS DELETE
  asinDelete(asin) {
    this.asinsPush = []
    this.asinsPush.push(asin)

    this.feedbackService.asinDelete(this.asinsPush).subscribe(res => {
      if (res['key'] == true) {
        this.ngOnInit();
      }
    })
  }

  // Single Asin Select
  selectAsins(asins) {
    this.asinsPush = []
    this.asinsPush.push(asins)
    let data = { page: this.pageNo, asin: asins, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
    this.feedbackService.prodectReviews(data).subscribe(res => {
      this.productReviews = res;
      this.length = res["count"]
    });

    this.feedbackService.seletedAsins(this.reviewtype).subscribe(res => {
      this.selectedAsins = res;
      this.reviews = res["product_reviews"]
    });

    this.feedbackService.reviewCount(asins, this.dashboardDates).subscribe(res => {
      this.reviewCount = res
    })
    this.feedbackService.reviewcountunread().subscribe(res => {
      this.count = res
    })
  }

  // Take Action
  review_active(id) {
    this.feedbackService.reviewAction(id).subscribe(res => {
      let data = { page: this.pageNo, asin: this.asinsPush, 'review': this.feedbackcheck, 'data': this.reviewtype, 'days': this.dashboardDates }
      this.feedbackService.prodectReviews(data).subscribe(res => {
        this.productReviews = res;
        this.length = res["count"]
      });
    })
  }

  // DIALOG
  openDialog(): void {
    if (this.customerException != "Trail") {
      const dialogRef = this.dialog.open(DialogComponent,
        {
          height: '',
          panelClass: 'custom-dialog-container',
          disableClose: true
        });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit()
      });
    } else {
      this.snackbars.snackbars("info", "You are using the Trial pack. Upgrade to the premium plans.");
    }
  }

  ngOnDestroy() {
  }
}