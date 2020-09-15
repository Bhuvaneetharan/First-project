import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// SERVICES
import { NavService } from '../../../../services'
import { CampaignsService } from '../../campaigns.service'
import { NotifierService } from 'angular-notifier';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// SHARES
import { SnackBar, AsinsComponent, CampaignSendToComponent } from '../../../../common/shared';
import { MatDialog } from '@angular/material/dialog';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { from } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-create-promotion',
  templateUrl: './create-promotion.component.html',
  styleUrls: ['./create-promotion.component.scss']
})
export class CreatePromotionComponent implements OnInit {
  private readonly notifier: NotifierService;

  channels: string[] = ['All', 'AFN', 'MFN'];
  promotionTypes: string[] = ['Top Product Customers', 'Geo Customers', 'Customers purchased in specific period'];
  channelSettings: string = '';
  promotionType: string = '';
  ckeConfig: any;
  ckeditordata: string = '';
  promotionTitle = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  subject = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  couponCode = new FormControl('', [Validators.required])
  promotion_type: any;
  dateTime: any;
  count: number;
  startDate: any = "";
  endDate: any = "";
  selectedAsins: string[] = [];
  promoTypeAsin: any = [];
  promoStartDate: any = "";
  promoEndDate: any = "";
  couponEnable: boolean = false;
  promotionId: any;
  constructor(public dialog: MatDialog, public campaginService: CampaignsService, public snackbars: SnackBar, public router: Router, private navService: NavService, private campaignService: CampaignsService, private location: Location, public notifierService: NotifierService, public route: ActivatedRoute, private datePipe: DatePipe) {
    this.promotionId = this.route.snapshot.queryParamMap.get('id')
    // NAV PANEL HIDE
    this.notifier = notifierService;
    this.navService.hide();
  }

  ngOnInit() {
    this.ckeConfig = {
      height: 400,
      uiColor: "#ebebeb",
      language: "en",
      allowedContent: true,
      fullPage: true,
      toolbar: [
        { name: "documenthandling", items: ["imageExplorer"] },
        { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', '-'] },
        { name: "insert", items: ["Image"] },
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike"] },
        { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Undo', 'Redo'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor", "Font"] },
      ],
      extraPlugins: 'justify,font,colorbutton,panelbutton,link',
    };
    this.ckeConfig.removePlugins = 'resize';
    this.setValues()
    // this.promo_check()
  }
  promo_check() {
    if (this.promotionId == null) {
      this.campaginService.promo_status().subscribe(res => {
        if (res == true) {
          Swal.fire({
            title: 'Would you like to retrieve data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              this.campaginService.promo_retrieve().subscribe(res => {
                this.selectedAsins.push(res['campaign_target'])
                this.promotionTitle = new FormControl(res['promo_name']);
                this.channelSettings = res['channel_setting']
                this.count = res['campaign_target'].length
                this.couponCode = new FormControl(res['coupon_code'])
                this.dateTime = res['mail_date']
                this.startDate = this.datePipe.transform(res['valid_from'], 'dd/MMM/yyyy')
                this.endDate = this.datePipe.transform(res['valid_to'], 'dd/MMM/yyyy')
                this.ckeditordata = res['template']
                this.promotionType = res['promotion_type']
                this.promoTypeAsin = res['promotion_item'][0]
              })
            }
          })
        }
      })
    }
  }
  setValues() {
    if (this.promotionId != null) {
      this.campaginService.editPromotion(this.promotionId).subscribe(res => {
        if (res['coupon_code'] != null) {
          this.couponEnable = true;
        }
        this.selectedAsins = res['campaign_target']
        this.promotionTitle = new FormControl(res['promo_name']);
        this.subject = new FormControl(res['subject']);
        this.channelSettings = res['channel_setting']
        this.count = res['campaign_target'].length
        this.couponCode = new FormControl(res['coupon_code'])
        this.dateTime = res['mail_date']
        this.startDate = this.datePipe.transform(res['valid_from'], 'dd/MMM/yyyy')
        this.endDate = this.datePipe.transform(res['valid_to'], 'dd/MMM/yyyy')
        this.ckeditordata = res['template']
        this.promotionType = res['promotion_type']
        // if(res['promotion_item'][]){

        // }
        this.promoTypeAsin = res['promotion_item'][0]
      })

    }
  }

  selectAsins() {
    const dialogRef = this.dialog.open(AsinsComponent, {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { 'asins': this.selectedAsins, 'chennal_settings': this.channelSettings }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.ckeditordata = result['html']['template'];
        this.count = result['count']
        this.selectedAsins = result['asins'];
      }
    });
  }

  toggle(event) {
    if (event == true) {
      this.couponEnable = true;
    } else if (event == false) {
      this.couponCode = new FormControl('');
      this.startDate = '';
      this.endDate = '';
      this.couponEnable = false;
    }
  }
  datetimePicker(event) {
    this.dateTime = event['value']
  }

  confirm() {
    if (this.promotionTitle['value'] != "") {
      if (this.channelSettings != "") {
        if (this.subject['value'] != "") {
          if (this.ckeditordata.length > 61) {
            // if(this.promoTypeAsin != undefined){
            let data = {
              'promotion_name': this.promotionTitle['value'],
              'promotion_title': this.subject['value'],
              'channel_settings': this.channelSettings,
              'coupon_code': this.couponCode['value'],
              'coupon_startdate': this.startDate,
              'coupon_endDate': this.endDate,
              'frequncey_date_time': this.dateTime,
              'template': this.ckeditordata,
              'promotion_type': this.promotionType,
              'customer_base_promotion': this.promoTypeAsin,
              'proStartDate': this.promoStartDate,
              'promoEndDate': this.promoEndDate,
              'asins': this.selectedAsins,
              'key': true
            }
            if (this.promotionId == null) {
              this.campaginService.sent_promotion(data).subscribe(res => {
                if (res == true) {
                  this.router.navigate(['/campaigns//promotion/promotionlist'])
                }
              })
            } else {
              this.campaginService.updatePromotion(this.promotionId, data).subscribe(res => {
                if (res['key'] == true) {
                  this.notifier.notify("info", res['message']);
                  this.router.navigate(['/campaigns//promotion/promotionlist'])
                }
              })
            }
            // }else{
            //   this.notifier.notify("error","Please choose customer base promotion before proceeding");
            // }
          } else if (this.ckeditordata.length <= 61) {
            this.notifier.notify("error", "Message Content cannot be empty");
          }
        } else {
          this.notifier.notify("error", "Subject Connot be empty");
        }
      } else {
        this.notifier.notify("error", "Please select channel settings before proceeding");
      }
    } else {
      this.notifier.notify("error", "Promotion Title cannot be empty");
    }
  }

  dateRange(event) {
    if (event.endDate != null && event.startDate != null) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
    } else {
      this.startDate = "";
      this.endDate = "";
    }
  }
  promoDateRange(event) {
    if (event.endDate != null && event.startDate != null) {
      this.promoStartDate = event.startDate;
      this.promoEndDate = event.endDate;
      this.promoTypeAsin.push({'promo_start_date':this.promoStartDate, 'promo_end_date':this.promoEndDate})
    } else {
      this.promoStartDate = "";
      this.promoEndDate = "";
    }
  }

  sendCutomers(event) {
    this.promotion_type = event
    if (event != "Customers purchased in specific period") {
      this.promoStartDate = "";
      this.promoEndDate = "";
      const dialogRef = this.dialog.open(CampaignSendToComponent, {
        panelClass: 'custom-dialog-container',
        disableClose: true,
        data: {
          'sendCustomer': this.promotion_type,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.length != 0) {
          this.promoTypeAsin.push({'data':result})
        }
      });
    } else {
      this.promoTypeAsin = [];
    }
  }
  back() {
    // if (this.promotionId == null) {
    //   let data = {
    //     'promotion_title': this.promotionTitle['value'],
    //     'channel_settings': this.channelSettings,
    //     'coupon_code': this.couponCode['value'],
    //     'coupon_startdate': this.startDate,
    //     'coupon_endDate': this.endDate,
    //     'frequncey_date_time': this.dateTime,
    //     'template': this.ckeditordata,
    //     'promotion_type': this.promotionType,
    //     'customer_base_promotion': this.promoTypeAsin,
    //     'proStartDate': this.promoStartDate,
    //     'promoEndDate': this.promoEndDate,
    //     'asins': this.selectedAsins,
    //     'key': false
    //   }
    //   this.campaginService.sent_promotion(data).subscribe()
    // }
    // localStorage.clear()
    this.router.navigate(['/campaigns//promotion/promotionlist'])
  }

  reset() {
    this.promoTypeAsin = [];
  }
}
