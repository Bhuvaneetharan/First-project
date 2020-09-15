import { Component, OnInit } from '@angular/core';
// SERVICES
import { NavService } from '../../../../services'
import { CampaignsService } from '../../campaigns.service'
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// SHARES
import { SnackBar } from '../../../../common/shared';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material';
import { PriviewComponent } from '../../../../common/shared/dialogs/priview/priview.component'
import {TranslateService} from '@ngx-translate/core';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import {Location} from '@angular/common';
// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';
@Component({
  selector: 'app-list-promotion',
  templateUrl: './list-promotion.component.html',
  styleUrls: ['./list-promotion.component.scss']
})
export class ListPromotionComponent implements OnInit {
  private readonly notifier: NotifierService;
  searchValue:any = null;
  pageNo:number;
  promotions:any;
  dataSource = new MatTableDataSource();
  htmlStr:any;
  promotions_scroll:any;
  displayedColumns: string[] = ['position', 'name', 'title', 'channel', 'asinCount', 'coupon', 'valid', 'createdAt', 'preview','delete'];
  constructor(public dialog: MatDialog, public campaginService: CampaignsService, public snackbars:SnackBar, public router: Router, private navService:NavService, private campaignService: CampaignsService, private location: Location,public notifierService: NotifierService, public translate: TranslateService) { 
       // NAV PANEL HIDE
       this.navService.show();
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.pageNo = 1;
    this.campaginService.listPromotion(this.pageNo, this.searchValue).subscribe(res =>{
      this.promotions = res;
      this.dataSource = new MatTableDataSource(this.promotions);
    })
  }
  filter(event){
    if (event["target"]["value"].length != 0) {
      this.searchValue = event["target"]["value"];
      this.ngOnInit()
    }else{
      this.searchValue = null;
      this.ngOnInit()
    }
  }
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.promotions.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.campaginService.listPromotion(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.promotions_scroll = res;
          this.promotions_scroll.map(item => this.promotions.push(item));
          this.dataSource = new MatTableDataSource(this.promotions)
        })
      }
    }
  }

  priview(template){
    this.htmlStr = template;
    const dialogRef = this.dialog.open(PriviewComponent, {
      width: '600px',
      height: '900px',
      data: {id: this.htmlStr}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  editPromotion(id){
    this.router.navigate(['/campaigns/promotion/createpromotion'],{queryParams: {id: id}})
    // this.campaginService.editPromotion(id).subscribe(res =>{

    // })
  }
  deletePromotion(id){
   this.campaginService.delete_promo(id).subscribe(res=>{
     if(res['key']==true){
      this.notifier.notify("success",res['message']);
      this.ngOnInit()
     }
   })
  }
  
}
