import { Component, OnInit, Inject } from '@angular/core';

// DIALOG
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// SERVICE
import { AsinsService } from './asins.service';

// SHARES
import { SnackBar } from '../../snackBar'

// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";


@Component({
  selector: 'app-asins',
  templateUrl: './asins.component.html',
  styleUrls: ['./asins.component.scss']
})

export class AsinsComponent implements OnInit {

  pageNo: number;
  listData: any;
  listData_scroll: any;
  toggle:any;
  selectedAsin: any[] = [];
  selectedData:any[]=[];
  count:any ='' ;
  totalCount:any;
  searchValue:any;
  loader : boolean = false;

  constructor(public snakbar: SnackBar, public dialogRef: MatDialogRef<AsinsComponent>, @Inject(MAT_DIALOG_DATA) public data, public asinService: AsinsService) { }

  ngOnInit() {
    this.pageNo = 1;
    this.searchValue = null;
    this.asinService.product(this.pageNo, this.searchValue, this.data['chennal_settings']).subscribe(res => {
      this.listData = res['product']
      this.totalCount = res['count']
      this.listData = this.listData.map(item => ({
        'title': item.inventory_items[0].title,
        'asin': item.asin,
        'small_image': item.inventory_items[0].small_image,
        'review_flag': false
      }));
    this.selectedAsinCheck();
      
    })
    
  }

  // CHECKBOX CHECK
  SelectedAsins(event, asin) {
    if (event["checked"] == true) {
      if (this.selectedAsin.length <= 3) {
        this.selectedAsin.push(asin);
        this.count = this.selectedAsin.length;
        this.listData.find(v => v.asin == asin).review_flag = true;
      }
    }else if (event["checked"] == false) {
      const index: number = this.selectedAsin.indexOf(asin);
      if (index !== -1) {
        this.selectedAsin.splice(index, 1);
        this.count = this.selectedAsin.length;
        this.listData.find(v => v.asin == asin).review_flag = false;
      }
    }
  }

  filter(event){
    if(event["target"]["value"].length != 0){
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.asinService.product(this.pageNo, this.searchValue, this.data['channel_settings']).subscribe(res => {
      this.listData = res['product']
      this.totalCount = res['count']
        this.listData = this.listData.map(item => ({
          'title': item.inventory_items[0].title,
          'asin': item.asin,
          'small_image': item.inventory_items[0].small_image,
          'review_flag': false
        }));
        this.selectedAsinCheck();
      })
    }else if(event["target"]["value"].length == 0){
      this.ngOnInit();
    }
  }

  selectedAsinCheck(){
    this.selectedAsin = this.data['asins']
    this.count = this.selectedAsin.length
    for(let i = 0; i<this.listData.length;i++){
      for(let j = 0; j<this.selectedAsin.length; j++){
        if(this.listData[i]['asin'] == this.selectedAsin[j]){
           this.listData.find(v => v.asin == this.listData[i]['asin']).review_flag = true;
        }
      }
    }
  }

  confirm(){
    this.asinService.confirmAsins(this.selectedAsin).subscribe(res =>{
      // localStorage.setItem('asins', JSON.stringify(this.selectedAsin))
      this.dialogRef.close({html:res, count:this.count, asins: this.selectedAsin});
    })
  }

  // DIALOG CLOSE
  clear() {
      this.dialogRef.close(); 
  }

  // VIRTUAL SCROLL
  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.listData.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.asinService.product(this.pageNo, this.searchValue, this.data['channel_settings']).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.listData_scroll = res['product'];
            this.listData_scroll = this.listData_scroll.map(item => ({
              'title': item.inventory_items[0].title,
              'asin': item.asin,
              'small_image': item.inventory_items[0].small_image,
              'review_flag': false
            }));
          this.listData_scroll.map(item => this.listData.push(item));
          this.selectedAsinCheck();
        })
      }
    }
  }

  ngOnDestroy() {
  }
}
