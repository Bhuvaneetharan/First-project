import { Component, OnInit } from '@angular/core';

// SERVICES
import { NavService } from '../../../services'

import {Location} from '@angular/common';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";



@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private navService: NavService, private location: Location) { 
    this.navService.hide();
  }

  ngOnInit() {
    
  }
  back(){
    this.location.back();
  }
  ngOnDestroy() {
    localStorage.setItem('switch', 'register')
  }
}
