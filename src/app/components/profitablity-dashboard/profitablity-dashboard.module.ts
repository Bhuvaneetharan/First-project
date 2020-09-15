import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfitablityDashboardComponent } from './profitablity-dashboard/profitablity-dashboard.component';
import { ProfitablityDashboardService } from './profitablity-dashboard.service'
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../common/shared';
import { ProfitReportComponent } from './profit-report/profit-report.component'
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const routes: Routes = [
  {path: '', component:ProfitablityDashboardComponent},
  {path: 'profitReport', component:ProfitReportComponent}
]
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
  declarations: [ProfitablityDashboardComponent, ProfitReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [ProfitablityDashboardService]
})
export class ProfitablityDashboardModule { }
