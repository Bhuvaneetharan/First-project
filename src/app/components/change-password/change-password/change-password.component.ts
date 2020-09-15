import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// SERVICES
import { NavService, AuthenticationService } from '../../../services'
import { UserprofileService } from '../../userprofile/userprofile.service'
import { NotifierService } from 'angular-notifier';

import { Location } from '@angular/common';

// SHARES
import { KeyPress, Patterns } from '../../../common/shared';

import { Router } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { PasswordStrengthValidator } from 'src/app/common/shared/custom-validator';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  private readonly notifier: NotifierService;
  // FORM GROUP
  changePasswordForm: FormGroup;
  passwordChanged: boolean = false;
  hide: boolean = true;
  confirmation: boolean = false;
  showInfo: boolean = false;
  buttonEnable: boolean = false;
  correctPassword: boolean = false;

  constructor(public authService: AuthenticationService, private location: Location, public formBuilder: FormBuilder, public router: Router, private navService: NavService, public notifierService: NotifierService, public keypress: KeyPress, public pattern: Patterns, private userprofileService: UserprofileService, public translate: TranslateService) {
    this.notifier = notifierService;
    this.navService.show();
  }

  ngOnInit() {

    // FORM GROUP
    this.changePasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordStrengthValidator, Validators.minLength(8), Validators.maxLength(15)]],
      confirmPassword: [{ value: '', disabled: true }, [Validators.required, PasswordStrengthValidator, Validators.minLength(8), Validators.maxLength(15)]]
    }, {
        validator: [this.passwordValidator, this.CheckPassword]
      });
  }
  passwordValidator(changePasswordForm: FormGroup) {
    if (changePasswordForm.get('confirmPassword').value != null && changePasswordForm.get('confirmPassword').value != "") {
      const condition = changePasswordForm.get('newPassword').value !== changePasswordForm.get('confirmPassword').value;
      return condition ? { passwordDoNotMatch: true } : null;
    }
  }

  CheckPassword(changePasswordForm: FormGroup) {
    if (changePasswordForm.get('newPassword').value != null && changePasswordForm.get('newPassword').value != "") {
      const condition = changePasswordForm.get('newPassword').value == changePasswordForm.get('oldpassword').value;
      return condition ? { cannotSetSamePassword: true } : null;
    }
  }
  // OLD PASSWORD CHECK
  oldpassword(oldpassword: string) {
    if (this.changePasswordForm['controls']['oldpassword']['status'] == 'VALID') {
      this.userprofileService.oldpassword(oldpassword).subscribe(res => {
        if (res['key'] == true) {
          this.correctPassword = res['key'];
          this.notifier.hideAll();
          this.notifier.notify("error", res['message']);
          this.changePasswordForm['controls']['oldpassword'].reset();
        } else if (res['key'] == false) {
          this.correctPassword = res['key'];
          this.showInfo = true;
        }
      });
    }
  }

  confirmPasswordEnable(event) {
    if (this.changePasswordForm.controls.newPassword.valid && this.changePasswordForm.get('newPassword').value != this.changePasswordForm.get('oldpassword').value) {
      this.changePasswordForm.controls.confirmPassword.enable()
    } else {
      this.changePasswordForm.controls.confirmPassword.reset();
      this.changePasswordForm.controls.confirmPassword.disable()
    }
  }


  // CHANGE PASSWORD
  changePassword(changePasswordForm: FormGroup) {
    if (changePasswordForm["status"] == "VALID") {
      if (changePasswordForm["value"]["newPassword"] === changePasswordForm["value"]["confirmPassword"]) {
        let password: object = { 'new_password': changePasswordForm["value"]["newPassword"], 'id': "null" }
        this.userprofileService.changePassword(password).subscribe(res => {
          if (res["key"] == true) {
            // this.dialogRef.close();
            this.passwordChanged = true;
          }
        });
      }
    } else {
      this.notifier.hideAll();
      this.notifier.notify("error", "Fill all the Password fields to proceed.");
      // this.snackbars.snackbars("error","Fill all the Password fields to proceed.");
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate([''])
  }

  back() {
    console.log(this.location)
    // this.router.navigate(['./dashboard'])
  }

  close() {
    // this.dialogRef.close();
  }
  ngOnDestroy() {
  }
}