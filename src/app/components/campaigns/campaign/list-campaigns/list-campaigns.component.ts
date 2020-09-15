import { Component, OnInit } from '@angular/core';

//ANIMATION 
import {animate, state, style, transition, trigger} from '@angular/animations';

// TABLE DATA SOURCE
import { MatTableDataSource } from '@angular/material';

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';

// SERVICE
import { NavService, UserInformationService } from '../../../../services';
import { CampaignsService } from '../../campaigns.service'
import {TranslateService} from '@ngx-translate/core';

// ROUTER
import { Router } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
//Dialog
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-list-campaigns',
  templateUrl: './list-campaigns.component.html',
  styleUrls: ['./list-campaigns.component.scss'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({height: '0px', minHeight: '0',display:'table'})),
      state('collapsed', style({})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListCampaignsComponent implements OnInit {

  columnsToDisplay : string[] = ['name', 'mail', 'for', 'channel','date', 'delete'];
  dataSource = new MatTableDataSource();
  expandedElement: any;
  
  pageNo: number;
  campaignList: any;
  searchValue: any;
  campaignList_scroll: any;
  campaignNothing: any;
  campaignExpand: any;
  showSearch: boolean = false;
  customerException: any;

  constructor(private userService: UserInformationService, public router: Router, public navService: NavService, private campaignService: CampaignsService, public dialog: MatDialog, public translate: TranslateService) {
    this.navService.show();
  }

  ngOnInit() {
    this.campaignService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })
    this.allcampaigns();
  }

  toggle(event, campId) {
    if (event["checked"]) {
      this.campaignService.campActive(campId).subscribe()
    } else {
      Swal.fire({
        title: 'If you disable this campaign,emails scheduled for this campaign will be cleared from the list.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.campaignService.campDeactivate(campId).subscribe()
        }else{
          this.ngOnInit()
        }
      })
    }
  }

 delete(campId){
   Swal.fire({
  title: 'Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then((result) => {
  if (result.value) {
  this.userService.campDelete(campId, "delete").subscribe(res => {
      if(res){
        this.ngOnInit();
      }
    })
  } 
})
  }

  clearSearch(){
    this.allcampaigns();
  }

  addCampaign(){
    this.campaignService.campVerify().subscribe(res =>{
      if(res == true){
        this.router.navigate(['campaigns/campaign/addcampaigns'])
      }
    })
  }

  allcampaigns() {
    this.pageNo = 1;
    this.searchValue = null;
    this.campaignService.listCampaign(this.pageNo, this.searchValue).subscribe(res => {
      this.campaignList = res;
      this.campaignNothing = res;
      this.campaignList.map(item => ({
        'campaign_name': item.campaign_name,
        'campaign_purpose': item.campaign_purpose,
        'template_purpose': item.template_purpose.toString()
      }));
      this.dataSource = new MatTableDataSource(this.campaignList);
    })
  }

  filter(event) {
    if (event["target"]["value"].length >= 3) {
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.campaignService.listCampaign(this.pageNo, this.searchValue).subscribe(res => {
        this.campaignList = res;
        this.campaignList.map(item => ({
          'campaign_name': item.campaign_name,
          'campaign_purpose': item.campaign_purpose,
          'template_purpose': item.template_purpose.toString()
        }));
        this.dataSource = new MatTableDataSource(this.campaignList)
      });
    } else if (event["target"]["value"].length == 0) {
      this.allcampaigns();
    }
  }

  editCampaign(id) {
    console.log(id)
    this.router.navigate(['/campaigns/campaign/addcampaigns'],{queryParams: {id :id}})
  }

  expand(id){
   this.campaignService.campExpend(id).subscribe(res => {
     this.campaignExpand = res;
   })
  }

  // VITRUAL SCROLL
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.campaignList.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.campaignService.listCampaign(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.campaignList_scroll = res;
          this.campaignList_scroll.map(item => ({
            'campaign_name': item.campaign_name,
            'campaign_purpose': item.campaign_purpose,
            'template_purpose': item.template_purpose.toString()
          }));
          this.campaignList_scroll.map(item => this.campaignList.push(item));
          this.dataSource = new MatTableDataSource(this.campaignList)
        })
      }
    }
  }

  ngOnDestroy() {}
}
