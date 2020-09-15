import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { PaymentComponent } from './payment/payment.component';

// ROUTERS
import { Routes, RouterModule } from '@angular/router';

// SHARED
import { SharedModule } from '../../common/shared';

// SERVICES
import { PaymentWithRegistrationService } from './payment-with-registration.service'
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const routes: Routes = [
  {path: '', component:CompleteRegistrationComponent},
  // {path: 'payment', component:PaymentComponent}
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
  declarations: [CompleteRegistrationComponent, PaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [PaymentWithRegistrationService],
  exports: [RouterModule]
})
export class PaymentWithRegistrationModule { }
