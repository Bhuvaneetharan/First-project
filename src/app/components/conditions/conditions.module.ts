import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { SharedModule } from '../../common/shared';
import { CarouselModule } from 'ngx-owl-carousel-o';
const routes: Routes = [
  { path: '', component: TermsAndConditionsComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
];

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'middle',
			distance: 0
		},
		vertical: {
			position: 'top',
			distance: 100,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 2000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [TermsAndConditionsComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    CarouselModule,
    RouterModule.forChild(routes),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [RouterModule]
})
export class ConditionsModule { }
