import { Component, OnInit } from '@angular/core';

// DATA SOURCE FOR TABLE DATA
import { MatTableDataSource } from '@angular/material';


import { CampaignsService } from '../../campaigns.service';
import { NavService, UserInformationService } from '../../../../services'
import { NotifierService } from 'angular-notifier';
// RXJS
import { debounceTime, throttleTime } from 'rxjs/operators';

// ROUTER
import { Router } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

//Dialog
import {MatDialog} from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../common/shared';
import Swal from 'sweetalert2'
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  private readonly notifier: NotifierService;
  displayedColumns: string[] = ['position', 'name', 'subject', 'campPurpose', 'purposeof', 'lastModified', 'delete'];
  dataSource:any = new MatTableDataSource();
  
  templateData:any;
  templateData_scroll:any;
  pageNo:number;
  searchValue:any;
  showSearch: boolean = false;
  noTemplateData:any;
  
  constructor(private userService: UserInformationService,public router: Router, public campaginService: CampaignsService, private navService: NavService, public dialog: MatDialog, public translate: TranslateService,public notifierService: NotifierService) { 
    // NAV PANEL HIDE
    this.navService.show();
    this.notifier = notifierService;
  }

  ngOnInit() {
     this.alltemplates();
  }

  alltemplates(){
    this.pageNo = 1;
    this.searchValue = null;
    this.campaginService.allTemplates(this.pageNo, this.searchValue).subscribe(res => {
     this.templateData = res;
     this.noTemplateData = res;
     this.dataSource = new MatTableDataSource(this.templateData);
    })
  }

  delete(id){

     Swal.fire({
  title: 'Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then((result) => {
  if (result.value) {
      this.userService.deleteTemplate(id).subscribe(res => {
      if(res){
        this.notifier.notify(res['type'],res['message']);
        this.ngOnInit();
      this.alltemplates();
      }
    })
   
  // For more information about handling dismissals please visit
  // https://sweetalert2.github.io/#handling-dismissals
  }
  //  else if (result.dismiss === Swal.DismissReason.cancel) {
    // Swal.fire(
    //   'Cancelled',
    //   '',
    //   'error'
    // )
  // }
})
    // const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //   width: '250px',
    //   data: {
    //     'id': id,
    //     'page':"template"
    //   }
    // });

   // dialogRef.afterClosed().subscribe(result => {
   //    this.alltemplates();
   //  });
  }

  editTemplate(id){
    this.campaginService.templateVerify(id).subscribe(res => {
      if(res['key'] == false){
        this.router.navigate(['/campaigns/template/createtemplate'],{queryParams: {id: id}})
      }
    })
  }

  filter(event){
    if(event["target"]["value"].length >= 3){
      this.pageNo = 1;
      this.searchValue = event["target"]["value"];
      this.campaginService.allTemplates(this.pageNo, this.searchValue).subscribe(res => {
        this.templateData = res;
        this.dataSource = new MatTableDataSource(this.templateData)
      });
    }else if(event["target"]["value"].length == 0){
      this.alltemplates();
    }
  }

  clearSearch(){
    this.alltemplates();
  }

  onScroll(event) {
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (this.templateData.length == (20 * this.pageNo)) {
        this.pageNo = this.pageNo + 1;
        this.campaginService.allTemplates(this.pageNo, this.searchValue).pipe(debounceTime(200), throttleTime(50)).subscribe(res => {
          this.templateData_scroll = res;
          this.templateData_scroll.map(item => this.templateData.push(item));
          this.dataSource = new MatTableDataSource(this.templateData)
        })
      }
    }
  }

  clearData(){
    this.alltemplates()
  }

  restoredata(){
    this.campaginService.restore().subscribe(res=>{
      this.alltemplates();
    })
  }

  ngOnDestroy() {}
}
