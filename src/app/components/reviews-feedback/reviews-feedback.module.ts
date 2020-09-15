import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTS
import { ProductReviewComponent } from './product-review/product-review.component';
import { SellerNegativeFeedbackComponent } from './seller-negative-feedback/seller-negative-feedback.component';

// ROUTER
import { Routes, RouterModule } from '@angular/router';

// SHARED
import { SharedModule } from '../../common/shared';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const routes: Routes = [
  {path: 'sellerreview', component:SellerNegativeFeedbackComponent},
  {path: 'productreview', component:ProductReviewComponent}
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
  declarations: [ProductReviewComponent, SellerNegativeFeedbackComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [RouterModule]
})
export class ReviewsFeedbackModule { }
