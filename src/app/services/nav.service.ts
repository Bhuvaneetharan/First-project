import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  visible:boolean;
  chennal:string;

  constructor() { 
    this.visible = false;
  }

  // NAV SHOW
  show(){
    this.visible = true;
  }
  
  // NAV HIDE
  hide(){
    this.visible = false;
  }
  
}
