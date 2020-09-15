import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PreviewService } from './preview.service';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-priview',
  templateUrl: './priview.component.html',
  styleUrls: ['./priview.component.scss']
})
export class PriviewComponent implements OnInit {
  htmlStr:any;
  constructor(private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PriviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public previewService: PreviewService) {}

  ngOnInit() {
    this.htmlStr="";    
    // this.htmlStr=this.data.id;
    this.htmlStr=this.sanitizer.bypassSecurityTrustHtml(this.data.id);

  }

  close(){
    this.dialogRef.close();
  }

}
