import { Component, OnInit, Inject} from '@angular/core';

// DIALOG
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//services
import {UserInformationService } from '../../../../services';


@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
   
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,private userService: UserInformationService) { }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(){
 	  if(this.data.page =="template"){
      this.userService.deleteTemplate(this.data.id).subscribe(res => {
        if(res["key"] == true){
          this.dialogRef.close();
        }
      })
    }else if(this.data.page =="campaign") {
        this.userService.campDelete(this.data.id, "null").subscribe(res => {
          if (res["key"] == true) {
            this.dialogRef.close();
          }
        })
    }else if(this.data.page =="editcamp") {
        this.userService.campDeleteTemplete(this.data.id, this.data["templateId"]).subscribe(res => {
          if (res == true) {
            this.dialogRef.close();
          }
        })
    }
  }
}
