import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { KeyPress, Patterns, SnackBar } from '../../../common/shared';
import { UserprofileService } from '../../userprofile'
import { PasswordStrengthValidator } from '../../../common/shared/custom-validator'
import { NotifierService } from 'angular-notifier';
import { NavService, AuthenticationService } from '../../../services'
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  private readonly notifier: NotifierService;

  changePasswordForm: FormGroup;
  id:any;
  hide:any = true;
  passwordChanged:boolean = false;

  constructor(public authService:AuthenticationService,private navService: NavService,private formBuilder: FormBuilder, public router:Router,public route: ActivatedRoute, public keypress: KeyPress, public pattern: Patterns, public snackbars: SnackBar, private userprofileService: UserprofileService, public notifierService: NotifierService) { 
    this.notifier = notifierService;
    this.navService.hide();
  }
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
  ngOnInit() {
    this.id = localStorage.getItem('forgot')
    console.log(this.id)
    this.changePasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, PasswordStrengthValidator, Validators.minLength(8), Validators.maxLength(15)]],
      confirmPassword: [{value:'', disabled: true}, [Validators.required, PasswordStrengthValidator, Validators.minLength(8), Validators.maxLength(15)]]
    },{
      validator: this.passwordValidator
  });
  }
  newPwdCheck(){
   
  }
  passwordValidator(changePasswordForm: FormGroup){
    if(changePasswordForm.get('confirmPassword').value!=null && changePasswordForm.get('confirmPassword').value!=""){
      const condition = changePasswordForm.get('newPassword').value !== changePasswordForm.get('confirmPassword').value;
      return condition? { passwordDoNotMatch :true} : null;
    }
  }

  confirmPasswordEnable(){
    if(this.changePasswordForm.controls.newPassword.status == "VALID"){
      // this.userprofileService.oldpassword(this.changePasswordForm.controls.newPassword.value).subscribe(res => {
      //   console.log(res)
        this.changePasswordForm.controls.confirmPassword.enable()
      // });
    }
  }

  // CHANGE PASSWORD
  changePassword(changePassword: FormGroup) {
    if (changePassword["status"] == "VALID") {
      if (changePassword["value"]["newPassword"] === changePassword["value"]["confirmPassword"]) {
        let password: object = { 'new_password': changePassword["value"]["newPassword"], 'id': this.id }
        this.userprofileService.changePassword(password).subscribe(res => {
          if (res["key"] == true) {
            // this.notifier.hideOldest();
            // this.notifier.notify(res['type'],res['message']);
            // this.router.navigate([''])
            this.passwordChanged = true;
          }
        });
      } else {
        this.snackbars.snackbars("error","Your password and confirmation password do not match.");
      }
    } else {
      this.snackbars.snackbars("error","Please enter the new password in the field.");
    }
  }
  logout(){
    this.authService.logout();
    this.router.navigate([''])
  }

}
