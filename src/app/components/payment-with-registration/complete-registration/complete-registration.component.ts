import { Component, OnInit } from '@angular/core';

// FORMS
import { FormGroup, FormControl, Validators } from '@angular/forms';

// SERVICES
import { PaymentWithRegistrationService } from '../payment-with-registration.service'
import { NavService, AuthenticationService } from '../../../services'

// SHARES
import { KeyPress, Patterns, SnackBar } from '../../../common/shared';

// ROUTER
import { Router } from '@angular/router';

// BOTTOM SHEET
import { MatBottomSheet } from '@angular/material/bottom-sheet';

// COMPONENT
import { BottomSheetComponent } from '../../../common/shared/bottom-sheet/bottom-sheet.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {

  // FORM GROUP
  registerForm: FormGroup;
  states:any = ["Andaman and Nicobar Islands","Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadar and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadeep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"]
  // CHECK BOX
  checkedValue: boolean = false;
  id:number=0;
  // PLANS
  monthly: any;
  annual:any;
  bi:any;
  selectedValue:any="2500";
  plan:any;
  checkBox = [
    {label: 'monthly' ,checked:false},
    {label: 'bi-annual',checked:false},
    {label: 'annual', checked:false},
   
];
  testing1: any;
  testing2: any;
  testing3: any;
  testing4: any;
 

  constructor(public authService: AuthenticationService, private bottomSheet: MatBottomSheet, private navService: NavService, public router: Router, private snackbars: SnackBar, public pattern: Patterns, public keypress: KeyPress, private paymentService: PaymentWithRegistrationService) {
    // NAV PANEL HIDE
    this.navService.hide();
  }

 

  ngOnInit() {

    // FORM GROUP
    this.registerForm = new FormGroup({
      companyName: new FormControl('', Validators.required),
      gstNumber: new FormControl('', [Validators.required, Validators.pattern(this.pattern["gstPattern"])]),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      pincode: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)])
    });

    // // PLANS
    // this.paymentService.plans().subscribe(res => {
    //   this.monthly = res["Monthly Plan"];
    //   this.bi = res["BI Annual Plan"][0];
    //   this.annual = res["Annual Plan"][0];
    //   // console.log(this.monthly[0].email_limit)
    //   this.plan = this.monthly.find(x => x.email_limit ===  this.monthly[0].email_limit);
    // });
    
  }
  //  getDimensionsByFind(id){
  //   return this.test.annual.find(x => x.email_count === "100000");
  //   }
  //   test = this.getDimensionsByFind("100000");
  //   console.log(test);

  checkSelected(label: string,planid) {
    
    // console.log(label)
    this.checkBox.forEach(x => {
      // console.log(x)
        if(x.label !== label) {
            x.checked = !x.checked
            this.checkedValue=x.checked;
            this.id=planid;
        }
    })
 }
   changeplans(count){
    this.plan = this.monthly.find(x => x.email_limit === count);
   
   }

   firstnoSpace(e){
    if (e.keyCode == 32 && !this.testing1){  
      e.preventDefault();
    }else{
      this.testing1 = e['srcElement']['value']
    }
  }

  firstnoSpaceCountry(e){
    if (e.keyCode == 32 && !this.testing2){  
      e.preventDefault();
    }else{
      this.testing2 = e['srcElement']['value']
    }
  }

  firstnoSpaceCity(e){
    if (e.keyCode == 32 && !this.testing3){  
      e.preventDefault();
    }else{
      this.testing3 = e['srcElement']['value']
    }
  }

  firstnoSpaceAddress(e){
    if (e.keyCode == 32 && !this.testing4){  
      e.preventDefault();
    }else{
      this.testing4 = e['srcElement']['value']
    }
  }

  // SEND PINCODE
  pincode(event: string) {
    let pincode = { pincode: event };
    this.paymentService.pincode(pincode).subscribe(res => {
      if (res["Key"] != false) {
        this.registerForm.patchValue({
          city: res["district_name"],
          state: res["state"],
          country: 'India',
        });
      } else {
        this.registerForm.controls['country'].reset();
        this.registerForm.controls['city'].reset();
        this.registerForm.controls['state'].reset();
      }
    });
  }

  // SELECT PLANS
  // selectPlans(event, id: number) {
  //   if (event.checked) {
  //     this.id = id;
  //   } else {
  //     this.id = 0;
  //   }
  // }

  // REGISTRATION
  register(regValue: FormGroup) {

    // KEY MODIFIED
    let registerValues = {
      'company_name': regValue["value"]["companyName"],
      'gst_no': regValue["value"]["gstNumber"],
      'address': regValue["value"]["address"],
      'city': regValue["value"]["city"],
      'state': regValue["value"]["state"],
      'country': regValue["value"]["country"],
      'pincode': regValue["value"]["pincode"],
      'id': this.id,
    };

    // VALIDATE AND SEND DATA
    if (regValue["valid"]) {
      
        this.paymentService.register(registerValues).subscribe(res => {
          if (res["key"] == true) {
            this.router.navigate(['marketplace']);
          }
        })
      
    } else {
      this.snackbars.snackbars("error","Please fill mandatory fields");
    }
  }
  moreDetails(plan): void {
    this.bottomSheet.open(BottomSheetComponent, { data: plan });
  }

  logout() {
    this.authService.logout();
    this.router.navigate([''])
  }

  ngOnDestroy() {
  }
}
