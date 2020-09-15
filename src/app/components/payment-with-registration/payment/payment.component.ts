import { Component, OnInit } from '@angular/core';

// RAZORPAY
declare var Razorpay: any;

// SERVICES
import { PaymentWithRegistrationService } from '../payment-with-registration.service'
import { NavService } from '../../../services'

// ROUTER
import { Router } from '@angular/router';

// COMPONENT
import { BottomSheetComponent } from '../../../common/shared';

// BOTTOM SHEET
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  userInfo: any;

  constructor(private bottomSheet: MatBottomSheet, private navService:NavService, public router: Router, private paymentService: PaymentWithRegistrationService) {
    // NAV PANEL HIDE
    this.navService.hide();
   }

  ngOnInit() {
    this.paymentService.userInfo().subscribe(res => {
      this.userInfo = res;
    });
  }

  // RAZERPAY
  payment(){
    let price = (this.userInfo['plan_info']['plan_price'] * 18)/100;
    price = Number(price)+this.userInfo['plan_info']['plan_price'];
    price = +price;
    let options = {
      // key: "rzp_test_2zcMPsPtLhvfQW", 
      key: "rzp_live_CYjClRjsBaJc3J",
      amount: price*100,    
      name: "InsightMailer",        
      description: "payment",
      prefill: {
        name: this.userInfo['first_name'],
        email: this.userInfo['email'],
        contact: this.userInfo['user_info']['phone_no']
      },
      notes: {
        address: this.userInfo['user_info']['address']
      },
      theme: {
        color: "light blue"
      },
      handler: this.paymentResponseHander.bind(this),     
    }
  
    let rzp = new Razorpay(options);
    rzp.open();
  }

  paymentResponseHander(res: object){
    let plans:object = {'razorpay_payment_id': res["razorpay_payment_id"], 'plan_id': this.userInfo['plan_info']['id']}
    this.paymentService.paymentId(plans).subscribe(res => {
      if(res["message"] == "Payment Successfull"){
        this.router.navigate(['marketplace']);
      }
    });
  }
  
  // BOTTON SHEET
  moreDetails(plan): void {
    this.bottomSheet.open(BottomSheetComponent, 
      {
        data:plan,
        disableClose: true
      });
  }
  ngOnDestroy() {
  }
}
