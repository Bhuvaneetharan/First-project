import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";



@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit() {
  }

  close(): void {
    this.bottomSheetRef.dismiss();
    // event.preventDefault();
  }
  ngOnDestroy() {
  }

}
