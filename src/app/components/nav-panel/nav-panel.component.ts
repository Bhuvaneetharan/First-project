import { Component, OnInit, OnDestroy } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

// SERVICES
import { NavService, AuthenticationService, UserInformationService } from '../../services';

// ROUTER
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-nav-panel',
  templateUrl: './nav-panel.component.html',
  styleUrls: ['./nav-panel.component.scss']
})
export class NavPanelComponent implements OnInit, OnDestroy{
  
  counts: any;
  currentURL:any;
  userId: any;
  custName:any;
  status: boolean = false;
  lang: string;
  changelang:string = 'en';
  chennals:any = "Amazon";

  constructor(public translate: TranslateService, public router: Router, public navService: NavService, public authService: AuthenticationService, public userService: UserInformationService) { 
  
    this.navService.chennal = this.chennals
    // Common API's using all Navbar pages
    this.router.events.forEach((event) => {
      this.counts = null;
      if(event instanceof NavigationEnd) {
        if(event['url'] != '/' && event['url'] != '/login/forgot' && event['url'] != '/login' && event['url'] != '/completeregister' && event['url'] != 'terms/forgotpassword' && event['url'] != 'terms'){
          this.userService.upgradeplan().subscribe(res => {
            this.custName = res["name"];
            this.custName = this.custName.substring(0, 1).toUpperCase() + this.custName.substring(1);
          })

          this.userService.daysLeft().subscribe(res => {
            this.counts = res['days'] 
          })
        }
      }
    });

    // Router Switch on terms and forgotpassword
    this.currentURL = window.location.href;
    var urlsplit = this.currentURL.split(/[\s/]+/);
    this.userId = urlsplit[urlsplit.length-1];
    if(urlsplit[2]=='terms' && urlsplit[3]=='forgotpassword'){
      localStorage.setItem('forgot',this.userId)
      this.router.navigate(['terms/forgotpassword']);
    }

    // Multi language
    translate.setDefaultLang('en');
    this.lang = localStorage.getItem('translate_lang')
    this.changelang = localStorage.getItem('translate_lang')
    const browserLang = translate.getBrowserLang();
    if(this.lang != null){
      translate.use(this.lang);
    }else{
      translate.use(browserLang.match(/en|hi|ta/) ? browserLang : 'en');
    }
  }

  ngOnInit() {}

  clickEvent(){
    this.status = !this.status;       
  }

  translateLang(event){
    this.translate.use(event)
    localStorage.setItem('translate_lang', event)
    this.changelang = localStorage.getItem('translate_lang')
  }

  salesChannel(chennal){
    this.chennals = chennal;
    localStorage.setItem('multichannel',this.chennals)
    this.navService.chennal = this.chennals
  }

  // logout
  logout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }
  
  ngOnDestroy(): void {
    
  }
}
