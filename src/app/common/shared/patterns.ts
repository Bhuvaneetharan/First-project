import { Component } from '@angular/core';

export class Patterns {
onlyNumbers: any = /[0-9]/;
dontAllowSpaces: any = /^\S*$/;
blockCharacterSet:any = /^[A-Za-z0-9 ]+$/;
dontAllowNumbers:any = /^([^0-9]*)$/;
gstPattern :any = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/g;
}
