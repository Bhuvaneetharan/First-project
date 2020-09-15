import { Injectable } from '@angular/core';

// ROUTER
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ActivateGuardGuard implements  CanActivate {
  
  constructor(public router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    let authNav = JSON.parse(localStorage.getItem("authentication"));
    if(localStorage.length == 0){
      this.router.navigate([''])
      return false;
    }
    else if(authNav["marketpalce"] == true){
      if(authNav["cus_status"] == true){
        // ACTIVE CUSTOMERS (GO TO DASHBOARD)
        return true;
      }
      // EXPIRED CUSTOMER (GO TO UPGRADEPLAN)
      this.router.navigate(['upgradeplan'])
      return false;
    }
    else if(authNav["cus_reg"] == true){
      // ALLREADY REGISTERED CUSTOMER (GO TO MARKETPLACE)
      this.router.navigate(['marketplace'])
      return false;
    }else{
      //  NEW CUSTOMER (GO TO COMPLETE REGISTRATION PAGE)
       this.router.navigate(['completeregister'])
      return false;  
    }
  }
}
 