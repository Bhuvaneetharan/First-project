import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogsService } from './dialogs.service';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { SnackBar } from '../../snackBar';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  pageNo: number;

  // DATA
  listData: any;
  listData_scroll: any;
  selectedAsin: any[] = [];
  searchValue: any;
  checking: any = false;

  constructor(public snakbar:SnackBar, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public dialogService: DialogsService) { }

  ngOnInit() {
    this.selectedAsin = [];
    this.dialogService.seletedAsins().subscribe(res => {
      for (let i = 0; i < res["length"]; i++) {
        this.selectedAsin.push(res[i]["asin"])  
      }
    });
    this.allAsins();
  }

  allAsins() {
    this.pageNo = 1;
    this.searchValue = null;
    this.dialogService.product(this.pageNo, this.searchValue).subscribe(res => {
      this.listData = res['product'];
      this.listData = this.listData.map((result) => ({
        'title': result.inventory_items[0].title,
        'asin': result['asin'],
        'small_image': result.inventory_items[0].small_image,
        'checked': result.review_flag,
      }))
    })
  }

  // asin() {
  //   let data = { 'asins': this.selectedAsin }
  //   this.dialogService.sendAsins(data).subscribe(res => {
  //     if (res) {
  //       this.dialogService.scraper().subscribe(res => { });
  //       this.dialogRef.close();
  //     }
  //   });
  // }

  SelectedAsins(event, asins: string, indexs) {
    if (event["checked"] == true) {
      if (this.selectedAsin.length <= 5) {
        this.selectedAsin.push(asins);
        let data = { 'asins': this.selectedAsin }
        this.dialogService.sendAsins(data).subscribe(res => {
          if (res) {
            this.dialogService.scraper().subscribe(res => { });
          }
        });
      }else{
        this.snakbar.snackbars("info","Maximum of 5 ASINs only allowed.")
      }
    } else if (event["checked"] == false) {
      const index: number = this.selectedAsin.indexOf(asins);
      if (index !== -1) {
        this.selectedAsin.splice(index, 1);
        let data = { 'asins': this.selectedAsin }
        this.dialogService.sendAsins(data).subscribe(res => {
          if (res) {
            this.dialogService.scraper().subscribe(res => { });
          }
        });
      }
    }
  }
  clearAll(){
    // this.pageNo = 1
    this.selectedAsin = [];
    let data = { 'asins': this.selectedAsin }
    this.dialogService.sendAsins(data).subscribe(res => {
    });
    this.allAsins();
    // this.ngOnInit()
    // this.dialogService.product(this.pageNo, this.searchValue).subscribe(res => {
    //   this.listData = res['product'];
    //   this.listData["review_flag"]=false;
    //   this.listData = this.listData.map((result) => ({
    //     'title': result.inventory_items[0].title,
    //     'asin': result['asin'],
    //     'small_image': result.inventory_items[0].small_image,
    //     'checked': result.review_flag,
    //   }))
    // })
    // this.dialogService.clearAll().subscribe(res =>{
    //   console.log(res)
    // })
  }
  close() {
    this.dialogRef.close();
  }
  filter(event) {
    if (event["target"]["value"].length != 0) {
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.dialogService.product(this.pageNo, this.searchValue).subscribe(res => {
        this.listData = res['product'];
        this.listData = this.listData.map((result) => ({
          'title': result.inventory_items[0].title,
          'asin': result['asin'],
          'small_image': result.inventory_items[0].small_image,
          'checked': result.review_flag
        }))
      });
    } else if (event["target"]["value"].length == 0) {
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
      if (this.listData.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.dialogService.product(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.listData_scroll = res['product'];
          this.listData_scroll = this.listData_scroll.map((result) => ({
            'title': result.inventory_items[0].title,
            'asin': result['asin'],
            'small_image': result.inventory_items[0].small_image,
            'checked': result.review_flag
          }))
          this.listData_scroll.map(item => this.listData.push(item));
        })
      }
    }
  }
 ngOnDestroy() {
  }
}
