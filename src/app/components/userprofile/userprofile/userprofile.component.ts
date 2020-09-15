import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

// SERVICES
import { NavService, AuthenticationService } from '../../../services'
import { UserprofileService } from '../userprofile.service'
import { NotifierService } from 'angular-notifier';

// SHARES
import { KeyPress, Patterns } from '../../../common/shared';

import { Router } from '@angular/router';

// MAT DIALOG
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { PasswordStrengthValidator } from 'src/app/common/shared/custom-validator';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
  private readonly notifier: NotifierService;

  // FORM GROUP
  profileForm: FormGroup;
  loader:boolean = false;
  states:any = ["Andaman and Nicobar Islands","Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadar and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadeep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"]
  testing: any;
  testing1: any;
  testing2: any;
  testing3: any;
  testing4: any;
  changeEnable:boolean = true;
  constructor(public notifierService: NotifierService, public dialog: MatDialog, public pattern: Patterns, public keypress: KeyPress, private navService: NavService, private userprofileService: UserprofileService, public translate: TranslateService) {
    this.notifier = notifierService;
    this.navService.show();
  }

  ngOnInit() {

    // FORM GROUP
    this.profileForm = new FormGroup({
      sellerName: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(this.pattern.onlyNumbers), Validators.pattern(this.pattern.dontAllowSpaces)]),
      companyName: new FormControl('', [Validators.required]),
      gstIn: new FormControl('', [Validators.required, Validators.pattern(/^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/g)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),
    });
    this.userInfo();
  }

  // USER DATA SET
  userInfo() {
    this.userprofileService.userProfile().subscribe(res => {
      this.profileForm.setValue({
        sellerName: res[0]["amazon_seller_name"],
        name: res[0]["name"],
        email: res[0]["email"],
        mobileNo: res[0]["address_book"]["phone_no"],
        companyName: res[0]["company_name"],
        gstIn: res[0]["address_book"]["gst_no"],
        address: res[0]["address_book"]["address"],
        city: res[0]["address_book"]["city"],
        country: res[0]["address_book"]["country"],
        state: res[0]["address_book"]["state"],
        pincode: res[0]["address_book"]["pincode"],
      });
    });
  }

  // USER DATA UPDATE
  update(profileForm) {
    if (profileForm["valid"] == true) {
      let updatedProfile: object = {
        'amazon_seller_name': this.profileForm["value"]["sellerName"],
        'name': this.profileForm["value"]["name"],
        'company_name': this.profileForm["value"]["companyName"],
        'gst_no': this.profileForm["value"]["gstIn"],
        'phone_no': this.profileForm["value"]["mobileNo"],
        'address': this.profileForm["value"]["address"],
        'city': this.profileForm["value"]["city"],
        'state': this.profileForm["value"]["state"],
        'country': this.profileForm["value"]["country"],
        'pincode': this.profileForm["value"]["pincode"]
      }
      this.userprofileService.updateProfile(updatedProfile).subscribe(res => {})
      this.changeEnable = true;
    } else {
      this.notifier.notify("error","Fill the required profile details to proceed.");
      // this.snackbars.snackbars("error","Fill the required profile details to proceed.");
    }
  }

  // SEND PINCODE
  pincode(event: string) {
    let pincode = { pincode: event };
    this.userprofileService.pincode(pincode).subscribe(res => {
      if (res["Key"] != false) {
        this.profileForm.patchValue({
          city: res["district_name"],
          state: res["state"],
          country: 'India',
        });
      } else {
        this.profileForm.controls['country'].reset();
        this.profileForm.controls['city'].reset();
        this.profileForm.controls['state'].reset();
      }
    });
  }

  //FIRST CHARACTER AS SPACE NOT ALLOWED
  firstnoSpace(e){
    if (e.keyCode == 32 && !this.testing){  
        e.preventDefault();
    }else{
      this.testing = e['srcElement']['value']
    }
  }

  firstnoSpaceCompany(e){
    if (e.keyCode == 32 && !this.testing1){  
        e.preventDefault();
    }else{
      this.testing1 = e['srcElement']['value']
    }
  }

  firstnoSpaceAddress(e){
    if (e.keyCode == 32 && !this.testing2){  
      e.preventDefault();
    }else{
      this.testing2 = e['srcElement']['value']
    }
  }

  firstnoSpaceCountry(e){
    if (e.keyCode == 32 && !this.testing3){  
      e.preventDefault();
    }else{
      this.testing3 = e['srcElement']['value']
    }
  }

  firstnoSpaceCity(e){
    if (e.keyCode == 32 && !this.testing4){  
      e.preventDefault();
    }else{
      this.testing4 = e['srcElement']['value']
    }
  }

  buttonEnable(){
    this.changeEnable = false
  }
  // PASSWORD CHANGE DIALOG OPEN
  // changePassword() {
  //   const dialogRef = this.dialog.open(changePassword, {
  //     width: '300px',
  //     disableClose: true
  //   });
  // }
  ngOnDestroy() {
  }
}
