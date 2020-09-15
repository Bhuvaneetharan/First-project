import { Component, OnInit } from '@angular/core';

// SERCVICES
import { MarketplaceService } from '../marketplace.service'
import { NavService, UserInformationService } from '../../../services'

// SHARES
import { SnackBar, KeyPress, Patterns } from '../../../common/shared'

// FORMS
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import Swal from 'sweetalert2'
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {

  // FORM GROUP
  marketPlace: FormGroup;

  // EDIT ENABLE DESAIBLE
  hide: boolean = false;

  // DATA
  marketPlaceDatas: any;
  constructor(private keypress: KeyPress, private snackbars: SnackBar, private pattern: Patterns, public userService: UserInformationService, private marketService: MarketplaceService, private navService: NavService, public translate: TranslateService) {
    // NAVBAR HIDE SHOW
    this.navService.show();
  }

  ngOnInit() {
    // FORM GROUP
    this.marketPlace = new FormGroup({
      'sellerId': new FormControl('', [Validators.required, Validators.pattern(this.pattern.dontAllowSpaces)]),
      'MWS': new FormControl('' , [Validators.required, Validators.pattern(this.pattern.dontAllowSpaces)])
    })
    // MARKETPLACE
    this.marketService.marketplaceInfo().subscribe(res => {
      this.marketPlaceDatas = res;
      if (res["key"] != false) {
        this.hide = res["key"];
        this.marketPlace.setValue({
          'sellerId': res["seller_id"],
          'MWS': res["mws_auth_token"]
        })
      }
    })
  }

  // SPACE NOT ALLOWED
  spaceNotAllowed(event) {
    this.keypress.spaceNotAllowed(event)
  }

  // EDIT ENABLE
  enableEdit() {
    this.hide = false;
  }

  // MARKETPLACE SYNC
  sync(markerplace: FormGroup) {
    if (markerplace["valid"] == true) {
      let mws: string = markerplace["value"]["MWS"].replace(/\s/g, "");
      let seller_id: string = markerplace["value"]["sellerId"].replace(/\s/g, "");
      let sentMarkerplace: object = { seller_id: seller_id, mws_auth_token: mws }
      this.marketService.marketplaceUpdate(sentMarkerplace).subscribe(res => {
          this.userService.userStatus().subscribe(res => {
            Swal.fire(
              'Info',
              'Syncing has started! While syncing, kindly check your email by clicking the link received from "Amazon Web Services". Notification will be sent to your email once the sync has done.',
              'warning'
            )
          });
        this.hide = true;
        this.marketService.accountSync().subscribe(res => { })
      });
    } else {
      this.snackbars.snackbars("error","Please fill mandatory fields");
     }
  }

  // RESEND VERIFICATION MAIL
  resendCode() {
    this.marketService.resendCode().subscribe();
  }
  ngOnDestroy() {
  }
}
