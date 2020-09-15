import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBar } from '../../snackBar';


// SERVICE
import { NavService } from '../../../../services';
import { CampaignSendToService } from './campaign-send-to.service'

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'app-campaign-send-to',
  templateUrl: './campaign-send-to.component.html',
  styleUrls: ['./campaign-send-to.component.scss']
})
export class CampaignSendToComponent implements OnInit {

    listData:any;
    campaignsend_scroll: any;
    selectedAsin: any[] = [];
    pageNo:any = 1;
    geolistKey: any;
    toggle:any;
  constructor(public dialogRef: MatDialogRef<CampaignSendToComponent>, @Inject(MAT_DIALOG_DATA) public data , private campaignsendtoService: CampaignSendToService, public snakbar:SnackBar) { }

  ngOnInit() {
    
    if(this.data["sendCustomer"] == 'Top Product Customers'){
      console.log(this.data);
      this.campaignsendtoService.topProduct(this.pageNo).subscribe(res => {
        this.listData = res['orders'];
        this.listData = this.listData.map(result => ({
          'asin': result["asin"],
          'title': result["title"][0],
          'order_id': result["title"][1],
          'order_quantity': result["order_quantity"],
          'checked': false
        }))
        console.log(this.listData);
      })
    }else if(this.data["sendCustomer"] == 'Geo Customers'){
      this.campaignsendtoService.geo_graph("90").subscribe(res => {
        this.listData = res['graph_data'];
        this.listData.shift();
        this.listData = this.listData.map(result => ({
          'city': result[0],
          'count': result[1],
          'checked': false
        }))
      })
    }else if(this.data["sendCustomer"] == 'Repeated Customers'){
      this.campaignsendtoService.repeatedCustomers(this.pageNo).subscribe(res =>{
        this.listData = res['customer'];
        this.listData = this.listData.map(result => ({
          'email': result[0][0],
          'count': result[1],
          'checked': false
        }))
      })
    }
  }
  
  clear() {
    this.dialogRef.close(this.selectedAsin);
  }

  asinSend(){
    if(this.selectedAsin.length != 0){
      this.dialogRef.close(this.selectedAsin);
    }else{
      this.snakbar.snackbars('info','Please select any one')
    }
  }

  SelectedAsins(event, asins) {
    if (event["checked"] == true) {
      if (this.selectedAsin.length <= 1) {
        this.selectedAsin.push(asins);
      }
    } else if (event["checked"] == false) {
      const index: number = this.selectedAsin.indexOf(asins);
      if (index !== -1) {
        this.selectedAsin.splice(index, 1);
      }
    }
  }

  SelectedCustomers(event,data){
    if(event['checked']== true){
      this.campaignsendtoService.repeatedCustSelected(this.data["campaignId"],data).subscribe()
    }
    else{
      this.campaignsendtoService.repeatedCust(this.data["campaignId"],data).subscribe()
    }
  }
  enableAll(event){
    if(event['checked']==true){
      this.campaignsendtoService.enableAll(this.data["campaignId"]).subscribe(res =>{
        console.log(this.listData)
        
        this.listData = this.listData.map(result => ({
          'email': result.email,
          'count': result.count,
          'checked': true
        }))
        
      })
       
    }
    else{
      this.campaignsendtoService.disableAll(this.data["campaignId"]).subscribe(res =>{
        this.listData = this.listData.map(result => ({
          'email': result.email,
          'count': result.count,
          'checked': false
        }))
      })
    }
  }
 
// VITRUAL SCROLL
  onScroll(event) {
    this.pageNo = 1;
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.listData.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        if(this.data["sendCustomer"] == 'Top Product'){
          this.campaignsendtoService.topProduct(this.pageNo).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
            this.campaignsend_scroll = res['orders'];
            this.campaignsend_scroll = this.campaignsend_scroll.map(result => ({
              'asin': result["asin"],
              'title': result["title"][0],
              'order_id': result["title"][1],
              'order_quantity': result["order_quantity"],
              'checked': false
            }))
          })
        }
          // else if(this.data["sendCustomer"] == 'Geo Customers'){ 

            // this.geolistKey = Object.keys(this.campaignsend_scroll["data"]);
            // this.campaignsend_scroll = this.geolistKey.map(result => ({
            //   'city': result,
            //   'count': this.campaignsend_scroll["data"][result],
            //   'checked': false
            // }))
         
          // }
        this.campaignsend_scroll.map(item => this.listData.push(item));
      }
    }
  }
   ngOnDestroy() {
  }
}
 