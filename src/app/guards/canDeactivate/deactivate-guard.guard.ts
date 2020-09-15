import { Injectable } from '@angular/core';
import { Router,ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { SnackBar } from '../../common/shared'
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuardGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(public router: Router, public snackbar: SnackBar){}

  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {

    let paymentUpdate = JSON.parse(localStorage.getItem("authentication"));

    if(currentState["url"] == "/marketplace"){
      if(paymentUpdate["marketpalce"]){
        if(paymentUpdate["cus_status"]){
          return true;
        }else if(nextState["url"]=="/userprofile" || nextState["url"]=="/upgradeplan" || nextState["url"]=="/invoices" || nextState["url"]=="/"){
          return true;
        }else{
          this.snackbar.snackbars("info","Plan expired. Renew your account by choosing your preferred plan.");
          return false;
       }  
      }else if(nextState["url"]=="/userprofile" || nextState["url"]=="/upgradeplan" || nextState["url"]=="/invoices" || nextState["url"]=="/"){
        return true;
      }else{
        this.snackbar.snackbars("info"," Synchronise your account with the valid credentials to proceed.");
        return false;
     }
    }else if(currentState["url"] == "/upgradeplan"){
      if(paymentUpdate["marketpalce"]){
        if(paymentUpdate["cus_status"]){
          return true;
        }else if(nextState["url"]=="/userprofile" || nextState["url"]=="/marketplace" || nextState["url"]=="/invoices" || nextState["url"]=="/"){
          return true;
        }else{
          this.snackbar.snackbars("info","Plan expired. Renew your account by choosing your preferred plan.");
          return false;
       }  
      }else if(nextState["url"]=="/userprofile" || nextState["url"]=="/marketplace" || nextState["url"]=="/invoices" || nextState["url"]=="/"){
        return true;
      }else{
        this.snackbar.snackbars("info"," Synchronise your account with the valid credentials to proceed.");
        return false;
     }
    }else if(currentState["url"] == "/userprofile" || nextState["url"]=="/"){
      if(paymentUpdate["marketpalce"]){
        if(paymentUpdate["cus_status"]){
          return true;
        }else if(nextState["url"]=="/upgradeplan" || nextState["url"]=="/marketplace" || nextState["url"]=="/invoices" || nextState["url"]=="/"){
          return true;
        }else{
          this.snackbar.snackbars("info","Plan expired. Renew your account by choosing your preferred plan.");
          return false;
       }  
      return false;   
      }else if(nextState["url"]=="/upgradeplan" || nextState["url"]=="/marketplace" || nextState["url"]=="/invoices" || nextState["url"]=="/"){
        return true;
      }else{
         this.snackbar.snackbars("info"," Synchronise your account with the valid credentials to proceed.");
         return false;
      }
     }else if(currentState["url"] == "/invoices"){
      if(paymentUpdate["marketpalce"]){
        if(paymentUpdate["cus_status"]){
          return true;
        }else if(nextState["url"]=="/upgradeplan" || nextState["url"]=="/marketplace" || nextState["url"]=="/userprofile" || nextState["url"]=="/"){
          return true;
        }else{
          this.snackbar.snackbars("info","Plan expired. Renew your account by choosing your preferred plan.");
          return false;
       }  
      return false;   
      }else if(nextState["url"]=="/upgradeplan" || nextState["url"]=="/marketplace" || nextState["url"]=="/userprofile" || nextState["url"]=="/"){
        return true;
      }else if(nextState["url"]=="/"){

      }else{
         this.snackbar.snackbars("info"," Synchronise your account with the valid credentials to proceed.");
         return false;
      }
    }
  }
}
