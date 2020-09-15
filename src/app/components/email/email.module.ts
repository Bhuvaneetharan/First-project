import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { ScheduledmailComponent } from './scheduledmail/scheduledmail.component';
import { SendmailComponent } from './sendmail/sendmail.component';

// ROUTER
import { Routes, RouterModule } from '@angular/router';

// SHARED
import { SharedModule } from '../../common/shared/shared.module'
import { EmailService } from './email.service'
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { Ng2OdometerModule } from 'ng2-odometer';

const routes: Routes = [
   {path: 'schedulemail', component : ScheduledmailComponent},
   {path: 'sentmail', component : SendmailComponent},
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
  declarations: [ 
    ScheduledmailComponent, 
    SendmailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    Ng2OdometerModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [EmailService],
  exports: [RouterModule]
})
export class EmailModule { }
