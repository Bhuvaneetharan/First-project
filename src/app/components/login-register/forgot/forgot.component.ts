import { Component, OnInit } from '@angular/core';

// FORMS
import { FormControl, Validators } from '@angular/forms';

// SERVICES
import { UserInformationService } from '../../../services/user-information.service';
import { NavService } from '../../../services'

// SHARES
import { KeyPress } from '../../../common/shared';
import { NotifierService } from 'angular-notifier';

// ROUTERS
import { Router } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  private readonly notifier: NotifierService;
  email: FormControl;
  requestSent:boolean = false;

  constructor(private navService: NavService, private router: Router, private keypress: KeyPress, private userService: UserInformationService, public notifierService: NotifierService) {
    this.notifier = notifierService;
    // NAV PANEL HIDE
    this.navService.hide();
  }

  ngOnInit() {
    // FORMS CONTROL
    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  // SEND FORGOT MAIL ID
  sendReq(email: FormControl) {
    if (email["status"] == "VALID") {
      this.userService.forgotPassword(email.value).subscribe(res => {
        if (res["key"] == true){
          this.requestSent = true;
          this.notifier.notify(res['type'], res['message']);
        }else{
          this.notifier.notify(res['type'], res['message']);
        }
      })
    } else {
      this.notifier.notify("error","Enter the registered Email ID");
    }
  }

  // SPACE NOT ALLOWED
  spaceNotAllowed(event) {
    this.keypress.spaceNotAllowed(event)
  }
  
  ngOnDestroy() {
  }
}