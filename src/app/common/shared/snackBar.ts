import { Component, Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

// SNACKBAR
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class SnackBar {
  private readonly notifier: NotifierService;

    constructor(private snackBar: MatSnackBar, public notifierService: NotifierService,){
      this.notifier = notifierService;
    }
    
    snackbars(type,message){
      this.notifier.hideAll();
      this.notifier.notify( type, message);
        // this.snackBar.open(message,"", {
        //   duration: 5000,
        //   verticalPosition: 'top'
        // });
      }
}