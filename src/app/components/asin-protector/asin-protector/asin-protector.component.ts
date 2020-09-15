import { Component, OnInit, Inject } from '@angular/core';
import { NavService} from '../../../services'
import { AsinProtectorService } from '../asin-protector.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { debounceTime, throttleTime } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-asin-protector',
  templateUrl: './asin-protector.component.html',
  styleUrls: ['./asin-protector.component.scss']
})
export class AsinProtectorComponent implements OnInit {
 
  products:any;
  pageNo:number = 1;
  productsCount:any;
  productName:any='total';
  products_scroll:any;
  searchValue:any = null;
  id:any;
  counterfeits:any;
  comp:any = null;
  showSearch: boolean = false;
  constructor(private navService: NavService, public productServe: AsinProtectorService, public dialog: MatDialog, public translate: TranslateService) {
    this.navService.show();

    // Multi language
    translate.setDefaultLang('en');
    let lang = localStorage.getItem('translate_lang')
    const browserLang = translate.getBrowserLang();
    if(lang != null){
      translate.use(lang);
    }else{
      translate.use(browserLang.match(/en|hi|ta/) ? browserLang : 'en');
    }
   }

  ngOnInit() {
    this.pageNo=1;
    this.productServe.productsPage(this.pageNo,this.comp, this.searchValue).subscribe(res => {
      this.products = res
    })
  }

  review(id): void {
    this.id = id
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      height: '600px',
      panelClass: 'custom-dialog-container2',
      data: {id: this.id},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // Search Box
  filter(event) {    
    if (event["target"]["value"].length != 0) {
      // Set Search Value
      this.searchValue = event["target"]["value"];
      this.ngOnInit();
    }else{
      this.searchValue = null;
      this.ngOnInit();
    }
  }

  onScroll(event){
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      console.log(this.products)
      console.log(this.pageNo)
      if(this.products['product'].length == (20*this.pageNo)){
        this.pageNo = this.pageNo + 1;
        this.productServe.productsPage(this.pageNo,this.comp, this.searchValue).pipe(debounceTime(200),throttleTime(50)).subscribe(res =>{
          this.products_scroll = res;
          this.products_scroll['product'].map(item => this.products['product'].push(item));
          // this.dataSource = new MatTableDataSource(this.products)
        })
      }
    }
  }

  action(asin){
    this.productServe.tackAction(asin).subscribe(res =>{
      this.ngOnInit();
    })
        
  }

}

@Component({
  selector: 'dialogs',
  templateUrl: 'compitatorlist.html',
})
export class DialogOverviewExampleDialog {
  pageNo:any;
  products:any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data, public productServe: AsinProtectorService) {}

  ngOnInit(){
    this.pageNo=1
   this.productServe.competitorAnalysis(this.data['id']).subscribe(res =>{
   this.data=res['product'];
   this.products=res['data'];
   })
  }

  close(): void {
    this.dialogRef.close();
  }
  report(asin){
    this.productServe.tackAction(asin).subscribe(res =>{
      this.ngOnInit();
    })
  }

}