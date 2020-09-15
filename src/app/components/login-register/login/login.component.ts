import { Component, OnInit, OnDestroy } from '@angular/core';
import { PasswordStrengthValidator } from '../../../common/shared/custom-validator'
// FORMS
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// SHARES
import { KeyPress, Patterns } from '../../../common/shared'

import { NotifierService } from 'angular-notifier';

// SERVICES
import { NavService, AuthenticationService, UserInformationService } from '../../../services'
import { CookieService } from 'ngx-cookie-service';

// ROUTERS
import { Router, RouterEvent, NavigationEnd,RoutesRecognized } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { OwlOptions } from 'ngx-owl-carousel-o';
import { filter, pairwise } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private readonly notifier: NotifierService;

  // LOGIN FORMGROUP
  loginForm: FormGroup;
  Formdata: any;
  // HIDE PASSWORD
  hide: boolean = true;
  //REGISTER FORMGROUP
  registerForm: FormGroup;
  // HIDE PASSWORD
  hide1: boolean = true;
  testing:any;
  loginValidate: any;
  testing1:any;
  requestSent:any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    nav: true,
    navText: ['<span class="material-icons">keyboard_arrow_left</span>', '<span class="material-icons">keyboard_arrow_right</span>'],
    autoplay: true,
    center: true,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
  }

  //CHECKBOX
  termsAndCondition: FormControl;
  switch: any = 'login';
  email: FormControl;
  termsback:any = null;

  constructor(private cookieService: CookieService, public pattern: Patterns, public keypress: KeyPress, public notifierService: NotifierService, private formBuilder: FormBuilder, public router: Router, private navService: NavService, private authService: AuthenticationService, private userService: UserInformationService) {
    this.notifier = notifierService;
    // NAV PANEL HIDE    
    this.navService.hide();
    if(localStorage.getItem('switch') != null){
      this.switch = localStorage.getItem('switch');
      this.termsback = JSON.parse(localStorage.getItem('register'));
    }
    localStorage.clear();
  }
  

  ngOnInit() {
    
    // Login Form Group
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.pattern.dontAllowSpaces)]],
    });

    // TERMS CHECKBOX
    this.termsAndCondition = new FormControl();

    // REGISTER FORMS
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.pattern.dontAllowSpaces)]],
      sellerName: ['', Validators.required],
      fName: ['',  [Validators.required]],
      password: ['', [Validators.required, PasswordStrengthValidator, Validators.minLength(8), Validators.maxLength(15)]],
      cpassword: [{value:'', disabled: true}, [Validators.required, PasswordStrengthValidator, Validators.minLength(8), Validators.maxLength(15)]]
    },{
        validator: this.passwordValidator
    });
    if(this.termsback != null){
      console.log(this.termsback)
      this.registerForm.patchValue(this.termsback)
    }

    // Reminder Me
    if (this.cookieService.get('remember') == "true") {
      this.Formdata = true;
      this.loginForm.setValue({
        email: this.cookieService.get('username'),
        password: this.cookieService.get('password')
      })
    }

    this.email = new FormControl('', [Validators.required, Validators.email]);
  }
  
  // LOGIN FUNCTIONALITY
  login(loginValue: FormGroup) {
    localStorage.clear();
    if (loginValue.status == "VALID") {
      let email = loginValue["value"]["email"].toLowerCase();
      this.authService.preLogin(email, loginValue["value"]["password"]).subscribe(res =>{
        this.loginValidate = res;
        if(res['key'] == true){
          this.authService.login(email, loginValue["value"]["password"]).subscribe(res => {
            if (res) {
              this.userService.userStatus().subscribe(res => {
                this.cookieService.set('username', email);
                this.cookieService.set('password', loginValue["value"]["password"]);
                this.cookieService.set('remember', this.Formdata);
                this.router.navigate(['dashboard']);
              });
            }
          });
        }
      })
    }
  }

  // SEND REGISTER VALUES
  register(registerValue: FormGroup) {
    let sellerName = registerValue["value"]["sellerName"].trim()
    this.registerForm.patchValue({
      sellerName : sellerName,
    })

    if (this.registerForm["value"]["password"] === this.registerForm["value"]["cpassword"]) {
      let email = registerValue["value"]["email"].toLowerCase()
      let data = { 'email': email, 'mobileNo': registerValue["value"]["mobileNo"], 'sellerName': sellerName, 'cusName':  registerValue["value"]["fName"] , 'password':this.registerForm["value"]["password"]}
      this.userService.userRegister(data).subscribe(res => {
        if (res["key"]) {
          this.authService.login(email, this.registerForm["value"]["password"]).subscribe(res => {
            if (res) {
              this.userService.userStatus().subscribe(res => {
                this.router.navigate(['dashboard']);
              });
            }
          });
        }
      })
    }else{
      this.notifier.hideOldest();
      this.notifier.notify("error","Your password and confirmation password do not match.");
    }
  }
  passwordValidator(registerForm: FormGroup){
    if(registerForm.get('cpassword').value!=null && registerForm.get('cpassword').value!=""){
      const condition = registerForm.get('password').value !== registerForm.get('cpassword').value;
      return condition? { passwordDoNotMatch :true} : null;
    }
  }

  emailChange(){
    if(this.loginValidate!=undefined){
      this.loginValidate['key']=true
    }
  }

  terms(){
    localStorage.setItem('register', JSON.stringify(this.registerForm['value']))
  }
  
  confirmPasswordEnable(){
    if(this.registerForm.controls.password.valid){
      this.registerForm.controls.cpassword.enable()
    }else{
      this.registerForm.controls.cpassword.reset()
      this.registerForm.controls.cpassword.disable()
    }
  }
   
  keyDownFunction(event, loginValue){
    if(event.keyCode == 13) {
      this.login(loginValue);
    }
  }

  // SPACE NOT ALLOWED
  spaceNotAllowed(event) {
    this.keypress.spaceNotAllowed(event)
  }

  //FIRST CHARACTER AS SPACE NOT ALLOWED
  firstNoSpace(e, name){
    if (e.keyCode == 32 && !this.registerForm["value"][name]){  
      e.preventDefault();
    }else{
      this.testing = e['srcElement']['value']
    }
  }

  // UNIQ EMAIL VERIFY
  email_uniq(email: string) {
    if (this.registerForm["controls"]["email"]["status"] == "VALID") {
      let emails = email.toLowerCase()
      this.userService.email_uniq(emails).subscribe(res => {
        if (res["key"] == false) {
          this.registerForm["controls"]["email"].reset();
        }
      });
    }
  }

  // UNIQ PASSWORD VERIFY
  phone_uniq(phone: string) {
    if (this.registerForm["controls"]["mobileNo"]["status"] == "VALID") {
      this.userService.phone_uniq(phone).subscribe(res => {
        if (res["key"] == false) {
          this.registerForm["controls"]["mobileNo"].reset();
        }
      });
    }
  }

  changeRegister(value){
    this.switch = value
    this.registerForm.reset();
  }

  // SEND FORGOT MAIL ID
  sendReq(email: FormControl) {
    if (email["status"] == "VALID") {
      this.userService.forgotPassword(email.value).subscribe(res => {
        if (res["key"] == true){
          // this.switch = 'login';
          this.requestSent = res;
        }else if(res["key"] == false){
          this.notifier.notify(res['type'],res['message']);
        }
      })
    } else {
      this.notifier.notify("error","Enter the registered Email ID");
    }
  }
    
  ngOnDestroy(): void {

  }
}
