import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// ROUTERS
import { RouterModule, Routes } from '@angular/router';
import { NotifierModule, NotifierOptions } from 'angular-notifier';


const routes: Routes = [
  { path: 'campaign', loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignModule)},
  { path: 'template', loadChildren: () => import('./template/template.module').then(m => m.TemplateModule)},
  { path: 'promotion', loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule)},

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
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [RouterModule],
  providers: []
})
export class CampaignsModule { }
