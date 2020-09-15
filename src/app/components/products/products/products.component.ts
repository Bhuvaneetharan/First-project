import { Component, OnInit, ViewChild } from '@angular/core';
// SERVICES
import { NavService, UserInformationService } from '../../../services'
import { ProductService } from '../product.service';
// TABLE DATA SOURCE
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { SnackBar } from '../../../common/shared';
import { ExcelService } from '../../../services/excel.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  //PAGE NO
  pageNo:number;
  //TABLE DATA
  products:any;
  products_scroll:any;
  dataSource =new MatTableDataSource();
  // TABLE HEADERS
  displayedColumns: string[] = ['S.No', 'img', 'product_title', 'asin', 'sku','quantity', 'Actual Cost', 'GST', 'price', 'avg_sales', 'out_of_stock'];
  //CUSTOMER TYPE
  customerException:any;
  //SEARCH BOX VALUE
  searchValue:any;
  //TOTAL PRODUCT COUNT
  productCount:any;
  //ERROR LOG TOGGLE 
  checked:boolean = false;
  //EXPORT
  export_excel:any =[];
  filename: string;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  sortvalue: any = {active: "", direction: ""};

  constructor(private navService:NavService, private productService:ProductService, private snackbar: SnackBar, private userService:UserInformationService, private excel:ExcelService,private http: HttpClient, public translate: TranslateService) { 
    // NAV PANEL HIDE
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
    this.allProducts();
    this.userService.upgradeplan().subscribe(res => {
      this.customerException = res["plan_details"]["plan_name"]
    })
  }
  //TABLE SHOWING PRODUCTS
  allProducts(){
    this.pageNo = 1;
    this.searchValue = null;
    this.productService.products(this.pageNo, this.searchValue, this.checked, this.sortvalue['active'], this.sortvalue['direction']).subscribe(res =>{
      this.products = res['product'];
      this.productCount = res['count'];
      this.dataSource = new MatTableDataSource(this.products);
    })
    this.dataSource.sort = this.sort;
  }
   // VITRUAL SCROLL
   onScroll(event){
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if(this.products.length == (20*this.pageNo)){
        this.pageNo = this.pageNo + 1;
        this.productService.products(this.pageNo, this.searchValue, this.checked, this.sortvalue['active'], this.sortvalue['direction']).pipe(debounceTime(200),throttleTime(50)).subscribe(res =>{
          this.products_scroll = res['product'];
          this.products_scroll.map(item => this.products.push(item));
          this.dataSource = new MatTableDataSource(this.products)
        })
      }
    }
  }

//SEARCH FILTER
  filter(event){
    if(event["target"]["value"].length !=0){
      this.searchValue = event["target"]["value"];
      this.pageNo = 1;
      this.productService.products(this.pageNo, this.searchValue, this.checked, this.sortvalue['active'], this.sortvalue['direction']).subscribe(res =>{
        this.products = res['product'];
        this.productCount = res['count'];
        this.dataSource = new MatTableDataSource(this.products);
      })
    }else if(event["target"]["value"].length == 0){
      this.allProducts();
    }
  }
  //PRODUCT SYNC
   sync(){
    this.snackbar.snackbars('info','Sync has been started')
    this.productService.sync().subscribe()
  }

  //EXPORT
  inventoryexport(){
    this.productService.export().subscribe(res => {
      this.products = res;
      for(var i=0;i<this.products.length;i++){
        this.export_excel.push({
          "S.No":i+1,
          "Products":this.products[i].inventory_items[0].title,
          "ASIN":this.products[i].asin,
          "SKU":this.products[i].sku,
          "Actual Cost":this.products[i].act_price,
          "GST(%)":this.products[i].gst,
          "Selling Price":this.products[i].price,
          "Quantity":this.products[i].quantity,
          "Sales Ranking":this.products[i].avg_sales,
          "Stock Out(Approx. days)":this.products[i].out_of_stock,
        })
      }
      this.excel.exportAsExcelFile(this.export_excel, 'Inventory Details');
    })
  }
  //IMPORT
  upload(files: File[]){
    if(files[0]['type'] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    this.filename = files[0].name
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file',f)) //converting file to binary 
    this.http.post(environment.apiUrl+'inventories/product_import', formData).subscribe(event => {
      if(event['key']==true){
        this.allProducts();
      }
    });
    }else{
      this.snackbar.snackbars('info','Choose an Excel file format to be upload')
    }
  }

  //ERROR LOG TOGGLE
  toggle(event){
    if(event==true){
      this.checked = true;
      this.searchValue = "";
    }else{
      this.checked = false;
      this.searchValue = "";
    }
    this.allProducts();
  }

  //ACTUAL & GST PRICE
  checkGST(actual, gst, price, asin){
    let actualValue = ((Number(actual) / 100)* Number(gst)) + Number(actual)
    let priceValue = Number(price)
    let data = { 'actual_price':actual, 'gst_percentage':gst, 'selling_price':price, 'asin':asin }
    if(actualValue > priceValue){
      Swal.fire({
        title: 'The actual price value is more than amazon seller price. Do you still need to update it?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value == true) {
          this.productService.inventoryPrice(data).subscribe(res =>{
            this.allProducts();
          })
        }
      })
    }else{
      this.productService.inventoryPrice(data).subscribe(res =>{
        this.allProducts();
      })
    }
  }

  //NOT ALLOWING NEGATIVE INPUT
  notAllowNegative(event){
    if(event.charCode > 31 && (event.charCode < 48 || event.charCode > 57)){
      event.preventDefault();
    }
  }

  // Short Headers
  sortData(event){
    this.sortvalue = event;
    this.allProducts();
  }

  ngOnDestroy() { }
 
}
