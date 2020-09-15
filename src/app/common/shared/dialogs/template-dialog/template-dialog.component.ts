import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TemplateDialogService } from './template-dialog.service';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { SnackBar } from '../../snackBar'
@Component({
  selector: 'app-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {
  
  templatePurpose:any = "0";
  templateData:any;
  pageNo:number;
  templateData_scroll:any;
  count:any=[];

  constructor(public snackbars: SnackBar, public dialogRef: MatDialogRef<TemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public templateService: TemplateDialogService) { }

  ngOnInit() {
    this.temp_list(); 
  }

  temp_list(){
    this.pageNo = 1;
    this.templateService.temp_list(this.pageNo, this.templatePurpose, this.data["campaignid"]).subscribe(res => {
      this.templateData = res["template"];
    })
  }

  purpose(event){
    this.templatePurpose = event["value"];
    this.temp_list();
  }

  templateSelect(event, temp_id){
    if(event["checked"]){
      this.templateService.tempPush(temp_id, this.data["campaignid"]).subscribe(res => {})
      this.count.push(temp_id)
    }else{
      const index: number = this.count.indexOf(temp_id);
        if (index !== -1) {
          this.count.splice(index, 1);
        }
      this.templateService.tempPop(temp_id, this.data["campaignid"]).subscribe(res => {})
    }
  }

  clear(){
    this.dialogRef.close();
  }
  close(){
    // if(this.count.length != 0){
    this.dialogRef.close();
  // }else{
  //   this.snackbars.snackbars('info', 'Please select atleast one Template')
  // }
  }

  onScroll(event){
    const tableViewHeight = event.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = event.target.scrollHeight // length of all table
    const scrollLocation = event.target.scrollTop; // how far user scrolled
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if(this.templateData.length == (20*this.pageNo)){
        this.pageNo = this.pageNo + 1;
        this.templateService.temp_list(this.pageNo, this.templatePurpose, this.data["campaignid"]).pipe(debounceTime(200),throttleTime(50)).subscribe(res =>{
          this.templateData_scroll = res["template"];
          this.templateData_scroll.map(item => this.templateData.push(item));
        })
      }
    }
  }
   ngOnDestroy() {
  }
}
