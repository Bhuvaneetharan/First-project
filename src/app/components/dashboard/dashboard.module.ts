import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';

// ROUTER
import { RouterModule, Routes } from '@angular/router';

// SHARED
import { SharedModule } from '../../common/shared/shared.module'

// SERVICE
import { DashboardsService } from './dashboards.service'

import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { NgCircleProgressModule } from 'ng-circle-progress';
import {MatDatepickerModule} from '@angular/material/datepicker';

const routes: Routes = [
  { path: '', component: DashboardComponent }
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
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatDatepickerModule,
    LayoutModule,
    NotifierModule.withConfig(customNotifierOptions),

    NgCircleProgressModule.forRoot({
      // set defaults here
      backgroundStrokeWidth: 10,
      backgroundPadding: 10,
      radius: 52,
      space: -20,
      toFixed: 0,
      outerStrokeWidth: 20,
      innerStrokeWidth: 20,
      imageHeight: 157,
      imageWidth: 97,
      "showTitle": false,
      "showSubtitle": false,
      "showUnits": false,
      "responsive": true
    }),
  ],
  providers: [DashboardsService],
  exports: [RouterModule]
})
export class DashboardModule { }
