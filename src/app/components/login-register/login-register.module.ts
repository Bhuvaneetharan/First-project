import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTERS
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';

// SHARED MODULE
import { SharedModule } from '../../common/shared'
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CookieService } from 'ngx-cookie-service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent},
];

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'middle',
			distance: 0
		},
		vertical: {
			position: 'top',
			distance: 12,
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
  declarations: [
    LoginComponent,
    ForgotComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CarouselModule,
  
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [CookieService],
  exports: [RouterModule]
})
export class LoginRegisterModule { }
