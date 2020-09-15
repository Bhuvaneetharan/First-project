import { Component, OnInit } from '@angular/core';

// DIALOG
import { MatDialog } from '@angular/material/dialog';

// COMPONENT
import { AsinsComponent, TemplateDialogComponent } from '../../../../common/shared/dialogs';

// SERVICE
import { NavService, UserInformationService } from '../../../../services';
import { CampaignsService } from '../../campaigns.service';

import { Router, ActivatedRoute } from '@angular/router';

// SHARES
import { SnackBar } from '../../../../common/shared';
import Swal from 'sweetalert2'

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { DeleteDialogComponent } from '../../../../common/shared';
import {Location} from '@angular/common';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-campaigns',
  templateUrl: './edit-campaigns.component.html',
  styleUrls: ['./edit-campaigns.component.scss']
})
export class EditCampaignsComponent implements OnInit {
  
  campaignValues:any;
  campaignName: string = "";
  campaignId: any;
  selectCampaignFor: string = "Future";
  selectChannelSettings: string = "";
  senddata: any[] = [];
  selectedTemplate: any;
  purposeSelect:any;
  count: any;
  subjectName = null;
  
  // DATE RANGE PICKER

  previousStart: any;
  previousStartMax: any;
  previousEndMax:any;
  previousEnd:any;

  constructor(private userService: UserInformationService, private datePipe: DatePipe, public snackbars: SnackBar, public dialog: MatDialog, public router: Router,public route: ActivatedRoute, public navService: NavService, private campaignService: CampaignsService, private location: Location) {
    this.navService.show();
    this.campaignId = this.route.snapshot.paramMap.get('id')
   }

  ngOnInit() {
    this.previousStartMax=moment().subtract(5,'days')
    this.previousStartMax=this.previousStartMax["_d"]

    this.campaignService.campEdit(this.campaignId).subscribe(res =>{
      this.campaignValues = res;

      this.campaignName = res["campaign"]["campaign_name"];
      this.selectCampaignFor = res["campaign"]["campaign_purpose"];
      this.selectChannelSettings = res["campaign"]["campaign_channels"];
      this.selectedTemplate = res["template"];
      this.previousStart = res["campaign"]["ordered_days_start"];
      this.previousEnd = res["campaign"]["ordered_days_end"];
      this.purposeSelect = res["campaign"]["campaign_exclude"];

      this.selectedTemplate = this.selectedTemplate.map(result => ({
        'template_subject': result["template_subject"],
        'mail_trigger_days': result["mail_trigger_days"],
        'mail_trigger_on': result["mail_trigger_on"],
        'id': result["id"]
      }))

      // this.campaignService.campcount(this.campaignId, this.purposeSelect).subscribe(res =>{
      //   this.count = res["count"]
      // })
    })
  }

  goBack(){
    this.location.back();
  }

  campaignFor(event) {
    this.selectCampaignFor = event.value;
  }

  channelSetting(event) {
    this.selectChannelSettings = event.value;
  }

  selectAsins() {
    if (this.campaignName["length"] != 0) {
      if (this.selectChannelSettings["length"] != 0) {
        if (this.campaignId != null) {
            this.openDialog(this.campaignId);
        }
      } else {
        this.snackbars.snackbars("error","Select channel to edit");
      }
    } else {
      this.snackbars.snackbars("error","Enter the campaign name to edit");
    }
  }

  purpose(event){
    this.purposeSelect = event.value;
  }

  campUnique(event) {
    this.campaignService.campaignUnique(event["target"]["value"]).subscribe(res => {
      if (res["key"] == false) {
        this.campaignName = "";
      }
    })
  }

  // DATE RANGE PICKER
  addEvent(event){
    this.previousStart =this.datePipe.transform(this.previousStart, 'yyyy-MM-dd');
    const myDate =  moment(this.previousStart,'YYYY-MM-DD');
    const vals = myDate.add(30,'days');
    let setPreviousMaxDate =this.datePipe.transform(vals, 'yyyy-MM-dd');
    var dateOne = new Date(); 
    var dateTwo = new Date(setPreviousMaxDate); 
   
    if(dateOne <= dateTwo){
      this.previousEndMax = this.previousStartMax;
    }else{
      this.previousEndMax = new Date(setPreviousMaxDate); 
    }
  }

  dateRange(event) {
    this.previousEnd = this.datePipe.transform(this.previousEnd, 'yyyy-MM-dd'); 
  }

  addTemplate() {
    const dialogRef = this.dialog.open(TemplateDialogComponent,{
        panelClass: 'custom-dialog-container',
        disableClose: true,
        data: { 
          'campaignid': this.campaignId 
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.campaignService.campaignTemplate(this.campaignId).subscribe(res => {
        this.selectedTemplate = res;
        this.selectedTemplate = this.selectedTemplate.map(result => ({
          'template_subject': result["template_subject"],
          'mail_trigger_days': result["mail_trigger_days"],
          'mail_trigger_on': result["mail_trigger_on"]
        }))
      })

    });
  }
  
  sendTo(event, value) {
    if (event["checked"]) {
      this.senddata.push(value);
    } else {
      const index: number = this.senddata.indexOf(value);
      if (index !== -1) {
        this.senddata.splice(index, 1);
      }
    }
  }

  createCampaings() {
    let data;
    if(this.selectCampaignFor == "Future"){
      data = { 
        'campaign_exclude': this.senddata, 
        'flag': true, 
        'id': this.campaignId, 
        'campaign_name': this.campaignName 
      }
    }else{
      data = { 
        'campaign_exclude': this.senddata, 
        'flag': true, 
        'id': this.campaignId, 
        'campaign_name': this.campaignName, 
        'start_date': this.previousStart, 
        'end_date':this.previousEnd 
      }
    }
  
    this.campaignService.updateCampain(data).subscribe(res => {
      if(res["key"] == true){
        this.campaignService.previousSchedule(this.campaignId,this.subjectName).subscribe();
        this.router.navigate(['campaigns/campaign/listcampaigns']);
      }
    })
  }

  // DIALOG
  openDialog(campaignId: string): void {
    const dialogRef = this.dialog.open(AsinsComponent,
      {
        panelClass: 'custom-dialog-container',
        disableClose: true,
        data: {
          'status':this.purposeSelect,  
          'campaignid': campaignId, 
          'campaignpurpose':this.selectCampaignFor, 
          'channel': this.selectChannelSettings
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      // this.campaignService.campcount(this.campaignId, this.purposeSelect).subscribe(res =>{
      //   this.count = res["count"]
      // })
    });
  }

  deleteTemplate(template){

     Swal.fire({
  title: 'Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then((result) => {
  if (result.value) {
        this.userService.campDeleteTemplete(this.campaignId, template).subscribe(res => {
      if(res){
        this.ngOnInit();
    //      Swal.fire(
    //   'Deleted!',
    //   '',
    //   'success'
    // )
      }
    })
   
  // For more information about handling dismissals please visit
  // https://sweetalert2.github.io/#handling-dismissals
  } 
  // else if (result.dismiss === Swal.DismissReason.cancel) {
  //   Swal.fire(
  //     'Cancelled',
  //     '',
  //     'error'
  //   )
  // }
})
    // const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //   width: '250px',
    //   data: {
    //     'id': this.campaignId,
    //     'page':"editcamp", 
    //     'templateId': template
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   this.ngOnInit()
    // });
  }

  ngOnDestroy() {
    this.campaignId = null;
  }
}
