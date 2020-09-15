import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENT
import { MarketplaceComponent } from './marketplace/marketplace.component';

// ROUTER
import { Routes, RouterModule } from '@angular/router';

// SHARED
import { SharedModule } from '../../common/shared';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const routes: Routes = [
  {path : '', component:MarketplaceComponent}
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
  declarations: [MarketplaceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [],
  exports: [RouterModule]
})
export class MarketplaceModule { }
