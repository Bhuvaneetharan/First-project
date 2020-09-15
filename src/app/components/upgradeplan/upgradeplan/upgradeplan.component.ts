import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

// SERVICE
import { UpgradeplanService } from '../upgradeplan.service'
import { NavService, UserInformationService } from '../../../services';
import { DatePipe } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

// RAZORPAY
declare var Razorpay: any;

@Component({
  selector: 'app-upgradeplan',
  templateUrl: './upgradeplan.component.html',
  styleUrls: ['./upgradeplan.component.scss']
})

export class UpgradeplanComponent implements OnInit {
 
  monthly:any;
  bi:any;
  threeMonths: any;
  annual:any;
  userInfo:any;
  days:any;
  currentDate:any = new Date();
  expiryDate:any;
  constructor(private datePipe: DatePipe,public userService: UserInformationService, private upgradeplan: UpgradeplanService, private navService: NavService, public translate: TranslateService) { 
    // SIDE NAV HIDE OR SHOW
    this.navService.show()
  }

  ngOnInit() {
    this.userService.daysLeft().subscribe(res => {
      this.days = res['days']
      this.currentDate.setDate(this.currentDate.getDate() + this.days);
      this.expiryDate = this.datePipe.transform(this.currentDate, 'dd-MMM-yyyy');
    })
    this.plansmethod("Monthly Plan");
  }

  plansmethod(event?){ 
    console.log(event)
    this.upgradeplan.upgradeplan().subscribe(res => {
      this.userInfo = res;
      this.monthly = res['plan'][event]; 
      // this.threeMonths = res['plan']['3-months'];
      // this.bi = res['plan']["Bi-Annual"];
      // this.annual = res['plan']["Annual Plan"];
    })
  }

  // RAZERPAY
  upgradePlan(plan){
    let price = (plan["plan_price"] * 18)/100;
    price = Number(price)+plan["plan_price"];
    price = +price;
    let options = { 
      // key: "rzp_test_2zcMPsPtLhvfQW",
      // key: "rzp_test_CrsK4aY7eiCbdB",
      key: "rzp_live_hTfpIvgxI0WnDl",
      // key: "rzp_live_CYjClRjsBaJc3J",
      amount: Number(price)*100,    
      name: "InsightMailer",        
      description: "payment",
      prefill: {
        name: this.userInfo["name"],
        email: this.userInfo["email"],
        contact: this.userInfo['user_details']["phone_no"]
      },
      notes: {
        address: this.userInfo['user_details']["address"]
      },
      theme: {
        color: "light blue"
      },
      handler: this.paymentResponseHander.bind(this, plan),     
    }
  
    let rzp = new Razorpay(options);
    rzp.open();
  }

  // AFTER PAYMENT
  paymentResponseHander(res: object, plan){ 
    let plans:object = {'razorpay_payment_id': plan["razorpay_payment_id"], 'plan_id':res["id"]}
    this.upgradeplan.paymentId(plans).subscribe(res => {
      if(res["key"] == true){
       this.userService.userStatus().subscribe(res => {
        let auth = { "marketpalce": res["status_seller"], "cus_status": res["status_subscription"], "cus_reg": res["status_address"] };
        localStorage.setItem("authentication", JSON.stringify(auth));
       })
      }
    });
  }
  
  ngOnDestroy() {}

}