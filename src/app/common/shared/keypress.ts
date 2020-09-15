import { Component, Injectable } from '@angular/core';
import { Patterns } from './patterns';

@Injectable({
  providedIn: 'root'
})

export class KeyPress {
  constructor(public patterns: Patterns){}
    values:any;
    keypress(event: any){
        let inputChar = String.fromCharCode(event.charCode);
        
        if(event.charCode!=0){
          if (!this.patterns["onlyNumbers"].test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
          }
        }
    }

    spaceNotAllowed(event:any){
      let inputChar = String.fromCharCode(event.charCode);
        if(event.charCode!=0){
          if (!this.patterns["dontAllowSpaces"].test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
          }
        }
    }

    dontallowNumbers(event: any){
      let inputChar = String.fromCharCode(event.charCode);
      
      if(event.charCode!=0){
        if (!this.patterns["dontAllowNumbers"].test(inputChar) || !this.patterns["blockCharacterSet"].test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
        }
      }
  }
}